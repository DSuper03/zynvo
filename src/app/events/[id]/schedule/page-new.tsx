'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleSession {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  speakers: string[];
}

interface ScheduleDay {
  id: string;
  day: number;
  date: string;
  name: string;
  sessions: ScheduleSession[];
}

const SchedulePage = () => {
  const params = useParams();
  const eventId = params.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: '',
    location: '',
    speakers: '',
  });

  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) setToken(tok);
  }, []);

  useEffect(() => {
    if (!eventId || !token) return;

    const fetchSchedule = async () => {
      try {
        // Check founder status
        const founderRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${eventId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        if (founderRes.status === 200 && founderRes.data.msg === 'identified') {
          setIsFounder(true);
        }

        // Fetch schedule
        try {
          const scheduleRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/schedule/${eventId}`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          if (scheduleRes.data && scheduleRes.data.response) {
            setSchedule(scheduleRes.data.response);
          }
        } catch (e) {
          console.log('Schedule endpoint not yet available');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [eventId, token]);

  const handleAddSession = async () => {
    if (
      !formData.time.trim() ||
      !formData.title.trim() ||
      !formData.location.trim()
    ) {
      toast('Please fill in required fields');
      return;
    }

    try {
      const sessionData = {
        day: activeDay,
        time: formData.time,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        speakers: formData.speakers
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/schedule/${eventId}/session`,
        sessionData,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201 || res.status === 200) {
        const updatedSchedule = schedule.map((day) =>
          day.day === activeDay
            ? { ...day, sessions: [...day.sessions, res.data.response] }
            : day
        );
        setSchedule(updatedSchedule);
        setFormData({ time: '', title: '', description: '', location: '', speakers: '' });
        setIsAddingSession(false);
        toast('Session added successfully');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast('Failed to add session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/schedule/${eventId}/session/${sessionId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const updatedSchedule = schedule.map((day) => ({
        ...day,
        sessions: day.sessions.filter((s) => s.id !== sessionId),
      }));
      setSchedule(updatedSchedule);
      toast('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast('Failed to delete session');
    }
  };

  const toggleSession = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  const currentDaySchedule = schedule.find((day) => day.day === activeDay);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Event Schedule</h1>
          <p className="text-gray-400">
            View and manage the event timeline
          </p>
        </div>

        {/* Day Selector */}
        {schedule.length > 0 && (
          <div className="mb-8 bg-[#0B0B0B] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-yellow-400 mb-4">Event Days</h2>
            <div className="flex flex-wrap gap-3">
              {schedule.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.day)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeDay === day.day
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm">{day.name}</div>
                  <div className="text-xs opacity-75">{day.date}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Table */}
        {currentDaySchedule && currentDaySchedule.sessions.length > 0 ? (
          <div className="mb-8">
            <div className="bg-[#0B0B0B] border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        <FaClock className="inline mr-2" />
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        <FaMapMarkerAlt className="inline mr-2" />
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        Speakers
                      </th>
                      {isFounder && (
                        <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentDaySchedule.sessions.map((session, idx) => (
                      <tr
                        key={session.id}
                        className={`border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${
                          idx % 2 === 0 ? 'bg-black' : 'bg-gray-900'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                          {session.time}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleSession(session.id)}
                            className="text-sm text-white font-medium hover:text-yellow-400 transition-colors flex items-center gap-2"
                          >
                            {session.title}
                            {session.description && (
                              <FaChevronDown
                                className={`w-3 h-3 transition-transform ${
                                  expandedSession === session.id ? 'rotate-180' : ''
                                }`}
                              />
                            )}
                          </button>
                          {expandedSession === session.id && session.description && (
                            <p className="text-xs text-gray-400 mt-2 ml-0">
                              {session.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {session.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {session.speakers.length > 0
                            ? session.speakers.join(', ')
                            : '-'}
                        </td>
                        {isFounder && (
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : isFounder ? (
          <div className="mb-8 bg-[#0B0B0B] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-4">No sessions scheduled for this day</p>
          </div>
        ) : null}

        {/* Add Session Form - Only for Founder */}
        {isFounder && (
          <div className="bg-[#0B0B0B] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-yellow-400">
                {isAddingSession ? 'Add New Session' : 'Manage Sessions'}
              </h2>
              {isAddingSession && (
                <button
                  onClick={() => {
                    setIsAddingSession(false);
                    setFormData({ time: '', title: '', description: '', location: '', speakers: '' });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!isAddingSession ? (
              <Button
                onClick={() => setIsAddingSession(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Session
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      Time *
                    </label>
                    <Input
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      placeholder="e.g., 9:00 AM - 10:30 AM"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      Location *
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g., Main Hall"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Session title"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Session details"
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Speakers (comma-separated)
                  </label>
                  <Input
                    value={formData.speakers}
                    onChange={(e) =>
                      setFormData({ ...formData, speakers: e.target.value })
                    }
                    placeholder="John Doe, Jane Smith"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  onClick={handleAddSession}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg"
                >
                  Add Session
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
