'use client';

import { useEffect, useRef, useState } from "react";
import { AuthenticateWithRedirectCallback, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import CollegeSearchSelect from "@/components/colleges/collegeSelect";
import { collegesWithClubs } from "@/components/colleges/college";

// ── Phase 1: Clerk OAuth exchange ─────────────────────────────────────────────
// Only rendered when we know we just came from an OAuth redirect.
// AuthenticateWithRedirectCallback handles the token exchange and then
// redirects back to this page (clean URL), triggering Phase 2.
function ClerkOAuthHandler() {
  return (
    <>
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/auth/sso-callback"
        afterSignUpUrl="/auth/sso-callback"
      />
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse">Connecting to Google…</p>
      </div>
    </>
  );
}

// ── Phase 2: Backend sync after Clerk session is ready ────────────────────────
function BackendSync() {
  const { isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const hasProcessed = useRef(false);

  const [needsCollege, setNeedsCollege] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clerkUserInfo, setClerkUserInfo] = useState<{
    email: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  // Timeout — if isSignedIn never becomes true, bail out
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasProcessed.current && !needsCollege) {
        toast.error("Authentication timed out. Please try again.");
        router.push("/auth/signin");
      }
    }, 20000);
    return () => clearTimeout(t);
  }, [router, needsCollege]);

  // Sync with backend once Clerk confirms the user is signed in
  useEffect(() => {
    const sync = async () => {
      if (hasProcessed.current) return;
      if (!authLoaded || !userLoaded || !isSignedIn) return;

      hasProcessed.current = true;

      const email = user?.emailAddresses[0]?.emailAddress;
      const clerkId = user?.id;
      const name = user?.fullName || user?.firstName || "User";
      const avatarUrl = user?.hasImage
        ? user.imageUrl
        : `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

      if (!email || !clerkId) {
        toast.error("Missing required user information");
        router.push("/auth/signup");
        return;
      }

      const ssoSource = localStorage.getItem("sso_source") || "signup";
      localStorage.removeItem("sso_source");

      if (ssoSource === "signin") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`,
            { clerkId, email, name, avatarUrl, collegeName: "not joined" }
          );
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            sessionStorage.setItem("activeSession", "true");
            toast.success("Login successful!");
            router.push("/dashboard");
          } else {
            throw new Error("No token received");
          }
        } catch (err: any) {
          const status = err.response?.status;
          const msg = err.response?.data?.msg || "Login failed";
          if (status === 404) {
            toast.error("No account found. Please sign up first.");
            setTimeout(() => router.push("/auth/signup"), 2000);
          } else {
            toast.error(msg);
            setTimeout(() => router.push("/auth/signin"), 2000);
          }
        }
      } else {
        setClerkUserInfo({ email, clerkId, name, avatarUrl });
        setNeedsCollege(true);
      }
    };

    sync();
  }, [authLoaded, userLoaded, isSignedIn, user, router]);

  if (needsCollege) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
          <p className="text-gray-400 mb-6">Select your college to complete signup.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!collegeName.trim() || !clerkUserInfo) {
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
                  name: clerkUserInfo.name,
                  avatarUrl: clerkUserInfo.avatarUrl,
                  collegeName,
                  imgUrl: "",
                  phone: "",
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
              toast.error(err.response?.data?.msg || err.message || "Signup failed.");
            } finally {
              setSubmitting(false);
            }
          }}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                College / University
              </label>
              <CollegeSearchSelect
                colleges={[...collegesWithClubs].sort((a, b) =>
                  a.college.localeCompare(b.college)
                )}
                value={collegeName}
                onChange={(v) => setCollegeName(v)}
                placeholder="Search and select your college/university"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !collegeName.trim()}
              className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                submitting || !collegeName.trim()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {submitting ? "Creating account…" : "Complete Signup"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xl font-medium animate-pulse">Verifying your account…</p>
    </div>
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default function SSOCallbackPage() {
  const [phase, setPhase] = useState<'loading' | 'oauth' | 'sync'>('loading');

  useEffect(() => {
    // If sessionStorage flag is set, we just came from an OAuth redirect
    const isPendingOAuth = sessionStorage.getItem('clerk_oauth_pending') === '1';
    if (isPendingOAuth) {
      sessionStorage.removeItem('clerk_oauth_pending');
      setPhase('oauth');
    } else {
      setPhase('sync');
    }
  }, []);

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse">Loading…</p>
      </div>
    );
  }

  if (phase === 'oauth') {
    return <ClerkOAuthHandler />;
  }

  return <BackendSync />;
}
