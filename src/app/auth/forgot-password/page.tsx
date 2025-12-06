"use client";
import axios from 'axios';
import { NextPage } from 'next';
import { useState } from 'react';
import { toast } from 'sonner';

const ForgotPasswordPage: NextPage = () => {
  const sendMail = async() => {
   const send = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/forgot`, {
     email
    })
    toast(send.data.msg);
  }
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onClick={(e) => {
              e.preventDefault();
              sendMail();
            }}
          >
            Send Password Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
