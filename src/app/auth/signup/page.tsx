'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import dotenv from 'dotenv';
import DiceBearAvatar from '@/components/DicebearAvatars';
import { collegesWithClubs } from '@/components/colleges/college';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signupRes } from '@/types/global-Interface';
import { toast } from 'sonner';
import CollegeSearchSelect from '@/components/colleges/collegeSelect';
import { Button } from '@/components/ui/button';
import { useSignUp, useAuth } from "@clerk/nextjs";
import { jwtDecode } from "jwt-decode";
import { de } from 'date-fns/locale';

dotenv.config();

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    avatarUrl: '',
  });
  const [agreeToTerms, setAgree] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Inline validation error for college select
  const [collegeError, setCollegeError] = useState<string>('');

  // NEW: password error + validator
  const [passwordError, setPasswordError] = useState<string>('');
  // Password must be at least 8 chars, contain uppercase, lowercase, number, and special char
  const isValidPassword = (pw: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
      pw
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;

    if (name === 'interests') {
      // Handle interest checkboxes
      // interests deleted
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // NEW: validate password as user types
      if (name === 'password') {
        setPasswordError(
          isValidPassword(value)
            ? ''
            : 'Password must be 8+ chars and include uppercase, lowercase, and a number and a special character.'
        );
      }
    }
  };

  // Handle avatar URL change
  const handleAvatarChange = useCallback((url: string) => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: url,
    }));
  }, []);

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NEW: block next step if password invalid
    if (!isValidPassword(formData.password)) {
      setPasswordError(
        'Password must be 8+ chars and include uppercase, lowercase, and a number and a special character.'
      );
      toast('Please fix your password to continue');
      return;
    }
    setPasswordError('');
    setCurrentStep(2);
  };



