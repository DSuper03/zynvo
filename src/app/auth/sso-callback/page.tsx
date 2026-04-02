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
  const [needsCollege, setNeedsCollege] = useState(false);
  const [needsCollegeSignin, setNeedsCollegeSignin] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  /** Backend JWT sync in progress (sign-in path). */
  const [backendSyncing, setBackendSyncing] = useState(false);
  const [clerkUserInfo, setClerkUserInfo] = useState<{
    email: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  /** Only while backend sync runs after Clerk sign-in — do not time out during Google redirect. */
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
    const googleImage = user.imageUrl?.trim();
    const avatarUrl =
      googleImage ||
      `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

    if (!email || !clerkId) {
      toast.error("Missing required user information");
      router.push("/auth/signup");
      return;
    }

    const intent = resolveSsoIntentStable(intentQuery);

    if (intent === "signup") {
      setDisplayName(name);
      setClerkUserInfo({ email, clerkId, name, avatarUrl });
      setNeedsCollege(true);
      return;
    }

    const base = getBackendBase();
    if (!base) {
      toast.error("App configuration error: backend URL is missing.");
      router.push("/auth/signin");
      return;
    }

    setBackendSyncing(true);

    void (async () => {
      try {
        const res = await axios.post(`${base}/api/v2/user/auth/clerkLogin`, {
          clerkId,
          email,
          name,
          avatarUrl,
          collegeName: "not joined",
          college: "not joined",
          college_name: "not joined",
        });

        if (cancelled) return;

        if (!res.data?.token) {
          toast.error("Login failed: no session from server.");
          setTimeout(() => router.push("/auth/signin"), 2000);
          return;
        }

        const token = res.data.token as string;
        localStorage.setItem("token", token);
        sessionStorage.setItem("activeSession", "true");

        let profile: unknown = null;
        try {
          const userRes = await axios.get(`${base}/api/v1/user/getUser`, {
            headers: { authorization: `Bearer ${token}` },
          });
          profile = userRes.data?.user ?? null;
        } catch (e) {
          console.warn("[sso-callback] getUser failed, will prompt for campus", e);
        }

        if (cancelled) return;

        const collegeStr = extractCollegeFromUserRecord(profile);
        const mustCollectCampus = shouldPromptForCollege(collegeStr);

        if (mustCollectCampus) {
          setClerkUserInfo({ email, clerkId, name, avatarUrl });
          setDisplayName(name);
          setNeedsCollegeSignin(true);
          return;
        }

        toast.success("Login successful!");
        router.push("/dashboard");
      } catch (err: unknown) {
        if (cancelled) return;
        const ax = err as { response?: { status?: number; data?: { msg?: string } } };
        const status = ax.response?.status;
        if (status === 404) {
          toast.error("No account found. Please sign up first.");
          setTimeout(() => router.push("/auth/signup"), 2000);
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
  }, [
    authLoaded,
    userLoaded,
    isSignedIn,
    user,
    router,
    intentQuery,
  ]);

  if (needsCollege && clerkUserInfo) {
    const finalName = displayName.trim() || clerkUserInfo.name || "User";
    const finalAvatarUrl =
      customAvatarUrl ||
      `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(finalName)}&size=128`;

    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Almost there!</h2>
            <p className="text-gray-400 text-sm">{clerkUserInfo.email}</p>
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
              setSubmitting(true);
              try {
                const base = getBackendBase();
                if (!base) throw new Error("Missing backend URL");
                const res = await axios.post(`${base}/api/v2/user/auth/clerkLogin`, {
                  clerkId: clerkUserInfo.clerkId,
                  email: clerkUserInfo.email,
                  name: finalName,
                  avatarUrl: finalAvatarUrl,
                  collegeName: college,
                  college,
                  college_name: college,
                  imgUrl: "",
                  phone: phone.trim(),
                });
                if (res.data.token) {
                  localStorage.setItem("token", res.data.token);
                  sessionStorage.setItem("activeSession", "true");
                  toast.success("Account created successfully!");
                  router.push("/dashboard");
                } else {
                  throw new Error("No token received");
                }
              } catch (err: unknown) {
                const ax = err as { response?: { data?: { msg?: string } }; message?: string };
                toast.error(ax.response?.data?.msg || ax.message || "Signup failed.");
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-5"
          >
            <DiceBearAvatar
              name={finalName}
              onAvatarChange={(url: string) => setCustomAvatarUrl(url)}
            />

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                autoComplete="off"
              />
              <p className="text-gray-500 text-xs mt-1">
                Pre-filled from Google — edit if you like.
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
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !collegeName.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                submitting || !collegeName.trim()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {submitting ? "Creating your account…" : "Join Zynvo →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (needsCollegeSignin && clerkUserInfo) {
    const finalName = displayName.trim() || clerkUserInfo.name || "User";
    const finalAvatarUrl =
      customAvatarUrl ||
      clerkUserInfo.avatarUrl ||
      `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(finalName)}&size=128`;

    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Which campus are you on?</h2>
            <p className="text-gray-400 text-sm mt-1">
              Zynvo is built for college communities. Choose your institution so we can
              personalize your feed and campus features.
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
              setSubmitting(true);
              try {
                const base = getBackendBase();
                if (!base) throw new Error("Missing backend URL");
                const res = await axios.post(`${base}/api/v2/user/auth/clerkLogin`, {
                  clerkId: clerkUserInfo.clerkId,
                  email: clerkUserInfo.email,
                  name: finalName,
                  avatarUrl: finalAvatarUrl,
                  collegeName: college,
                  college,
                  college_name: college,
                  imgUrl: "",
                  phone: phone.trim(),
                });
                if (res.data.token) {
                  localStorage.setItem("token", res.data.token);
                  sessionStorage.setItem("activeSession", "true");
                  toast.success("Campus saved — welcome back!");
                  router.push("/dashboard");
                } else {
                  throw new Error("No token received");
                }
              } catch (err: unknown) {
                const ax = err as { response?: { data?: { msg?: string } }; message?: string };
                toast.error(
                  ax.response?.data?.msg || ax.message || "Could not save your campus."
                );
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-5"
          >
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
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !collegeName.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                submitting || !collegeName.trim()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {submitting ? "Saving…" : "Continue to Zynvo →"}
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
