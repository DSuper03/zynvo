'use client';

import { Suspense, useEffect, useRef, useState } from "react";
import { AuthenticateWithRedirectCallback, useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import CollegeSearchSelect from "@/components/colleges/collegeSelect";
import { collegesWithClubs } from "@/components/colleges/college";
import DiceBearAvatar from "@/components/DicebearAvatars";

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

  // Capture intent from URL on FIRST render, before AuthenticateWithRedirectCallback
  // can strip query params. This ref never changes after mount.
  const intentRef = useRef(searchParams.get("intent"));
  const hasProcessed = useRef(false);

  const [needsCollege, setNeedsCollege] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clerkUserInfo, setClerkUserInfo] = useState<{
    email: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  // Timeout safety net
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasProcessed.current && !needsCollege) {
        toast.error("Authentication timed out. Please try again.");
        router.push("/auth/signin");
      }
    }, 20000);
    return () => clearTimeout(t);
  }, [router, needsCollege]);

  // Main logic: runs once Clerk confirms the user is signed in
  useEffect(() => {
    if (hasProcessed.current) return;
    if (!authLoaded || !userLoaded || !isSignedIn || !user) return;

    hasProcessed.current = true;

    const email = user.emailAddresses[0]?.emailAddress;
    const clerkId = user.id;
    const name = user.fullName || user.firstName || "User";
    const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

    if (!email || !clerkId) {
      toast.error("Missing required user information");
      router.push("/auth/signup");
      return;
    }

    // Intent was captured from the URL on first render (before AuthenticateWithRedirectCallback
    // could strip query params)
    const intent = intentRef.current;

    if (intent === "signup") {
      // New user from signup page — show the college/details form
      setDisplayName(name);
      setClerkUserInfo({ email, clerkId, name, avatarUrl });
      setNeedsCollege(true);
    } else {
      // Existing user from signin page (or missing intent) — go straight to backend
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`, {
          clerkId,
          email,
          name,
          avatarUrl,
          collegeName: "not joined",
        })
        .then((res) => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            sessionStorage.setItem("activeSession", "true");
            toast.success("Login successful!");
            router.push("/dashboard");
          }
        })
        .catch((err) => {
          const status = err.response?.status;
          if (status === 404) {
            toast.error("No account found. Please sign up first.");
            setTimeout(() => router.push("/auth/signup"), 2000);
          } else {
            toast.error(err.response?.data?.msg || "Login failed");
            setTimeout(() => router.push("/auth/signin"), 2000);
          }
        });
    }
  }, [authLoaded, userLoaded, isSignedIn, user, router]);

  // ── College form (only for signup intent) ─────────────────────────────────
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
              if (!collegeName.trim()) {
                toast.error("Please select your college/university");
                return;
              }
              setSubmitting(true);
              try {
                const res = await axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`,
                  {
                    clerkId: clerkUserInfo.clerkId,
                    email: clerkUserInfo.email,
                    name: finalName,
                    avatarUrl: finalAvatarUrl,
                    collegeName,
                    imgUrl: "",
                    phone: phone.trim(),
                  }
                );
                if (res.data.token) {
                  localStorage.setItem("token", res.data.token);
                  sessionStorage.setItem("activeSession", "true");
                  toast.success("Account created successfully!");
                  router.push("/dashboard");
                } else {
                  throw new Error("No token received");
                }
              } catch (err: any) {
                toast.error(
                  err.response?.data?.msg || err.message || "Signup failed."
                );
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-5"
          >
            {/* Avatar picker */}
            <DiceBearAvatar
              name={finalName}
              onAvatarChange={(url: string) => setCustomAvatarUrl(url)}
            />

            {/* Display name */}
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

            {/* College — required */}
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

            {/* Phone — optional */}
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

  // ── Loading / OAuth processing spinner ────────────────────────────────────
  // Only render AuthenticateWithRedirectCallback when user is NOT yet signed in
  // (i.e. OAuth tokens still need processing). Once signed in, just show spinner
  // while the useEffect above handles backend sync.
  const showOAuthHandler = authLoaded && !isSignedIn;

  return (
    <>
      {showOAuthHandler && <AuthenticateWithRedirectCallback />}
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse">Verifying your account…</p>
      </div>
    </>
  );
}
