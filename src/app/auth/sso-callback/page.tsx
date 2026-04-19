'use client';

import { Suspense, useEffect, useRef, useState } from "react";
import { AuthenticateWithRedirectCallback, useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import CollegeSearchSelect from "@/components/colleges/collegeSelect";
import { collegesWithClubs } from "@/components/colleges/college";
import DiceBearAvatar from "@/components/DicebearAvatars";
import { resolveSsoIntentStable } from "@/lib/ssoIntent";
import {
  extractCollegeFromUserRecord,
  shouldPromptForCollege,
} from "@/lib/collegeProfile";

function getBackendBase(): string | null {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base || base === "undefined") return null;
  return base.replace(/\/$/, "");
}

/**
 * Single shape for completing OAuth profile — mirrors email signup clerkLogin fields
 * plus aliases many backends expect (profileAvatar, username, imgUrl).
 */
const PLACEHOLDER_COLLEGES = new Set(
  ["not joined", "not_joined", "n/a", "na", "none", "null", "undefined", "-", "—"].map(s => s.toLowerCase())
);

function buildClerkLoginCompleteBody(params: {
  clerkId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  college: string;
  phone: string;
}) {
  const { clerkId, email, displayName, avatarUrl, college, phone } = params;
  // Don't send college fields when value is a placeholder — avoids overwriting real college on backend
  const isRealCollege = college.trim() !== "" && !PLACEHOLDER_COLLEGES.has(college.trim().toLowerCase());
  return {
    clerkId,
    email,
    name: displayName,
    username: displayName,
    ...(isRealCollege ? { collegeName: college, college, college_name: college } : {}),
    phone: phone || "",
    ...(avatarUrl
      ? { avatarUrl, profileAvatar: avatarUrl, imgUrl: avatarUrl }
      : {}),
  };
}

export default function SSOCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xl font-medium animate-pulse">Loading…</p>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  );
}