//deprecated - use clerk method
  const handle_Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingAccount(true);
    // Validate college selection before submitting
    if (!formData.collegeName || !formData.collegeName.trim()) {
      setCollegeError('Please select your college/university');
      toast('Please select your college/university');
      setIsCreatingAccount(false);
      return;
    }
    try {
      const msg = await axios.post<signupRes>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`,
        formData
      );
      
      if (!msg) {
        toast('Internal server error please try again later');
        return;
      }
      
      if (msg.data.msg == 'account created') {
        toast('Account created, lets get you verified');
        router.push('/Verify');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast('Failed to create account. Please try again.');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) {
      alert("Clerk is still loading, please wait a moment.");
      return;
    };
    
 
    if (!agreeToTerms || !formData.collegeName) return;

    setIsCreatingAccount(true);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(" ")[0],
        lastName: formData.name.split(" ")[1] || "",
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // 3. Switch UI to Verification Mode
      setVerifying(true); 
      toast("Verification code sent to your email!");
      
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const errorMessage = err.errors?.[0]?.message || "Error creating account";
      toast.error(errorMessage);
    } finally {
      setIsCreatingAccount(false);
    }
  };


  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // 1. Verify the code using the EXISTING signUp object
      // Clerk remembers the email from Step A
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code, 
      });

      if (completeSignUp.status === "complete") {
        // 2. Set the session active in Clerk
        await setActive({ session: completeSignUp.createdSessionId });
        
        // 3. Get Token & Sync with Backend
        const token = await getToken() as string // Gets the new session token
        const decodedToken: any = jwtDecode(token);
        
        console.log("Decoded Clerk Token:", decodedToken);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/user/auth/clerkLogin`, {
           clerkId: decodedToken.clerk_id,
           collegeName: formData.collegeName,
           avatarUrl: formData.avatarUrl,
          name: formData.name,
          email: formData.email,
          imgUrl : ""
        });

        // 4. Save YOUR Custom JWT & Redirect
        localStorage.setItem('token', res.data.token);
        toast.success("Account created & Verified!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      toast.error("Invalid Code or Verification Failed");
    }
  };




  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
         <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">Verify Email</h2>
            <p className="text-gray-400 mb-6">Enter the code sent to {formData.email}</p>
            
            <form onSubmit={handleVerification}>
               <input
                 type="text"
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 className="w-full bg-gray-800 text-white p-3 rounded-lg mb-4 text-center text-xl tracking-widest focus:ring-2 focus:ring-yellow-500 outline-none"
                 placeholder="######"
               />
               <button 
                 type="submit"
                 className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400"
               >
                 Verify & Complete
               </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign Up | Zynvo</title>
        <meta name="description" content="Create your Zynvo account" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row bg-[#0F0F0F] overflow-x-hidden m-0 p-0">
        {/* Left Side - Image Section */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          {/* This would be your actual image, using a placeholder for now */}
          <div className="absolute inset-0 bg-gray-900">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/736x/0c/26/77/0c26774070338629c0ca25376ed51475.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-1"></div>
          </div>

          {/* Content over image */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Join</h2>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] bg-clip-text text-transparent mb-4">
                zynvo
              </h1>
              <p className="text-white text-lg max-w-md opacity-90">
                Create an account to start connecting with student clubs and
                societies across campus boundaries.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-md">
                <p className="text-white text-lg font-medium mb-4">
                  Expand your network beyond your campus and connect with
                  like-minded students through clubs and activities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-white">
                    <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black mr-3">
                      ✓
                    </span>
                    Connect with students across institutions
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black mr-3">
                      ✓
                    </span>
                    Discover clubs that match your interests
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black mr-3">
                      ✓
                    </span>
                    Collaborate on cross-campus projects
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute w-64 h-64 bottom-0 right-0 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] blur-3xl z-0 opacity-40"></div>
          <div className="absolute w-32 h-32 top-1/4 left-1/3 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] blur-3xl z-0 opacity-40"></div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
          {/* Background elements */}
          <div className="absolute w-96 h-96 -top-10 -right-48 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] blur-3xl z-0 opacity-20"></div>
          <div className="absolute w-64 h-64 bottom-20 -left-32 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] blur-3xl z-0 opacity-20"></div>

          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] bg-clip-text text-transparent inline-block cursor-pointer">
                  zynvo
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-white mt-6 mb-2">
                Create an Account
              </h1>
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-yellow-500 hover:text-yellow-400 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gray-700 flex-1"></div>
                  <p className="mx-4 text-gray-400 text-sm">OR</p>
                  <div className="h-px bg-gray-700 flex-1"></div>
                </div>

                {/* Sign-Up Form Step 1 */}
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-gray-300 text-sm font-medium"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                        placeholder="Aditya Kashyap"
                        required
                      />
                    </div>
                  </div>

                  {/* DiceBear Avatar Component */}
                  <DiceBearAvatar
                    name={formData.name}
                    onAvatarChange={handleAvatarChange}
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-gray-300 text-sm font-medium"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-300 text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          passwordError
                            ? 'focus:ring-red-500'
                            : 'focus:ring-yellow-500'
                        }`}
                        placeholder="peterParkerisSpiderman@69"
                        required
                        minLength={8}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                        title="At least 8 characters, with uppercase, lowercase, and a number"
                        aria-invalid={!!passwordError}
                        aria-describedby="password-help"
                      />
                      <Button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </div>
                    <p
                      id="password-help"
                      className="text-gray-400 text-xs"
                    >
                      Password must be at least 8 characters long and include
                      uppercase, lowercase, a number and a special character.
                    </p>
                    {passwordError && (
                      <p className="text-red-400 text-xs">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.98 }}
                    disabled={!isValidPassword(formData.password)}
                  >
                    <span>Continue</span>
                    <FiArrowRight className="ml-2" />
                  </motion.button>
                </form>
              </>
            )}

            {/* Step 2: Profile Information */}
            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="collegeName"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    College/University Name
                  </label>
                  <CollegeSearchSelect
                        colleges={collegesWithClubs.sort((a, b) => a.college.localeCompare(b.college))}
                        value={formData.collegeName}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, collegeName: value }));
                          // clear any previous college validation error
                          if (value && value.trim()) setCollegeError('');
                        }}
                        placeholder="Search and select your college/university"
                        required
                  />
                      {collegeError && (
                        <p className="text-red-400 text-xs mt-1">{collegeError}</p>
                      )}
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={() => setAgree((prev) => !prev)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500 mt-0.5"
                    required
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-300 leading-relaxed"
                  >
                    I agree to Zynvo&#39;s{' '}
                    <Link
                      href="/terms"
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreatingAccount}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    type="submit"
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition duration-300 transform hover:-translate-y-1 ${
                      isCreatingAccount || !agreeToTerms || !formData.collegeName
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }`}
                    whileTap={{ scale: isCreatingAccount ? 1 : 0.98 }}
                    disabled={!agreeToTerms || isCreatingAccount || !formData.collegeName}
                  >
                    {isCreatingAccount ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                        <span>Account creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}

            <p className="text-gray-400 text-xs text-center mt-8">
              By continuing, you agree to Zynvo&#39;s{' '}
              <Link
                href="/terms"
                className="text-yellow-500 hover:text-yellow-400"
              >
                Terms of Service
              </Link>{' '}
              and acknowledge you&lsquo;ve read our{' '}
              <Link
                href="/privacy"
                className="text-yellow-500 hover:text-yellow-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
