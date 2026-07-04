'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, CalendarRange, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useSchedule } from '@/hooks/useSchedule';
import { useAddSession } from '@/hooks/useAddSession';
import { useDeleteSession } from '@/hooks/useDeleteSession';
import { EventDetailSkeleton } from '@/components/feedback';
import { formatTimeRange, getDefaultTimeRange } from '@/lib/schedule-time';
import {
  AddSessionPanel,
  getScheduleStats,
  isValidScheduleTimeRange,
  ScheduleDayPicker,
  ScheduleEmptyState,
  ScheduleSessionTimeline,
  type SessionFormData,
} from '../components/schedule';

const defaultRange = getDefaultTimeRange();

const emptyForm: SessionFormData = {
  time: formatTimeRange(defaultRange.start, defaultRange.end),
  title: '',
  description: '',
  location: '',
  speakers: '',
};

const SchedulePage = () => {
  const params = useParams();
  const eventId = params.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const {
    data: schedule = [],
    isLoading,
  } = useSchedule(eventId, token);
  const addSessionMutation = useAddSession();
  const deleteSessionMutation = useDeleteSession();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (!eventId || !token) return;

    async function checkFounderStatus() {
      try {
        const checkFounder = await axios.get<{ msg: string }>(
          `/api/v1/user/isFounder?id=${eventId}`,
          { headers: { authorization: `Bearer ${token}` } }
        );

        if (checkFounder.status === 200 && checkFounder.data.msg === 'identified') {
          setIsFounder(true);
        }
      } catch (error) {
        console.error('Error checking founder status:', error);
      }
    }

    checkFounderStatus();
  }, [eventId, token]);

  useEffect(() => {
    if (schedule.length > 0 && !schedule.some((day) => day.day === activeDay)) {
      setActiveDay(schedule[0].day);
    }
  }, [schedule, activeDay]);

  const handleAddSession = () => {
    if (!formData.time.trim() || !formData.title.trim() || !formData.location.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!isValidScheduleTimeRange(formData.time)) {
      toast.error('End time must be after start time');
      return;
    }

    addSessionMutation.mutate(
      {
        eventId,
        day: activeDay,
        time: formData.time.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        speakers: formData.speakers
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          setFormData(emptyForm);
          setIsAddingSession(false);
        },
      }
    );
  };

  const currentDaySchedule = schedule.find((day) => day.day === activeDay);
  const currentSessions = currentDaySchedule?.sessions ?? [];
  const { dayCount, totalSessions } = getScheduleStats(schedule);
  const activeDayLabel =
    currentDaySchedule?.name ||
    (currentDaySchedule?.date
      ? `${currentDaySchedule.name || `Day ${activeDay}`} · ${currentDaySchedule.date}`
      : `Day ${activeDay}`);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-black/30 px-3 py-2 text-sm text-gray-400 transition-all hover:border-yellow-400/30 hover:text-yellow-400"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to event
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#0B0B0B] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
              <CalendarRange className="h-3.5 w-3.5" />
              Event timeline
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Schedule</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Plan sessions, venues, and speakers across each day of your event.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatPill label="Days" value={dayCount || '—'} />
            <StatPill label="Sessions" value={totalSessions} highlight />
          </div>
        </div>
      </div>

      {schedule.length > 0 && (
        <div className="rounded-2xl border border-gray-800 bg-[#0B0B0B] p-6">
          <ScheduleDayPicker
            days={schedule}
            activeDay={activeDay}
            onDayChange={setActiveDay}
          />
        </div>
      )}

      <div className={isFounder ? 'grid gap-8 xl:grid-cols-[1fr_380px]' : 'space-y-8'}>
        <div className="rounded-2xl border border-gray-800 bg-[#0B0B0B] p-6">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                {currentDaySchedule?.name || `Day ${activeDay}`}
              </h2>
              {currentDaySchedule?.date && (
                <p className="text-sm text-gray-500">{currentDaySchedule.date}</p>
              )}
            </div>
            {currentSessions.length > 0 && (
              <span className="rounded-full border border-gray-800 bg-black/40 px-3 py-1 text-xs font-semibold text-gray-400">
                {currentSessions.length} on this day
              </span>
            )}
          </div>

          {currentSessions.length > 0 ? (
            <ScheduleSessionTimeline
              sessions={currentSessions}
              manageMode={isFounder}
              pendingDeleteId={pendingDeleteId}
              isDeleting={deleteSessionMutation.isPending}
              onRequestDelete={setPendingDeleteId}
              onConfirmDelete={(sessionId) =>
                deleteSessionMutation.mutate(
                  { eventId, sessionId },
                  { onSettled: () => setPendingDeleteId(null) }
                )
              }
              onCancelDelete={() => setPendingDeleteId(null)}
            />
          ) : (
            <ScheduleEmptyState
              dayLabel={activeDayLabel}
              isFounder={isFounder}
              inlineManageHint={isFounder}
              variant="full"
            />
          )}
        </div>

        {isFounder && (
          <AddSessionPanel
            isOpen={isAddingSession}
            isSubmitting={addSessionMutation.isPending}
            formData={formData}
            activeDayLabel={activeDayLabel}
            onOpen={() => setIsAddingSession(true)}
            onClose={() => {
              setIsAddingSession(false);
              setFormData(emptyForm);
            }}
            onChange={setFormData}
            onSubmit={handleAddSession}
            className="xl:sticky xl:top-6 xl:self-start"
          />
        )}
      </div>

      {!isFounder && (
        <div className="rounded-xl border border-gray-800/80 bg-black/20 px-4 py-3 text-center text-sm text-gray-500">
          <Sparkles className="mx-auto mb-1 h-4 w-4 text-yellow-400/60" />
          Only event founders can add or edit sessions.
        </div>
      )}
    </div>
  );
};

function StatPill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-center min-w-[88px]'
          : 'rounded-xl border border-gray-800 bg-black/40 px-4 py-3 text-center min-w-[88px]'
      }
    >
      <div
        className={
          highlight ? 'text-2xl font-bold text-yellow-400' : 'text-2xl font-bold text-white'
        }
      >
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </div>
    </div>
  );
}

export default SchedulePage;
