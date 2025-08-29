'use client';

import { Button } from '@/components/ui/button';
import { EventByIdResponse, respnseUseState } from '@/types/global-Interface';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dotenv from 'dotenv';

dotenv.config();

const Eventid = () => {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<respnseUseState>({
    EventName: '',
    description: '',
    EventMode: '',
    startDate: '',
    endDate: '',
    contactEmail: '',
    contactPhone: 0,
    university: '',
    applicationStatus: 'open',
  });

  const [forkedUpId, setForkedUpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    async function fetchEventData() {
      try {
        setIsLoading(true);
        const res = await axios.get<EventByIdResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (res && res.status === 200) {
          setData({
            EventName: res.data.response.EventName || '',
            description: res.data.response.description || '',
            EventMode: res.data.response.EventMode || '',
            startDate: res.data.response.startDate || '',
            endDate: res.data.response.endDate || '',
            university: res.data.response.university || '',
            contactEmail: res.data.response.contactEmail || '',
            contactPhone: res.data.response.contactPhone || 0,
            applicationStatus: res.data.response.applicationStatus || 'open',
          });
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        alert('Error loading event data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [token, id]);

  const handleRegistration = async () => {
    if (!token) {
      alert('Please login to register for this event');
      return;
    }

    try {
      setIsRegistering(true);
      const bodyData = {
        eventId: id,
      };

      const resp = await axios.post<{
        msg: string;
        ForkedUpId: string;
      }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/registerEvent`,
        bodyData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp && resp.status === 200) {
        alert(resp.data.msg);
        setForkedUpId(resp.data.ForkedUpId);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white py-8 px-2 md:px-6">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side content */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-2xl overflow-hidden bg-gray-900/80 border border-yellow-500/20 shadow-lg flex flex-col min-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
                {data.EventName || 'Event Title'}
              </h1>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-black">Happening</span>
                  <span className="text-black font-extrabold bg-yellow-400 px-2 py-1 rounded">
                    {data.EventMode || 'TBD'}
                  </span>
                  <span className="text-black">in</span>
                  <span className="text-black font-extrabold bg-yellow-400 px-2 py-1 rounded">
                    {data.university || 'TBD'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-black">From</span>
                    <span className="text-black font-extrabold bg-yellow-400 px-2 py-1 rounded">
                      {data.startDate || 'TBD'}
                    </span>
                    <span className="text-black">to</span>
                    <span className="text-black font-extrabold bg-yellow-400 px-2 py-1 rounded">
                      {data.endDate || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black">Applications are</span>
                    <span
                      className={`font-extrabold px-2 py-1 rounded ${
                        data.applicationStatus === 'open'
                          ? 'text-green-800 bg-green-300'
                          : 'text-red-800 bg-red-300'
                      }`}
                    >
                      {data.applicationStatus}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-black/80 mt-2 font-medium">
                The Ultimate Student Developer Experience
              </p>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                About This Event
              </h2>
              <div className="mb-6 flex-grow">
                <div className="text-gray-200 bg-black/60 p-4 rounded-lg text-justify mb-4">
                  {data.description ||
                    'Event description will be available soon...'}
                </div>

                {(data.contactEmail || data.contactPhone) && (
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-yellow-400 font-semibold mb-2">
                      Contact Information:
                    </p>
                    <div className="flex flex-col gap-1 text-gray-300">
                      {data.contactEmail && (
                        <div className="flex items-center gap-2">
                          <span>Email:</span>
                          <a
                            href={`mailto:${data.contactEmail}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            {data.contactEmail}
                          </a>
                        </div>
                      )}
                      {data.contactPhone !== 0 && (
                        <div className="flex items-center gap-2">
                          <span>Phone:</span>
                          <a
                            href={`tel:${data.contactPhone}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            {data.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button
                  onClick={handleRegistration}
                  disabled={isRegistering || data.applicationStatus !== 'open'}
                  className={`font-bold py-3 px-8 rounded-xl transition duration-300 shadow-lg w-full md:w-auto ${
                    isRegistering || data.applicationStatus !== 'open'
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {isRegistering ? 'Registering...' : 'Register Now 🚀'}
                </Button>

                {forkedUpId && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 font-medium mb-2">
                      Registration Successful! 🎉
                    </p>
                    <p className="text-gray-300 mb-2">
                      Make sure to get your pass for this event on{' '}
                      <a
                        href={`https://zynvo.social/ticket/${forkedUpId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                      >
                        Zynced It
                      </a>{' '}
                      Without this you'll not be allowed to take part.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Event Poster */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full max-w-md aspect-[3/4] rounded-2xl bg-gradient-to-br from-yellow-500/80 to-yellow-700/90 border-4 border-yellow-400 shadow-2xl flex items-center justify-center overflow-hidden relative">
            {/* Placeholder for event poster image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-black/60">
              <svg
                className="w-24 h-24 mb-4 opacity-30"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <rect
                  x="8"
                  y="8"
                  width="32"
                  height="32"
                  rx="6"
                  stroke="currentColor"
                />
                <circle cx="24" cy="20" r="6" stroke="currentColor" />
                <path d="M8 36l8-8 8 8 8-8 8 8" stroke="currentColor" />
              </svg>
              <span className="text-lg font-semibold opacity-60">
                Event Poster
              </span>
            </div>
            {/* 
              To use a real image, replace the above <div> with:
              <Image src="/your-poster.jpg" alt="Event Poster" fill className="object-cover" />
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventid;
