'use client';
import React, { useState } from 'react';
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

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signupRes } from '@/types/global-Interface';
import { toast } from 'sonner';

dotenv.config();
//const BASE_URL = process.env.BASE_URL

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    avatarUrl: '', // Added avatarUrl to store the avatar URL
  });
  const [agreeToTerms, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === 'interests') {
      // Handle interest checkboxes
      // interests deleted
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle avatar URL change
  const handleAvatarChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: url,
    }));
  };

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = await axios.post<signupRes>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`,
      formData
    );
    if (!msg) {
      toast('Internal server error please try again later');
    }
    if (msg.data.msg == 'account created') {
      toast('Account created, lets get you verified');
      router.push('/Verify');
    }
  };

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
                {/* Social Sign-Up Options */}
                <div className="flex flex-col space-y-3 mb-6">
                  <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition">
                    <FaGoogle className="text-lg" />
                    <span>Continue with Google</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition">
                    <FaApple className="text-lg" />
                    <span>Continue with Apple</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition">
                    <FaFacebook className="text-lg" />
                    <span>Continue with Facebook</span>
                  </button>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gray-700 flex-1"></div>
                  <p className="mx-4 text-gray-400 text-sm">OR</p>
                  <div className="h-px bg-gray-700 flex-1"></div>
                </div>

                {/* Sign-Up Form Step 1 */}
                <form onSubmit={handleNextStep}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-300 text-sm font-medium mb-2"
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
                        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* DiceBear Avatar Component */}
                  <DiceBearAvatar
                    name={formData.name}
                    onAvatarChange={handleAvatarChange}
                  />

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-300 text-sm font-medium mb-2"
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
                        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-gray-300 text-sm font-medium mb-2"
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
                        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Password must be at least 8 characters long.
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Continue</span>
                    <FiArrowRight className="ml-2" />
                  </motion.button>
                </form>
              </>
            )}

            {/* Step 2: Profile Information */}
            {currentStep === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="collegeName"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    College/University Name
                  </label>
                  <div className="relative">
                    <FiUser className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      id="collegeName"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={() => {
                      setAgree(true);
                    }}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                    required
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    I agree to Zynvo&#39;s{' '}
                    <Link
                      href="/terms"
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition"
                  >
                    Back
                  </button>

                  <motion.button
                    type="submit"
                    className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1"
                    whileTap={{ scale: 0.98 }}
                    disabled={!agreeToTerms}
                  >
                    <span>Create Account</span>
                    <FiArrowRight className="ml-2" />
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
