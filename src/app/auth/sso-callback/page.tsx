'use client';

import { useEffect, useRef, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import CollegeSearchSelect from "@/components/colleges/collegeSelect";
import { collegesWithClubs } from "@/components/colleges/college";

export default function SSOCallback() {
  const { isLoaded: authLoaded } = useAuth();
  const clerk = useClerk();
  const router = useRouter();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const hasProcessed = useRef(false);
  const callbackHandled = useRef(false);

  const [needsCollege, setNeedsCollege] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clerkUserInfo, setClerkUserInfo] = useState<{
    email: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  // Step 1: Process OAuth tokens from the URL to finalize Clerk session
  useEffect(() => {
    if (!clerk.loaded || callbackHandled.current) return;
    callbackHandled.current = true;

    // If already signed in (e.g. page reload after callback), skip — Step 2 will handle it
    if (clerk.session) {
      console.warn("SSO Callback: Session already exists, skipping handleRedirectCallback");
      return;
    }

    console.warn("SSO Callback: Processing OAuth callback...");
    clerk.handleRedirectCallback({}).catch((err: any) => {
      console.error("SSO Callback: handleRedirectCallback error", err);
      toast.error("Authentication failed. Redirecting...");
      setTimeout(() => router.push('/auth/signin'), 2000);
    });
  }, [clerk, router]);

  // Timeout fallback: if stuck on spinner for too long, redirect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasProcessed.current && !needsCollege) {
        console.error("SSO Callback: Timed out waiting for auth state");
        toast.error("Authentication timed out. Please try again.");
        router.push('/auth/signin');
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, [router, needsCollege]);

  // Step 2: Once signed in, sync with backend
  useEffect(() => {
    const syncWithBackend = async () => {
      if (hasProcessed.current) return;
      if (!authLoaded || !userLoaded || !isSignedIn) return;

      hasProcessed.current = true;
      console.warn("SSO Callback: User signed in", { userId: user?.id });

      const email = user?.emailAddresses[0]?.emailAddress;
      const clerkId = user?.id;
      const name = user?.fullName || user?.firstName || "User";
      const avatarUrl = user?.hasImage
        ? user.imageUrl
        : `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

      if (!email || !clerkId) {
        toast.error("Missing required user information");
        router.push('/auth/signup');
        return;
      }

      const ssoSource = localStorage.getItem("sso_source") || "signup";
      console.warn("SSO Callback: sso_source =", ssoSource, "| email =", email);
      localStorage.removeItem("sso_source");

      if (ssoSource === "signin") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`,
            { clerkId, email, name, avatarUrl, collegeName: "not joined" }
          );

          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            sessionStorage.setItem('activeSession', 'true');
            toast.success("Login successful!");
            router.push('/dashboard');
          } else {
            throw new Error("No token received");
          }
        } catch (err: any) {
          console.error("SSO Callback: clerkLogin error", err.response?.status, err.response?.data);
          const status = err.response?.status;
          const msg = err.response?.data?.msg || "Login failed";
          if (status === 404) {
            toast.error("No account found with this email. Please sign up first.");
            setTimeout(() => router.push('/auth/signup'), 2000);
          } else {
            toast.error(msg);
            setTimeout(() => router.push('/auth/signin'), 2000);
          }
        }
      } else {
        setClerkUserInfo({ email, clerkId, name, avatarUrl });
        setNeedsCollege(true);
      }
    };

    syncWithBackend();
  }, [authLoaded, userLoaded, isSignedIn, user, router]);

  const handleCollegeSubmit = async (e: React.FormEvent) => {
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
        localStorage.setItem('token', res.data.token);
        sessionStorage.setItem('activeSession', 'true');
        toast.success("Account created successfully!");
        router.push('/dashboard');
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      const msg = err.response?.data?.msg || err.message || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (needsCollege) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
          <p className="text-gray-400 mb-6">Select your college to complete signup.</p>

          <form onSubmit={handleCollegeSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                College/University
              </label>
              <CollegeSearchSelect
                colleges={[...collegesWithClubs].sort((a, b) => a.college.localeCompare(b.college))}
                value={collegeName}
                onChange={(value) => setCollegeName(value)}
                placeholder="Search and select your college/university"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !collegeName.trim()}
              className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                submitting || !collegeName.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              }`}
            >
              {submitting ? "Creating account..." : "Complete Signup"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-medium animate-pulse">
        Verifying your account...
      </p>
    </div>
  );
}
