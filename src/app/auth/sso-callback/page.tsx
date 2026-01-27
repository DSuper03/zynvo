'use client';

import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function SSOCallback() {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const hasProcessed = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10; 

  useEffect(() => {
    const syncWithBackend = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      
      // Wait for both auth and user to be loaded
      if (!authLoaded || !userLoaded) {
        console.log("Waiting for Clerk to load...", { authLoaded, userLoaded });
        return;
      }

      // If not signed in, wait a bit more (OAuth might still be processing)
      if (!isSignedIn) {
        if (retryCount < maxRetries) {
          console.log(`Not signed in yet, retry ${retryCount + 1}/${maxRetries}`);
          setTimeout(() => setRetryCount(prev => prev + 1), 500);
          return;
        }
        
        // After max retries, give up
        console.error("User not signed in after OAuth - max retries reached");
        toast.error("Authentication failed. Please try again.");
        router.push('/auth/signup');
        return;
      }

      // Mark as processed to prevent duplicate calls
      hasProcessed.current = true;

      try {
        console.log("Processing SSO callback for user:", user?.id);
        
        const email = user?.emailAddresses[0]?.emailAddress;
        const clerkId = user?.id;
        const name = user?.fullName || user?.firstName || "User";
        
        // Get the college from localStorage (stored before OAuth redirect)
        const collegeName = localStorage.getItem("sso_college");

        if (!email || !clerkId) {
          throw new Error("Missing required user information");
        }

        if (!collegeName) {
          toast.error("College information missing. Please complete signup manually.");
          router.push('/auth/signup');
          return;
        }

        const avatarUrl = user?.hasImage 
          ? user.imageUrl 
          : `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}&size=128`;

        // Get Clerk session token
        const token = await getToken();

        if (!token) {
          throw new Error("No token received from Clerk");
        }

        console.log("Syncing with backend...");

        // Send to your backend
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`,
          {
            clerkId,
            collegeName,
            avatarUrl,
            name,
            email,
            imgUrl: "", // You can remove this if not needed
            phone: "", // Google OAuth doesn't provide phone
          }
        );

        // Save your custom token
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          sessionStorage.setItem('activeSession', 'true');
          
          // Clean up the stored college
          localStorage.removeItem('sso_college');
          
          toast.success("Login successful!");
          
          // Small delay before redirect to ensure storage is complete
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } else {
          throw new Error("No token received from backend");
        }
        
      } catch (err: any) {
        console.error("SSO Backend Sync Error:", err);
        hasProcessed.current = false; // Allow retry on error
        const msg = err.response?.data?.msg || err.message || "Login failed. Please try again.";
        toast.error(msg);
        
        // Clean up stored college on error
        localStorage.removeItem('sso_college');
        
        // Don't redirect immediately on backend errors
        setTimeout(() => {
          router.push('/auth/signup');
        }, 2000);
      }
    };

    syncWithBackend();
  }, [authLoaded, userLoaded, isSignedIn, user, getToken, router, retryCount]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-medium animate-pulse">
        {!authLoaded || !userLoaded 
          ? "Loading authentication..." 
          : !isSignedIn 
            ? "Completing sign in..."
            : "Verifying your account..."}
      </p>
      {retryCount > 5 && !isSignedIn && (
        <p className="text-sm text-gray-400 mt-2">This is taking longer than usual...</p>
      )}
    </div>
  );
}