'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
} from 'react-icons/fi';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import dotenv from 'dotenv';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signinRes } from '@/types/global-Interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

dotenv.config();
// const BASE_URL = process.env.BASE_URL

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRem] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rememberMe) {
      toast('Please check "Remember me for 30 days" to continue.', {
        position: 'top-center',
      });
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const msg = await axios.post<signinRes>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/login`,
        formData
      );
      setLoading(false);
      if (!msg) {
        toast('Some Internal Server Error Occured');
      } else if (msg && msg.data.msg !== 'login success') {
        toast(msg.data.msg);
      }
      if (msg.data.msg == 'login success') {
        localStorage.setItem('token', msg.data.token);
        sessionStorage.setItem('activeSession', 'true');
        toast('login success');
        router.push('/dashboard');
      }
    }, 5000);
  };

  return (
    <>
      <Head>
        <title>Sign In | Zynvo</title>
        <meta name="description" content="Sign in to your Zynvo account" />
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
                  "url('https://i.pinimg.com/736x/91/92/c9/9192c99c14e8f9d303a5ecfefd96ecc9.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-1"></div>
          </div>

          {/* Content over image */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Welcome Back to</h2>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFDD4A] bg-clip-text text-transparent mb-4">
                zynvo
              </h1>
              <p className="text-white text-lg max-w-md opacity-90">
                Connect with students across institutions and discover exciting
                club opportunities.
              </p>
            </div>

            <div>
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 max-w-md">
                <p className="text-white text-lg font-medium mb-2">
                  &#34;Zynvo completely transformed how our drama club
                  collaborates with other universities.&#34;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                    A
                  </div>
                  <div>
                    <p className="text-white font-medium">Alex Johnson</p>
                    <p className="text-yellow-500 text-sm">
                      Drama Club President, NYU
                    </p>
                  </div>
                </div>
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
                Sign In
              </h1>
              <p className="text-gray-400">
                New to Zynvo?{' '}
                <Link
                  href="/auth/signup"
                  className="text-yellow-500 hover:text-yellow-400 transition"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gray-700 flex-1"></div>
              <p className="mx-4 text-gray-400 text-sm">OR</p>
              <div className="h-px bg-gray-700 flex-1"></div>
            </div>

            {/* Sign-In Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <FiUser className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-yellow-500 hover:text-yellow-400 transition"
                  ></Link>
                </div>
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
                  />
                  <Button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={() => {
                    setRem(true);
                  }}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me for 30 days
                </label>
              </div>

              <motion.button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1"
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>

              {/* Sign Up Button Below Sign In */}
              <div className="mt-4">
                <Link href="/auth/signup" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-black p-4"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            </form>

            <p className="text-gray-400 text-xs text-center mt-8">
              By continuing, you agree to Zynvo&lsquo;s{' '}
              <Link
                href="/terms"
                className="text-yellow-500 hover:text-yellow-400"
              >
                Terms of Service
              </Link>{' '}
              and acknowledge you&lsquo;ve read our{' '}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
