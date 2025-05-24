'use client';

import { BackgroundElements } from "./TeamSection";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from "axios";

type VerificationStatus = 'pending' | 'success' | 'error' | 'expired';

export default function VerificationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<VerificationStatus>('pending');
    const [countdown, setCountdown] = useState(5);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    interface apiResponse {
        msg : string,
        token : string 
    }
    useEffect(() => {
        if (!token || !email) {
            setStatus('error');
            return;
        }

        const verifyEmail = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axios.post<apiResponse>(`http://localhost:8000/api/v1/user/verify?vToken=${token}`)

                if (response.status == 200) {
                    setStatus('success');
                    localStorage.setItem('token', response.data.token)
                    // Start countdown for redirect
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                router.push('/dashboard');
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(timer);
                } else {
                    const data = response.data.msg
                    if (data === 'expired') {
                        setStatus('expired');
                    } else {
                        setStatus('error');
                    }
                }
            } catch (error) {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [token, email, router]);

    const handleResendVerification = async () => {
        try {
            // Replace with your actual resend verification API endpoint
            await fetch('/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            alert('Verification email has been resent!');
        } catch (error) {
            alert('Failed to resend verification email. Please try again.');
        }
    };

    const statusConfigs = {
        pending: {
            icon: '⏳',
            title: 'Verifying your email...',
            message: 'Please wait while we verify your email address.',
        },
        success: {
            icon: '✅',
            title: 'Email Verified!',
            message: `Redirecting to dashboard in ${countdown} seconds...`,
        },
        error: {
            icon: '❌',
            title: 'Verification Failed',
            message: 'We couldn\'t verify your email. Please try again or contact support.',
        },
        expired: {
            icon: '⚠️',
            title: 'Verification Link Expired',
            message: 'This verification link has expired. Please request a new one.',
        },
    };

    const currentStatus = statusConfigs[status];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <BackgroundElements />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full mx-4 p-8 rounded-2xl bg-black/50 backdrop-blur-sm border border-yellow-500/20"
            >
                <div className="text-center">
                    <span className="text-6xl mb-6 block">{currentStatus.icon}</span>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {currentStatus.title}
                    </h1>
                    <p className="text-gray-300 mb-6">
                        {currentStatus.message}
                    </p>

                    {status === 'expired' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleResendVerification}
                            className="px-6 py-2 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-400 transition-colors"
                        >
                            Resend Verification Email
                        </motion.button>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleResendVerification}
                                className="px-6 py-2 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-400 transition-colors"
                            >
                                Try Again
                            </motion.button>
                            <p className="text-sm text-gray-400 mt-4">
                                If you continue to have problems, please{' '}
                                <a href="/contact" className="text-yellow-500 hover:text-yellow-400 underline">
                                    contact support
                                </a>
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                        >
                            <p className="text-green-400">
                                Your email has been verified successfully!
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Additional help text */}
            <p className="text-gray-400 mt-8 text-center max-w-md px-4">
                Didn't receive an email? Check your spam folder or{' '}
                <button
                    onClick={handleResendVerification}
                    className="text-yellow-500 hover:text-yellow-400 underline"
                >
                    request a new verification link
                </button>
            </p>
        </div>
    );
}