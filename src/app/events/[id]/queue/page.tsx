'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

// Types based on your provided schema
interface Question {
    id: string;
    createdAt: Date;
    type: string;
    options: string[];
    eventId: string;
    updatedAt: Date;
    label: string;
    required: boolean;
    sortOrder: number;
}

interface RegistrationAnswer {
    userId: string;
    answer: string;
    question: Question;
}

interface RegistrationDetails {
    user: {
        email: string;
        name: string | null;
        collegeName: string;
    };
    userId: string;
    joinedAt: Date;
    uniquePassId: string | null;
    paymentScreenshotUrl: string | null;
    paymentStatus: string;
    paymentVerifiedAt: Date | null;
}

interface QueueEntry {
    id: string;
    createdAt: Date;
    status: string;
    userId: string;
    eventId: string;
    updatedAt: Date;
    registration?: RegistrationDetails;
    registrationAnswers: RegistrationAnswer[];
}

export default function EventQueuePage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [isLoadingQueue, setIsLoadingQueue] = useState(false);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    
    // State to track which cards are expanded
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const verifyAdminAndFetchQueue = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setIsAdmin(false);
                    setIsCheckingAdmin(false);
                    return;
                }

                // 1. Check Admin Status
                const adminRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isClubAdmin`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const adminData = await adminRes.json();

                if (!adminRes.ok || !adminData.founder) {
                    setIsAdmin(false);
                    setIsCheckingAdmin(false);
                    return;
                }

                setIsAdmin(true);
                setIsCheckingAdmin(false);

                // 2. Fetch Event Queue
                setIsLoadingQueue(true);
                const queueRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/eventQueue/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const queueData = await queueRes.json();

                if (queueRes.ok && queueData.queue) {
                    setQueue(queueData.queue);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsAdmin(false);
            } finally {
                setIsLoadingQueue(false);
            }
        };

        if (eventId) {
            verifyAdminAndFetchQueue();
        }
    }, [eventId]);

    const handleAction = async (userId: string, accepted: boolean) => {
        setActionLoading((prev) => ({ ...prev, [userId]: true }));

        try {
            const token = localStorage.getItem('token');
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/eventQueue/${eventId}/approve`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, accepted }),
            });

            if (res.ok) {
                // Optimistically remove the user from the queue upon success
                setQueue((prev) => prev.filter((entry) => entry.userId !== userId));
            } else {
                console.error("Failed to update participant status");
                alert("Failed to process request. Please try again.");
            }
        } catch (error) {
            console.error("Error updating participant:", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const toggleCard = (id: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // --- Loading State ---
    if (isCheckingAdmin || isLoadingQueue) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-yellow-400 text-xl font-semibold animate-pulse">
                    Loading Event Data...
                </div>
            </div>
        );
    }

    // --- Unauthorized State ---
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-yellow-500 p-8 rounded-lg max-w-md text-center">
                    <h1 className="text-yellow-400 text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-neutral-300">
                        You do not have the required permissions to view or manage this event queue.
                    </p>
                </div>
            </div>
        );
    }

    // --- Main Queue View ---
    return (
        <div className="min-h-screen bg-black text-neutral-200 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-yellow-500/30 pb-4">
                    <h1 className="text-3xl font-bold text-yellow-400">Event Approval Queue</h1>
                    <span className="bg-yellow-500 text-black px-4 py-1 rounded-full font-semibold text-sm">
                        {queue.length} Pending
                    </span>
                </div>

                {queue.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-neutral-700 rounded-lg">
                        <p className="text-neutral-400 text-lg">The queue is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {queue.map((entry) => {
                            const isProcessing = actionLoading[entry.userId];
                            const isExpanded = expandedCards[entry.id];
                            const userName = entry.registration?.user.name || "Unknown Name";
                            const dicebearSeed = encodeURIComponent(userName);

                            return (
                                <div 
                                    key={entry.id} 
                                    className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 transition-colors p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch"
                                >
                                    {/* Left Side: Participant Info & Collapsible Content */}
                                    <div className="flex-1 w-full flex flex-col justify-between">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-14 h-14 bg-neutral-800 rounded-full overflow-hidden shrink-0 border border-neutral-700 flex items-center justify-center">
                                                <Image 
                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${dicebearSeed}&backgroundColor=eab308&textColor=000000`} 
                                                    alt={userName} 
                                                    width={56} 
                                                    height={56} 
                                                    className="object-cover"
                                                />
                                            </div>
                                            
                                            {/* Header Info */}
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                    <div>
                                                        <h2 className="text-xl font-semibold text-white">
                                                            {userName}
                                                        </h2>
                                                        <p className="text-sm text-neutral-400">{entry.registration?.user.email}</p>
                                                    </div>
                                                    <div className="mt-2 md:mt-0 text-left md:text-right">
                                                        <span className="text-xs uppercase tracking-wider text-yellow-500 font-semibold block">
                                                            College
                                                        </span>
                                                        <span className="text-sm">{entry.registration?.user.collegeName}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => router.push(`/zyncers/${entry.userId}`)}
                                                        className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        <User size={14} />
                                                        View Profile
                                                    </button>
                                                    <button 
                                                        onClick={() => toggleCard(entry.id)}
                                                        className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-colors"
                                                    >
                                                        {isExpanded ? (
                                                            <><ChevronUp size={14} /> Hide Details</>
                                                        ) : (
                                                            <><ChevronDown size={14} /> View Details</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collapsible Section */}
                                        {isExpanded && (
                                            <div className="mt-5 pt-5 border-t border-neutral-800 space-y-5 animate-in fade-in slide-in-from-top-2">
                                                {/* Payment Details */}
                                                <div className="bg-black/50 p-4 rounded-lg border border-neutral-800 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-neutral-500 block">Payment Status</span>
                                                        <span className={`text-sm font-medium ${entry.registration?.paymentStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                            {entry.registration?.paymentStatus.toUpperCase() || "PENDING"}
                                                        </span>
                                                    </div>
                                                    {entry.registration?.paymentScreenshotUrl ? (
                                                        <a 
                                                            href={entry.registration.paymentScreenshotUrl} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="text-xs text-black bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded font-medium transition"
                                                        >
                                                            View Receipt
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-neutral-600 bg-neutral-900 px-3 py-1.5 rounded">No Receipt Uploaded</span>
                                                    )}
                                                </div>

                                                {/* Custom Answers */}
                                                {entry.registrationAnswers.length > 0 && (
                                                    <div className="space-y-3 bg-black/30 p-4 rounded-lg border border-neutral-800/50">
                                                        <span className="text-xs uppercase tracking-wider text-yellow-500 font-semibold block border-b border-neutral-800 pb-2">
                                                            Custom Responses
                                                        </span>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                                            {entry.registrationAnswers.map((ans) => (
                                                                <div key={ans.question.id} className="text-sm">
                                                                    <span className="text-neutral-500 block text-xs mb-1">{ans.question.label}</span>
                                                                    <span className="text-neutral-200 bg-neutral-900 px-3 py-1.5 rounded block whitespace-pre-wrap">{ans.answer}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side: Actions */}
                                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto md:min-w-[140px] pt-4 md:pt-0 border-t border-neutral-800 md:border-t-0 md:border-l md:pl-6 justify-center">
                                        <button
                                            onClick={() => handleAction(entry.userId, true)}
                                            disabled={isProcessing}
                                            className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-yellow-500/10"
                                        >
                                            {isProcessing ? 'Processing...' : 'Accept'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(entry.userId, false)}
                                            disabled={isProcessing}
                                            className="flex-1 md:flex-none bg-transparent border border-neutral-700 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? 'Processing...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}