function SSOCallbackContent() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const intentQuery = searchParams.get("intent");

  const oauthStartedRef = useRef(false);
  /** Signup intent: show form before any backend call. */
  const [needsCollege, setNeedsCollege] = useState(false);
  /** Sign-in intent but profile incomplete (no campus / placeholder). */
  const [needsCollegeSignin, setNeedsCollegeSignin] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [backendSyncing, setBackendSyncing] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup" | null>(null);
  const [clerkUserInfo, setClerkUserInfo] = useState<{
    email: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!backendSyncing) return;
    const t = setTimeout(() => {
      toast.error("Could not sync your profile. Please try signing in again.");
      router.push("/auth/signin");
    }, 120000);
    return () => clearTimeout(t);
  }, [backendSyncing, router]);

  useEffect(() => {
    if (!authLoaded || !userLoaded || !isSignedIn || !user) return;
    if (oauthStartedRef.current) return;
    oauthStartedRef.current = true;

    let cancelled = false;

    const email = user.emailAddresses[0]?.emailAddress;
    const clerkId = user.id;
    const name = user.fullName || user.firstName || "User";
    const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

    if (!email || !clerkId) {
      toast.error("Missing required user information");
      router.push("/auth/signup");
      return;
    }

    const intent = resolveSsoIntentStable(intentQuery);

    // The app used to assume that intent === "signup" meant we should
    // unconditionally prompt for the college name. But existing users
    // who accidentally clicked "Sign Up" were forced to re-enter their details.
    // Let the backend decide by directly logging them in and checking the returned profile.
    // See lines below which check `shouldPromptForCollege(collegeStr)`.

    const base = getBackendBase();
    if (!base) {
      toast.error("App configuration error: backend URL is missing.");
      router.push("/auth/signin");
      return;
    }

    setBackendSyncing(true);

    void (async () => {
      try {
        // Step 1: Check if user already exists in our backend DB
        let userExists: boolean | null = null; // tri-state: null = unknown, true = exists, false = doesn't exist
        let userHasCollege = false;
        try {
          const checkRes = await axios.post(
            `${base}/api/v2/user/auth/checkUserExists`,
            { email }
          );
          userExists = checkRes.data?.exists === true;
          userHasCollege = checkRes.data?.hasCollege === true;
        } catch {
          // If check fails, leave userExists as null (unknown)
          // The clerkLogin call will handle both existing and new users correctly
          console.warn("[sso-callback] checkUserExists failed, proceeding with clerkLogin");
        }

        if (cancelled) return;

        // Step 2: Branch based on whether user exists
        // If check failed (userExists is null), proceed with clerkLogin which handles both cases
        if (userExists === true) {
          // Existing user — call clerkLogin to sync Clerk data & get JWT
          // Don't send avatarUrl (Google photo) — only send custom-chosen avatars during signup form
          // Pass "not joined" — buildClerkLoginCompleteBody filters placeholders so backend won't overwrite real college
          const res = await axios.post(
            `${base}/api/v2/user/auth/clerkLogin`,
            buildClerkLoginCompleteBody({
              clerkId,
              email,
              displayName: name,
              college: "not joined",
              phone: "",
            })
          );

          if (cancelled) return;

          if (!res.data?.token) {
            toast.error("Login failed: no session from server.");
            setTimeout(() => router.push("/auth/signin"), 2000);
            return;
          }

          const token = res.data.token as string;
          localStorage.setItem("token", token);
          sessionStorage.setItem("activeSession", "true");

          // If we already know they have a real college, skip the profile fetch
          if (userHasCollege) {
            toast.success("Login successful!");
            router.push("/dashboard");
            return;
          }

          // Otherwise, fetch profile to double-check college status
          let profile: unknown = null;
          try {
            const userRes = await axios.get(`${base}/api/v1/user/getUser`, {
              headers: { authorization: `Bearer ${token}` },
            });
            profile = userRes.data?.user ?? null;
          } catch (e) {
            console.warn("[sso-callback] getUser failed, will show full profile form", e);
          }

          if (cancelled) return;

          const collegeStr = extractCollegeFromUserRecord(profile);
          const mustCollectCampus = shouldPromptForCollege(collegeStr);

          if (mustCollectCampus) {
            setClerkUserInfo({ email, clerkId, name, avatarUrl });
            setDisplayName(name);
            // Existing users keep their avatar — don't force them to re-pick
            setNeedsCollegeSignin(true);
            return;
          }

          toast.success("Login successful!");
          router.push("/dashboard");
        } else if (userExists === null) {
          // Check failed (endpoint down) — call clerkLogin anyway, let backend handle it
          // Don't send avatarUrl (Google photo) — only send custom-chosen avatars during signup form
          // Pass "not joined" — buildClerkLoginCompleteBody filters placeholders so backend won't overwrite real college
          const res = await axios.post(
            `${base}/api/v2/user/auth/clerkLogin`,
            buildClerkLoginCompleteBody({
              clerkId,
              email,
              displayName: name,
              college: "not joined",
              phone: "",
            })
          );

          if (cancelled) return;

          if (!res.data?.token) {
            toast.error("Login failed: no session from server.");
            setTimeout(() => router.push("/auth/signin"), 2000);
            return;
          }

          const token = res.data.token as string;
          localStorage.setItem("token", token);
          sessionStorage.setItem("activeSession", "true");

          // Fetch profile to determine if they need to complete it
          let profile: unknown = null;
          try {
            const userRes = await axios.get(`${base}/api/v1/user/getUser`, {
              headers: { authorization: `Bearer ${token}` },
            });
            profile = userRes.data?.user ?? null;
          } catch (e) {
            console.warn("[sso-callback] getUser failed after clerkLogin", e);
          }

          if (cancelled) return;

          const collegeStr = extractCollegeFromUserRecord(profile);
          const mustCollectCampus = shouldPromptForCollege(collegeStr);

          if (mustCollectCampus) {
            setClerkUserInfo({ email, clerkId, name, avatarUrl });
            setDisplayName(name);
            // Existing users keep their avatar — don't force them to re-pick
            setNeedsCollegeSignin(true);
            return;
          }

          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          // userExists === false — new user, show profile form
          // Pre-populate Google name but let them edit it
          setClerkUserInfo({ email, clerkId, name, avatarUrl });
          setDisplayName(name); // Pre-fill with Google name but editable
          setCustomAvatarUrl(""); // Empty for new signup — user must choose their own avatar
          setAuthType("signup");
          setNeedsCollege(true);
          setBackendSyncing(false);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const ax = err as { response?: { status?: number; data?: { msg?: string } } };
        const status = ax.response?.status;
        if (status === 404) {
          // User not found in backend — show profile form inline for new Google signups
          // Pre-populate Google name but let them edit it
          setClerkUserInfo({ email, clerkId, name, avatarUrl });
          setDisplayName(name); // Pre-fill with Google name but editable
          setCustomAvatarUrl(""); // Empty for new signup — user must choose their own avatar
          setAuthType("signup");
          setNeedsCollege(true);
          setBackendSyncing(false);
        } else {
          toast.error(ax.response?.data?.msg || "Login failed");
          setTimeout(() => router.push("/auth/signin"), 2000);
        }
      } finally {
        if (!cancelled) setBackendSyncing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoaded, userLoaded, isSignedIn, user, router, intentQuery]);

  const showProfileCompletion =
    (needsCollege || needsCollegeSignin) && clerkUserInfo;

  if (showProfileCompletion && clerkUserInfo) {
    const fromSigninIncomplete = needsCollegeSignin && !needsCollege;
    const finalName = displayName.trim() || clerkUserInfo.name || "User";
    // Don't fall back to Google photo — user must pick their own avatar
    const finalAvatarUrl =
      customAvatarUrl ||
      `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(finalName)}&size=128`;

    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">
              {fromSigninIncomplete ? "Welcome! Set up your profile" : "Almost there!"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {fromSigninIncomplete
                ? "Choose a display name, avatar, and college so your campus feed and profile are complete."
                : "Tell us a bit about you to finish creating your account."}
            </p>
            <p className="text-gray-500 text-xs mt-2">{clerkUserInfo.email}</p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const college = collegeName.trim();
              const validCollege = collegesWithClubs.some((c) => c.college === college);
              if (!college || !validCollege) {
                toast.error("Please select your college/university from the list");
                return;
              }
              if (!displayName.trim()) {
                toast.error("Please enter a display name");
                return;
              }
              setSubmitting(true);
              try {
                const base = getBackendBase();
                if (!base) throw new Error("Missing backend URL");
                const res = await axios.post(
                  `${base}/api/v2/user/auth/clerkLogin`,
                  buildClerkLoginCompleteBody({
                    clerkId: clerkUserInfo.clerkId,
                    email: clerkUserInfo.email,
                    displayName: displayName.trim(),
                    avatarUrl: finalAvatarUrl,
                    college,
                    phone: phone.trim(),
                  })
                );
                if (res.data.token) {
                  localStorage.setItem("token", res.data.token);
                  sessionStorage.setItem("activeSession", "true");
                  toast.success(
                    fromSigninIncomplete
                      ? "Profile saved — welcome to Zynvo!"
                      : "Account created successfully!"
                  );
                  router.push("/dashboard");
                } else {
                  throw new Error("No token received");
                }
              } catch (err: unknown) {
                const ax = err as { response?: { data?: { msg?: string } }; message?: string };
                toast.error(
                  ax.response?.data?.msg ||
                    ax.message ||
                    (fromSigninIncomplete ? "Could not save your profile." : "Signup failed.")
                );
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-5"
          >
            <div>
              <p className="text-gray-400 text-sm mb-2">Avatar</p>
              <DiceBearAvatar
                name={displayName.trim() || clerkUserInfo.name || "User"}
                onAvatarChange={(url: string) => setCustomAvatarUrl(url)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Display name <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                autoComplete="nickname"
              />
              <p className="text-gray-500 text-xs mt-1">
                This is your public name on Zynvo (you can edit it later in settings).
              </p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                College / University <span className="text-yellow-500">*</span>
              </label>
              <CollegeSearchSelect
                colleges={[...collegesWithClubs].sort((a, b) =>
                  a.college.localeCompare(b.college)
                )}
                value={collegeName}
                onChange={(v) => setCollegeName(v)}
                placeholder="Search and select your college"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Phone number{" "}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                autoComplete="tel"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !collegeName.trim() || !displayName.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                submitting || !collegeName.trim() || !displayName.trim()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {submitting
                ? ((authType ?? "signin") === "signin" ? "Logging in..." : "Creating account...")
                : ((authType ?? "signin") === "signin" ? "Complete Login" : "Complete Signup")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const showOAuthHandler = authLoaded && !isSignedIn;

  const statusMessage = !isSignedIn
    ? "Signing you in with Google…"
    : backendSyncing
      ? "Syncing your profile with Zynvo…"
      : "Verifying your account…";

  return (
    <>
      {showOAuthHandler && <AuthenticateWithRedirectCallback />}
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse text-center">{statusMessage}</p>
        <p className="text-gray-500 text-sm mt-3 text-center max-w-sm">
          If this takes more than a minute, check your connection and try again.
        </p>
      </div>
    </>
  );
}
