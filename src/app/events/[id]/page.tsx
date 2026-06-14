'use client';

import { Button } from '@/components/ui/button';
import { CustomAnswer, CustomQuestion, EventByIdResponse, respnseUseState } from '@/types/global-Interface';
import axios, { isAxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import {
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  CheckSquare,
  Square,
  AlarmClock,
  Phone,
  Mail,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Menu,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import EventAnnouncements from '../components/eventAnnouncement';
import NoTokenModal from '@/components/modals/remindModal';
import CollegeRegistrationBlockedModal, {
  type CollegeBlockReason,
} from '@/components/modals/CollegeRegistrationBlockedModal';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AddSpeakerModal from './speakers/AddSpeakerModal';
import AddJudgeModal from './speakers/AddJudgeModal';
import PaymentProofModal from '@/components/PaymentProofModal';
import { Plus, Download, Users, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { useUpdateJudge } from '@/hooks/useUpdateJudge';
import { useDeleteJudge } from '@/hooks/useDeleteJudge';
import {
  useParticipants,
  downloadParticipantsCSV,
  syncParticipantsCsv,
  InvalidSinceError,
  type Participant,
} from '@/hooks/useParticipants';
import AchievementCelebration from '@/components/AchievementCelebration';
import EventSeoHead from '@/components/EventSeoHead';
import { buildAuthHref } from '@/lib/authReturnTo';
import { isAdminEmail } from '@/lib/zynvoStaff';
import { ErrorState, EventDetailSkeleton } from '@/components/feedback';
import TeamSection from './components/TeamSection';
import { getSafeErrorMessage } from '@/lib/safe-error';
import EventEditModal from '../components/EventEditModal';
import { useSchedule } from '@/hooks/useSchedule';
import {
  getScheduleStats,
  ScheduleDayPicker,
  ScheduleEmptyState,
  ScheduleSessionTimeline,
} from './components/schedule';

interface Speaker {
  id: number;
  email: string;
  name: string;
  profilePic: string | null;
  about: string;
  eventId: string;
}

interface SpeakerResponse {
  msg: string;
  speakers: Speaker[];
}

interface Judge {
  id: string;
  name: string;
  achievement: string;
  description: string;
  eventId: string;
}

interface JudgesResponse {
  msg: string;
  data: Judge[];
}

const Eventid = () => {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<respnseUseState & { attendeesCount?: number }>({
    EventName: '',
    description: '',
    EventMode: '',
    startDate: '',
    endDate: '',
    prizes: '',
    contactEmail: '',
    contactPhone: '',
    university: '',
    venue: '',
    collegeStudentsOnly: false,
    applicationStatus: 'open',
    posterUrl: '',
    eventHeader: '',
    whatsappLink: '',
    eventWebsite: '',
    form: '',
    isPaidEvent: false,
    paymentQRCode: '',
    paymentAmount: 0,
    maxParticipants: undefined,
    attendeesCount: 0,
    customQuestions: [],
  });
  const router = useRouter();
  const eventInvitePath = `/events/${id}`;
  const signupEventHref = buildAuthHref('/auth/signup', eventInvitePath);
  const signinEventHref = buildAuthHref('/auth/signin', eventInvitePath);

  const [forkedUpId, setForkedUpId] = useState<string | null>(null);
  const [eventTeamSize, setEventTeamSize] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fetchNonce, setFetchNonce] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustomQuestionsModal, setShowCustomQuestionsModal] = useState(false);
  const [pendingCustomAnswers, setPendingCustomAnswers] = useState<CustomAnswer[]>([]);
  const [customQuestionsForm, setCustomQuestionsForm] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'speakers' | 'schedule' | 'gallery' | 'announcement' | 'attendees'
  >('overview');
  const [signedin, setSignedin] = useState<boolean>(false);
  const [userAttendedEventIds, setUserAttendedEventIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasTokenForModal, setHasTokenForModal] = useState(false);
  const [isAddSpeakerModalOpen, setIsAddSpeakerModalOpen] = useState(false);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<{ id: string; name: string; description: string; achievement: string } | null>(null);
  const updateJudgeMutation = useUpdateJudge();
  const deleteJudgeMutation = useDeleteJudge();
  const [isFounder, setIsFounder] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [eventInviteFullUrl, setEventInviteFullUrl] = useState('');
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const inviteLinkInputRef = useRef<HTMLInputElement>(null);
  const { data: schedule = [] } = useSchedule(id, token);
  const { totalSessions } = getScheduleStats(schedule);
  const [collegeBlockModal, setCollegeBlockModal] = useState<{
    open: boolean;
    reason: CollegeBlockReason;
  }>({ open: false, reason: 'mismatch' });

  // CSV sync state: lastSince (newest joinedAt), etag, last updated time, sync in progress, badge count
  const [csvLastSince, setCsvLastSince] = useState<string | null>(null);
  const [csvEtag, setCsvEtag] = useState<string | null>(null);
  const [lastCsvUpdatedAt, setLastCsvUpdatedAt] = useState<Date | null>(null);
  const [csvSyncInProgress, setCsvSyncInProgress] = useState(false);
  const [csvAppendedCount, setCsvAppendedCount] = useState(0);
  const [syncBackoffMs, setSyncBackoffMs] = useState(0);
  const queryClient = useQueryClient();
  const csvLastSinceRef = useRef(csvLastSince);
  const csvEtagRef = useRef(csvEtag);
  csvLastSinceRef.current = csvLastSince;
  csvEtagRef.current = csvEtag;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setEventInviteFullUrl(new URL(signupEventHref, window.location.origin).href);
    } catch {
      setEventInviteFullUrl('');
    }
  }, [signupEventHref]);

  const runCsvSync = React.useCallback(async () => {
    if (!id || !isFounder) return;
    setCsvSyncInProgress(true);
    const currentLastSince = csvLastSinceRef.current;
    const currentEtag = csvEtagRef.current;
    try {
      const result = await syncParticipantsCsv(id, currentLastSince, currentEtag, token);
      setCsvLastSince(result.lastSince);
      setCsvEtag(result.etag);
      setLastCsvUpdatedAt(new Date());
      setSyncBackoffMs(0);
      if (result.appended > 0) {
        setCsvAppendedCount((c) => c + result.appended);
        queryClient.invalidateQueries({ queryKey: ['participants', id] });
      }
    } catch (err) {
      if (err instanceof InvalidSinceError) {
        setCsvLastSince(null);
        setCsvEtag(null);
        setSyncBackoffMs(0);
        try {
          const result = await syncParticipantsCsv(id, null, null, token);
          setCsvLastSince(result.lastSince);
          setCsvEtag(result.etag);
          setLastCsvUpdatedAt(new Date());
          if (result.appended > 0) {
            setCsvAppendedCount((c) => c + result.appended);
            queryClient.invalidateQueries({ queryKey: ['participants', id] });
          }
        } finally {
          setCsvSyncInProgress(false);
        }
        return;
      }
      const is5xx = err instanceof Error && /^Server error 5\d\d/.test(err.message);
      if (is5xx) {
        setSyncBackoffMs((prev) => Math.min((prev || 5000) * 1.5, 60000));
        toast.error('Server busy. Retrying with backoff.');
      } else {
        toast.error(getSafeErrorMessage(err, 'Sync failed'));
      }
    } finally {
      setCsvSyncInProgress(false);
    }
  }, [id, isFounder, token, queryClient]);

  useEffect(() => {
    if (activeTab !== 'attendees' || !isFounder || !id) return;
    const intervalMs = Math.max(15000, Math.min(60000, syncBackoffMs || 30000));
    const initial = setTimeout(runCsvSync, 300);
    const poll = setInterval(runCsvSync, intervalMs);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
    };
  }, [activeTab, isFounder, id, syncBackoffMs, runCsvSync]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const session = sessionStorage.getItem('activeSession');
      
      if (storedToken) {
        setToken(storedToken);
        setHasTokenForModal(true);
              if (session !== 'true') {
              // Has token but no session - user needs to sign in
              toast('Login required', {
                action: {
                  label: 'Sign in',
                  onClick: () => router.push(signinEventHref),
                },
              });
              return;
            } else {
              setSignedin(true);
            }
      } else {
        setHasTokenForModal(false);
        return;
      } 
    }
  }, [router, signinEventHref]);

  // Fetch speakers for this event (used in the Speakers tab)
  const {
    data: speakersData,
    isLoading: isSpeakersLoading,
  } = useQuery<SpeakerResponse>({
    queryKey: ['speakers', id],
    queryFn: async () => {
      if (!id || !token) throw new Error('Missing id or token');
      const res = await axios.get<SpeakerResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/getSpeakers?id=${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const speakers = speakersData?.speakers || [];

  // Fetch judges for this event
  const {
    data: judgesData,
    isLoading: isJudgesLoading,
  } = useQuery<JudgesResponse>({
    queryKey: ['judges', id],
    queryFn: async () => {
      if (!id || !token) throw new Error('Missing id or token');
      const res = await axios.get<JudgesResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/${id}/judges`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const judges = judgesData?.data || [];

  const canViewAttendees = useMemo(
    () => isFounder || isAdminEmail(currentUser?.email),
    [isFounder, currentUser?.email]
  );

  const isResolvingAttendeeAccess =
    signedin && !isFounder && !userDataLoaded;

  // Fetch participants for this event
  const [participantsPage, setParticipantsPage] = useState(1);
  const participantsLimit = 50;
  const {
    data: participantsData,
    isLoading: isParticipantsLoading,
    error: participantsError,
  } = useParticipants({
    eventId: id,
    page: participantsPage,
    limit: participantsLimit,
    enabled: activeTab === 'attendees' && !!id && canViewAttendees,
  });

  const participants = participantsData?.data || [];
  const participantsPagination = participantsData?.pagination;

  // Check if user is founder
  useEffect(() => {
    if (!id || !token) return;

    async function checkFounderStatus() {
      try {
        const checkFounder = await axios.get<{ msg: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          checkFounder.status === 200 &&
          checkFounder.data.msg === 'identified'
        ) {
          setIsFounder(true);
        }
      } catch (error) {
        console.error('Error checking founder status:', error);
      }
    }

    checkFounderStatus();
  }, [id, token]);

  useEffect(() => {
    if (schedule.length > 0 && !schedule.some((day) => day.day === activeDay)) {
      setActiveDay(schedule[0].day);
    }
  }, [schedule, activeDay]);

  // Fetch user data and attended events
  useEffect(() => {
    if (!token) {
      setUserDataLoaded(false);
      return;
    }

    async function fetchUserData() {
      setUserDataLoaded(false);

      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (userResponse.data && (userResponse.data as any).user) {
          const userData = (userResponse.data as any).user;
          setCurrentUser(userData);
          
          // Extract attended event IDs (normalize to string — API may return number)
          if (userData.eventAttended && Array.isArray(userData.eventAttended)) {
            const attendedIds = userData.eventAttended.map((attendance: any) =>
              String(attendance?.event?.id ?? '')
            ).filter(Boolean);
            setUserAttendedEventIds(attendedIds);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setUserDataLoaded(true);
      }
    }
    
    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await axios.get<EventByIdResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (res && res.status === 200) {
          // Map backend field names to frontend expected names
          // Backend uses: isPaid, qrCodeUrl
          // Frontend expects: isPaidEvent, paymentQRCode
          const isPaid = (res.data.response as any).isPaid ?? res.data.response.isPaidEvent ?? false;
          const qrCodeUrl = (res.data.response as any).qrCodeUrl || res.data.response.paymentQRCode || '';
          const paymentAmount = res.data.response.paymentAmount || 0;
          
          console.log('Event data received:', {
            isPaid: (res.data.response as any).isPaid,
            isPaidEvent: res.data.response.isPaidEvent,
            qrCodeUrl: (res.data.response as any).qrCodeUrl,
            paymentQRCode: res.data.response.paymentQRCode,
            paymentAmount: paymentAmount,
          });
          
          // If paymentQRCode/qrCodeUrl exists, treat as paid event even if isPaid/isPaidEvent flag is not set
          const hasPaidEvent = isPaid || !!qrCodeUrl;
          
          setData({
            EventName: res.data.response.EventName || '',
            description: res.data.response.description || '',
            EventMode: res.data.response.EventMode || '',
            startDate: res.data.response.startDate || '',
            endDate: res.data.response.endDate || '',
            prizes: res.data.response.prizes || '',
            university: res.data.response.university || '',
            venue: res.data.response.Venue || (res.data.response as any).venue || '',
            collegeStudentsOnly: res.data.response.collegeStudentsOnly ?? false,
            contactEmail: res.data.response.contactEmail || '',
            contactPhone: res.data.response.contactPhone || '',
            applicationStatus: res.data.response.applicationStatus || 'open',
            posterUrl:
              res.data.response.posterUrl ||
              res.data.response.eventHeaderImage ||
              '',
            whatsappLink: res.data.response.whatsappLink || res.data.response.whatsappGroupLink || '',
            eventWebsite: res.data.response.eventWebsite || res.data.response.EventUrl || '',
            form: res.data.response.form || res.data.response.registrationForm || '',
            isPaidEvent: hasPaidEvent,
            paymentQRCode: qrCodeUrl,
            paymentAmount: paymentAmount,
            maxParticipants: res.data.response.maxParticipants,
            attendeesCount: (res.data.response as any)._count?.attendees ?? 0,
            customQuestions: res.data.response.customQuestions || [],
          });
          // Store TeamSize for team section
          setEventTeamSize(res.data.response.TeamSize || 1);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        const msg =
          isAxiosError(error) && error.response?.status === 404
            ? 'This event could not be found. It may have been removed or the link is wrong.'
            : 'We could not load this event. Check your connection and try again.';
        setLoadError(msg);
      } finally {
        setIsLoading(false);
      }
    }
   
    fetchEventData();
  }, [token, id, fetchNonce]);

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast.success('Event deleted successfully');
      router.push('/events');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete event');
    }
  };

  const handleRegistration = async () => {
    if (!token) {
      toast.error('Please login to register for this event');
      return;
    }

    setRegistrationNotice(null);
    if (isCollegeRestrictionBlocking) {
      if (isCollegeNameMissing) {
        setCollegeBlockModal({ open: true, reason: 'missing' });
      } else if (isCollegeMismatch) {
        setCollegeBlockModal({ open: true, reason: 'mismatch' });
      } else if (isCollegeUnknown) {
        setCollegeBlockModal({ open: true, reason: 'unknown' });
      }
      return;
    }

    if (data.customQuestions?.length) {
      setCustomQuestionsForm({});
      setPendingCustomAnswers([]);
      setShowCustomQuestionsModal(true);
      return;
    }

    await startRegistrationAfterQuestions();
  };

  const startRegistrationAfterQuestions = async (customAnswers: CustomAnswer[] = []) => {
    setPendingCustomAnswers(customAnswers);

    // Debug: Log all payment-related data
    console.log('=== Registration Debug ===');
    console.log('data.isPaidEvent:', data.isPaidEvent, typeof data.isPaidEvent);
    console.log('data.paymentQRCode:', data.paymentQRCode, 'length:', data.paymentQRCode?.length);
    console.log('data.paymentAmount:', data.paymentAmount, typeof data.paymentAmount);
    console.log('Full data object:', JSON.stringify({
      isPaidEvent: data.isPaidEvent,
      paymentQRCode: data.paymentQRCode,
      paymentAmount: data.paymentAmount
    }, null, 2));

    if (data.customQuestions && data.customQuestions.length > 0) {
      setShowCustomQuestionsModal(true);
      return;
    }

    proceedWithPaymentOrRegistration();
  };

  const proceedWithPaymentOrRegistration = (customAnswers?: CustomAnswer[]) => {
    // If it's a paid event, show payment modal instead of registering immediately
    // Check multiple indicators: isPaidEvent flag, paymentQRCode, or paymentAmount > 0
    const hasQRCode = !!data.paymentQRCode && data.paymentQRCode.trim().length > 0;
    const hasPaymentAmount = data.paymentAmount !== undefined && data.paymentAmount !== null && Number(data.paymentAmount) > 0;
    const isPaidEvent = Boolean(data.isPaidEvent) || hasQRCode || hasPaymentAmount;
    
    console.log('Check results:');
    console.log('  Boolean(data.isPaidEvent):', Boolean(data.isPaidEvent));
    console.log('  hasQRCode:', hasQRCode);
    console.log('  hasPaymentAmount:', hasPaymentAmount);
    console.log('  isPaidEvent (final):', isPaidEvent);
    
    if (isPaidEvent) {
      console.log('✓ Showing payment modal...');
      if (customAnswers) {
        setPendingCustomAnswers(customAnswers);
      }
      setShowPaymentModal(true);
      return;
    }

    console.log('✗ Proceeding with direct registration (free event)');
    // For free events, proceed with registration
    completeRegistration(undefined, customAnswers);
  };

  const handleCustomQuestionsSubmit = () => {
    if (!data.customQuestions) return;

    const answers: CustomAnswer[] = [];
    
    // Validation
    for (const q of data.customQuestions) {
      const questionId = q.id || '';
      if (!questionId) continue;
      
      const val = customQuestionsForm[questionId];
      if (q.required && (!val || val.trim() === '')) {
        toast.error(`Please answer the required question: ${q.label}`);
        return;
      }
      if (val && val.trim() !== '') {
        answers.push({ questionId: questionId, answer: val });
      }
    }

    setShowCustomQuestionsModal(false);
    proceedWithPaymentOrRegistration(answers);
  };

  const completeRegistration = async (paymentProofUrl?: string, customAnswers?: CustomAnswer[]) => {
    try {
      setIsRegistering(true);
      console.log('completeRegistration called with paymentProofUrl:', paymentProofUrl);
      const bodyData = { 
        eventId: id,
        ...(paymentProofUrl && { paymentProofUrl }),
        ...(customAnswers && customAnswers.length > 0 && { customAnswers })
      };
      console.log('Sending registration request with body:', bodyData);

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
        console.log('Registration successful');
        setForkedUpId(resp.data.ForkedUpId);
        // Immediately mark this event as attended so WhatsApp / UI update without full reload
        const sid = String(id);
        setUserAttendedEventIds((prev) =>
          prev.some((x) => String(x) === sid) ? prev : [...prev, sid]
        );
        // Show celebration modal
        setShowCelebration(true);
        // Show WhatsApp modal after celebration closes if link is available
        if (data.whatsappLink) {
          setTimeout(() => {
            setShowWhatsappModal(true);
          }, 2500);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const axiosError = error as any;
      if (axiosError?.response?.status === 403) {
        setRegistrationNotice(null);
        setCollegeBlockModal({ open: true, reason: 'mismatch' });
      } else {
        toast.error(getSafeErrorMessage(error, 'Registration failed. Please try again.'));
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePaymentProofSubmitted = async (proofUrl: string) => {
    setShowPaymentModal(false);
    await completeRegistration(proofUrl, pendingCustomAnswers);
  };

  const handleCopyInviteLink = async () => {
    if (!eventInviteFullUrl) {
      toast.error('Invite link is not ready yet. Please try again in a moment.');
      return;
    }

    try {
      await navigator.clipboard.writeText(eventInviteFullUrl);
      setCopiedInviteLink(true);
      toast.success('Event invite link copied!');
      setTimeout(() => setCopiedInviteLink(false), 2000);
    } catch {
      inviteLinkInputRef.current?.focus();
      inviteLinkInputRef.current?.select();
      toast.error('Copy failed. Select the invite link and copy it manually.');
    }
  };

  // Helper: user is registered — compare ids as strings (params vs API types differ)
  const isUserAttendingEvent = (): boolean => {
    if (!id) return false;
    const sid = String(id);
    return userAttendedEventIds.some((eid) => String(eid) === sid);
  };
  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return 'TBD';
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    if (s && e) return `${fmt(s)} → ${fmt(e)}`;
    if (s) return fmt(s);
    return fmt(e as Date);
  };

  const isOnline = useMemo(
    () => (data?.EventMode || '').toLowerCase().includes('online'),
    [data.EventMode]
  );

  const displayLocation = useMemo(
    () => data.venue || (isOnline ? 'Online' : data.university),
    [data.venue, data.university, isOnline]
  );

  // Check if event has ended
  const isEventEnded = useMemo(() => {
    if (!data.endDate) return false;
    return new Date(data.endDate) < new Date();
  }, [data.endDate]);

  const normalizedUserCollege = useMemo(
    () => (currentUser?.collegeName || '').trim().toLowerCase(),
    [currentUser?.collegeName]
  );

  const normalizedEventUniversity = useMemo(
    () => (data.university || '').trim().toLowerCase(),
    [data.university]
  );

  const isCollegeRestricted = useMemo(
    () => Boolean(data.collegeStudentsOnly),
    [data.collegeStudentsOnly]
  );

  const isCollegeNameMissing = isCollegeRestricted && !normalizedUserCollege;
  const isCollegeMismatch =
    isCollegeRestricted &&
    !!normalizedUserCollege &&
    !!normalizedEventUniversity &&
    normalizedUserCollege !== normalizedEventUniversity;
  const isCollegeUnknown =
    isCollegeRestricted &&
    !!normalizedUserCollege &&
    !normalizedEventUniversity;

  const isCollegeRestrictionBlocking =
    isCollegeNameMissing || isCollegeMismatch || isCollegeUnknown;

  const isEventFull = useMemo(() => {
    return !!data.maxParticipants && (data.attendeesCount ?? 0) >= data.maxParticipants;
  }, [data.maxParticipants, data.attendeesCount]);

  // Check if registration is disabled (event ended or applications closed or full)
  /** Ended / closed only — college rules are handled on click (modal), so wrong-college users can tap Register. */
  const isRegistrationDisabled = useMemo(() => {
    return isEventEnded || data.applicationStatus !== 'open' || isEventFull;
  }, [isEventEnded, data.applicationStatus, isEventFull]);

  const googleCalendarHref = useMemo(() => {
    // Build a Google Calendar event URL (best-effort if dates exist)
    const toGoogleDate = (iso?: string) => {
      if (!iso) return '';
      const d = new Date(iso);
      // YYYYMMDDTHHMMSSZ
      const pad = (n: number) => `${n}`.padStart(2, '0');
      const yyyy = d.getUTCFullYear();
      const MM = pad(d.getUTCMonth() + 1);
      const dd = pad(d.getUTCDate());
      const hh = pad(d.getUTCHours());
      const mm = pad(d.getUTCMinutes());
      const ss = pad(d.getUTCSeconds());
      return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`;
    };

    const start = toGoogleDate(data.startDate);
    const end = toGoogleDate(data.endDate || data.startDate);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: data.EventName || 'Event',
      details: data.description || '',
      location: displayLocation,
    });
    if (start && end) {
      params.set('dates', `${start}/${end}`);
    }
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [
    data.EventName,
    data.description,
    displayLocation,
    data.startDate,
    data.endDate,
  ]);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <ErrorState
          title="Unable to load event"
          message={loadError}
          onRetry={() => {
            setLoadError(null);
            setFetchNonce((n) => n + 1);
          }}
        />
        <Link
          href="/events"
          className="mt-8 inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all events
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full text-white">
      <EventSeoHead
        eventName={data.EventName}
        collegeName={data.university}
        eventType={data.EventMode}
        description={data.description}
        startDate={data.startDate}
        endDate={data.endDate}
        eventMode={data.EventMode}
        posterUrl={data.posterUrl}
        eventUrl={data.eventWebsite}
        venue={displayLocation}
        prizes={data.prizes}
        contactEmail={data.contactEmail}
        pageUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        {/* Hero — framed panel for clearer hierarchy on dark bg */}
        <section className="mb-8 pb-8 border-b border-gray-800">
          <div className="rounded-2xl border border-yellow-500/25 bg-[#0B0B0B] p-4 shadow-lg shadow-black/20 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left: Event Info */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <p className="text-yellow-400 text-xs uppercase tracking-wider mb-2">
                    Event
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
                    {data.EventName || 'Event Title'}
                  </h1>
                </div>

                {/* Event Meta Chips */}
                <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm mt-2">
                  <div className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/80 px-3 py-1.5 text-gray-200">
                    <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 shrink-0" />
                    <span>
                      {formatDateRange(data.startDate, data.endDate)}
                    </span>
                  </div>
                  {displayLocation && (
                    <div className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/80 px-3 py-1.5 text-gray-200 max-w-full min-w-0">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 shrink-0" />
                      <span className="truncate">{displayLocation}</span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/80 px-3 py-1.5 text-gray-200">
                    {isOnline ? (
                      <Globe className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                    ) : (
                      <Square className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                    )}
                    <span>
                      {isOnline ? 'Online' : data.EventMode || 'Mode TBA'}
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border text-xs md:text-sm ${
                      data.applicationStatus === 'open'
                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
                        : 'border-red-700 bg-red-50 text-red-700'
                    }`}
                  >
                    {data.applicationStatus === 'open' && (
                      <CheckSquare className="w-3 h-3" />
                    )}
                    <span>
                      Applications {data.applicationStatus || 'status TBA'}
                    </span>
                  </div>
                </div>

                {/* Payment Info for Paid Events */}
                {data.isPaidEvent && (
                  <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-300">Payment Required</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      This is a paid event. After clicking register, you'll need to scan the QR code and upload your payment screenshot.
                    </p>
                    <p className="text-sm font-semibold text-yellow-300 mt-2">
                      Amount: ₹{data.paymentAmount}
                    </p>
                  </div>
                )}

                {/* Action Buttons — stack on narrow screens */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-2">

                  {isFounder && (
                    <>
                      <Button
                        onClick={() => setIsEditModalOpen(true)}
                        className="min-h-11 rounded-lg px-5 py-2.5 font-medium bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                      >
                        Edit Event
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                            handleDeleteEvent();
                          }
                        }}
                        className="min-h-11 rounded-lg px-5 py-2.5 font-medium bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                      >
                        Delete Event
                      </Button>
                    </>
                  )}
                  {signedin ? (
                    isUserAttendingEvent() ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg font-medium">
                        <CheckSquare className="w-4 h-4" />
                        <span>You're attending</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleRegistration}
                          disabled={isRegistering || isRegistrationDisabled}
                          className={`min-h-11 w-full sm:w-auto rounded-lg px-5 py-2.5 font-medium ${
                            isRegistering || isRegistrationDisabled
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-amber-900 hover:bg-amber-950 text-yellow-200'
                          }`}
                        >
                          {isRegistering ? 'Registering...' : isEventEnded ? 'Event Ended' : isEventFull ? 'Event Full' : 'Register Now'}
                        </Button>
                        {data.maxParticipants && (
                          <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-900/60 px-4 py-2 border border-gray-800 rounded-lg">
                            <span className="font-semibold text-yellow-400">Capacity:</span>
                            <span>{data.attendeesCount} / {data.maxParticipants} registered</span>
                          </div>
                        )}
                        {isEventEnded && (
                          <p className="text-xs text-red-700">This event has already ended</p>
                        )}
                        {/* {isCollegeRestricted && data.university && (
                          // <p className="text-sm text-gray-300 max-w-xl">
                          //   Organizer college:{' '}
                          //   <span className="text-yellow-300">{data.university}</span>
                          //   <span className="text-gray-400">
                          //     {' '}
                          //     · Limited to students of this college
                          //   </span>
                          // </p>
                        )} */}
                        {isCollegeNameMissing && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-300">
                            <span>
                              Tap Register to add your college in the prompt, or
                              update your profile first.
                            </span>
                            <Button
                              onClick={() => router.push('/dashboard')}
                              className="bg-amber-900 hover:bg-amber-950 text-yellow-200 px-3 py-1 text-xs"
                            >
                              Complete profile
                            </Button>
                          </div>
                        )}
                        {!isCollegeRestrictionBlocking && registrationNotice && (
                          <p className="text-xs text-red-700">
                            {registrationNotice}
                          </p>
                        )}
                      </>
                    )
                  ) : (
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="min-h-11 rounded-lg px-5 py-2.5 font-medium bg-amber-900 hover:bg-amber-950 text-yellow-200 w-full sm:w-auto"
                    >
                      {hasTokenForModal
                        ? 'Sign in to Register'
                        : 'Sign up to Register'}
                    </Button>
                  )}

                  <a
                    href={googleCalendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 text-white transition-colors w-full sm:w-auto"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Add to Calendar</span>
                  </a>
                </div>

                <div className="max-w-2xl rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-yellow-300">
                    <Share2 className="h-3.5 w-3.5" />
                    Event Invite Link
                  </div>
                  <div className="flex overflow-hidden rounded-lg border border-yellow-500/30 bg-black/30">
                    <input
                      ref={inviteLinkInputRef}
                      readOnly
                      value={eventInviteFullUrl}
                      onClick={(e) => e.currentTarget.select()}
                      onFocus={(e) => e.currentTarget.select()}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-gray-200 outline-none"
                      aria-label="Event invite link"
                    />
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 bg-yellow-500 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-yellow-400"
                      title="Copy event invite link"
                    >
                      {copiedInviteLink ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedInviteLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  {copiedInviteLink ? (
                    <p className="mt-2 text-xs text-green-300">Invite link copied to clipboard.</p>
                  ) : (
                    <p className="mt-2 text-xs text-yellow-100/70">
                      Share this to bring people back to this event after signup or signin.
                    </p>
                  )}
                </div>

                {/* Success notice */}
                {forkedUpId && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-700 rounded-lg">
                    <p className="text-emerald-900 font-medium mb-1 text-sm">
                      Registration Successful! 🎉
                    </p>
                    <p className="text-emerald-800 text-sm">
                      Get your pass on{' '}
                      <a
                        href={`https://zynvosocial.com/ticket/${forkedUpId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 underline font-medium"
                      >
                        Zynced It
                      </a>
                      .
                    </p>
                  </div>
                )}

                {/* WhatsApp — hero left column, aligned with poster row */}
                {data.whatsappLink && isUserAttendingEvent() && (
                  <div className="mt-4 p-4 bg-gray-900/80 border border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                       <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="text-yellow-400 w-5 h-5 shrink-0 fill-current"
                        >
                        <path d="M16.001 3C9.372 3 4 8.372 4 15c0 2.385.699 4.607 1.898 6.48L4 29l7.722-1.867A11.93 11.93 0 0016.001 27C22.63 27 28 21.628 28 15S22.63 3 16.001 3zm0 21.6c-1.98 0-3.84-.58-5.4-1.58l-.38-.24-4.58 1.1 1.22-4.46-.26-.4A9.58 9.58 0 016.4 15c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.28-7.2c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.73.94-.9 1.13-.16.19-.33.21-.62.07-.29-.14-1.22-.45-2.33-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.12-.58.12-.12.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-.98 2.44.02 1.44 1.04 2.83 1.18 3.03.14.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.1-.26-.17-.55-.31z"/>
                        </svg>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white text-sm mb-1">
                          Join the WhatsApp group
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          Stay updated and connect with other participants.
                        </p>
                        <a
                          href={data.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg text-sm font-medium transition-colors"
                        >
                          <span>Open WhatsApp</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Section — only for team events after registration */}
                {isUserAttendingEvent() && eventTeamSize > 1 && (
                  <TeamSection
                    eventId={id}
                    token={token}
                    teamSize={eventTeamSize}
                  />
                )}
              </div>

              {/* Right: Poster */}
              <div className="lg:col-span-1">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                  {data.posterUrl ? (
                    <Image
                      src={data.posterUrl}
                      alt="Event Poster"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <CalendarIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-xs">Poster coming soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-800">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'speakers', label: 'Speakers & Judges' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'announcement', label: 'Announcements' },
                { id: 'attendees', label: 'Attendees' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        
      <EventEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        eventId={id as string}
        eventData={data}
        onUpdateSuccess={() => {
          setFetchNonce(n => n + 1);
        }}
      />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-5 sm:p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  About This Event
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {data.description ||
                    'Event description will be available soon...'}
                </p>

                {/* Event Website Link */}
                {data.eventWebsite && (
                  <div className="mb-6 p-4 bg-gray-900/70 border border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">Event Website</h3>
                        <p className="text-gray-300 text-sm mb-3">Visit the official event website for more information.</p>
                        <a
                          href={data.eventWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors"
                        >
                          <span>Visit Website</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Form Link */}
                {data.form && (
                  <div className="mb-6 p-4 bg-gray-900/70 border border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckSquare className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">Registration Form</h3>
                        <p className="text-gray-300 text-sm mb-3">Fill out the registration form to participate in this event.</p>
                        <a
                          href={data.form}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors"
                        >
                          <span>Open Form</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paid Event Details - Only for Event Founders */}
                {isFounder && data.isPaidEvent && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                        <span className="text-lg">💳</span>
                        Payment Details
                      </h3>
                      
                      {/* Payment Amount */}
                      <div className="bg-yellow-900/20 p-3 rounded border border-yellow-500/20">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Payment Amount</p>
                        <p className="text-2xl font-bold text-yellow-400">₹{data.paymentAmount}</p>
                      </div>

                      {/* QR Code Display */}
                      {data.paymentQRCode ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Payment QR Code</p>
                          <div className="bg-white p-3 rounded-lg inline-block">
                            <Image
                              src={data.paymentQRCode}
                              alt="Payment QR Code"
                              width={200}
                              height={200}
                              className="w-auto h-auto"
                              priority={false}
                            />
                          </div>
                          <a
                            href={data.paymentQRCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            View Full Size
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-900/70 p-4 rounded border border-dashed border-gray-700 text-center">
                          <p className="text-gray-300 text-sm">QR Code not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-white">{displayLocation || 'TBD'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Mode
                    </p>
                    <p className="text-white">{data.EventMode || 'TBD'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Start Date
                    </p>
                    <p className="text-white">
                      {data.startDate
                        ? new Date(data.startDate).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      End Date
                    </p>
                    <p className="text-white">
                      {data.endDate
                        ? new Date(data.endDate).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                {/* Prizes & Highlights */}
                {data.prizes && data.prizes.trim().length > 0 && (
                  <div className="mt-6 rounded-lg border border-yellow-500/25 bg-yellow-500/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
                        Prizes & Highlights
                      </h3>
                    </div>
                    <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                      {data.prizes}
                    </div>
                  </div>
                )}

                {/* Why you should join */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Compete & Win
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Show off your skills, build your portfolio and take a shot
                      at exclusive campus-level prizes.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Meet Smart People
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Connect with organisers, speakers and participants from
                      across your campus network.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400">
                      <AlarmClock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Make Memories
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Turn a normal week into something memorable with matches,
                      photos and late-night prep with your friends.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="space-y-6">
                {/* Speakers Section */}
                <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-yellow-400">
                      Speakers
                    </h2>
                    {isFounder && (
                      <Button
                        onClick={() => setIsAddSpeakerModalOpen(true)}
                        className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Speaker
                      </Button>
                    )}
                  </div>

                  {isSpeakersLoading ? (
                    <p className="text-gray-400">Loading speakers...</p>
                  ) : speakers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">
                        Speakers will be revealed closer to the event.
                      </p>
                      {isFounder && (
                        <Button
                          onClick={() => setIsAddSpeakerModalOpen(true)}
                          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Speaker
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="bg-black border border-yellow-500/20 rounded-lg p-4 flex gap-3"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image
                              src={
                                speaker.profilePic ||
                                'https://i.pravatar.cc/150?img=11'
                              }
                              alt={speaker.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {speaker.name}
                            </h3>
                            <p className="text-xs text-yellow-400 truncate">
                              {speaker.email}
                            </p>
                            <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                              {speaker.about}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Judges Section */}
                <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-yellow-400">
                      Judges
                    </h2>
                    {isFounder && (
                      <Button
                        onClick={() => setIsAddJudgeModalOpen(true)}
                        className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Judge
                      </Button>
                    )}
                  </div>

                  {isJudgesLoading ? (
                    <p className="text-gray-400">Loading judges...</p>
                  ) : judges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">
                        Judges will be revealed closer to the event.
                      </p>
                      {isFounder && (
                        <Button
                          onClick={() => setIsAddJudgeModalOpen(true)}
                          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Judge
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {judges.map((judge) => (
                        <div
                          key={judge.id}
                          className="group bg-black border border-yellow-500/20 rounded-lg p-4 flex gap-3 relative"
                        >
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 text-yellow-400 font-bold text-lg shadow-inner shadow-yellow-500/10">
                            {(judge.name || '').trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {judge.name}
                            </h3>
                            <p className="text-xs text-yellow-400 truncate">
                              {judge.achievement}
                            </p>
                            <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                              {judge.description}
                            </p>
                          </div>
                          {isFounder && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingJudge({ id: judge.id, name: judge.name, description: judge.description, achievement: judge.achievement })}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                                title="Edit judge"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteJudgeMutation.mutate({ eventId: id as string, judgeId: judge.id })}
                                disabled={deleteJudgeMutation.isPending}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                                title="Remove judge"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800/80 pb-5">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
                      Timeline
                      {totalSessions > 0 && (
                        <span className="text-yellow-400/80">· {totalSessions} sessions</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-yellow-400">Event Schedule</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Stay updated with the timeline and venues for all sessions.
                    </p>
                  </div>
                  {isFounder && (
                    <Link
                      href={`/events/${id}/schedule`}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold rounded-lg transition-all shadow-lg shadow-yellow-500/10 flex items-center gap-2 text-sm justify-center"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      <span>Manage Schedule</span>
                    </Link>
                  )}
                </div>

                {schedule.length > 0 && (
                  <ScheduleDayPicker
                    days={schedule}
                    activeDay={activeDay}
                    onDayChange={setActiveDay}
                    className="mb-8"
                  />
                )}

                {(() => {
                  const currentDayData = schedule.find((d) => d.day === activeDay) || schedule[0];
                  const currentSessions = currentDayData?.sessions || [];
                  const dayLabel =
                    currentDayData?.name ||
                    (currentDayData?.date
                      ? `Day ${activeDay} · ${currentDayData.date}`
                      : `Day ${activeDay}`);

                  if (currentSessions.length === 0) {
                    return (
                      <ScheduleEmptyState
                        dayLabel={dayLabel}
                        isFounder={isFounder}
                        manageHref={`/events/${id}/schedule`}
                      />
                    );
                  }

                  return (
                    <ScheduleSessionTimeline
                      sessions={currentSessions}
                      showDescriptionInline
                    />
                  );
                })()}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-yellow-400">
                    Gallery
                  </h2>
                  <a
                    href={`/events/${id}/gallery`}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Gallery</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-gray-400">
                  Click "View Gallery" to see photos and media from the event.
                </p>
              </div>
            )}

            {activeTab === 'announcement' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  Announcements
                </h2>
                <EventAnnouncements eventId={id as string} isFounder={isFounder} />
              </div>
            )}

            {activeTab === 'attendees' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6 space-y-4">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Attendees
                      {csvAppendedCount > 0 && (
                        <span className="text-xs font-normal bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          {csvAppendedCount} new
                        </span>
                      )}
                    </h2>
                    {isFounder && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setCsvAppendedCount(0);
                            runCsvSync();
                          }}
                          disabled={csvSyncInProgress}
                          className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${csvSyncInProgress ? 'animate-spin' : ''}`} />
                          Sync
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await downloadParticipantsCSV(id, token);
                            } catch (error) {
                              console.error('Error downloading CSV:', error);
                            }
                          }}
                          disabled={csvSyncInProgress}
                          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          Download CSV
                        </Button>
                      </div>
                    )}
                  </div>
                  {isFounder && (
                    <p className="text-gray-500 text-sm">
                      Last updated at {lastCsvUpdatedAt ? lastCsvUpdatedAt.toLocaleTimeString() : '—'}
                    </p>
                  )}
                </div>

                {!canViewAttendees ? (
                  isResolvingAttendeeAccess ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading attendees...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        You are not allowed to view the attendees list.
                      </p>
                    </div>
                  )
                ) : isParticipantsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading attendees...</p>
                  </div>
                ) : participantsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">
                      Failed to load attendees. Please try again.
                    </p>
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No attendees registered yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {participants.map((participant: Participant) => (
                        <div
                          key={`${participant.user.id}-${participant.joinedAt}`}
                          className="bg-black border border-yellow-500/20 rounded-lg p-4 flex gap-4 hover:border-yellow-500/40 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                            {participant.user.profileAvatar ? (
                              <Image
                                src={participant.user.profileAvatar}
                                alt={participant.user.name || 'User'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                <span className="text-black font-bold text-sm">
                                  {participant.user.name
                                    ? participant.user.name.charAt(0).toUpperCase()
                                    : 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {participant.user.name || 'Anonymous User'}
                            </h3>
                            <p className="text-xs text-yellow-400 truncate">
                              {participant.user.email}
                            </p>
                            {participant.user.collegeName && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {participant.user.collegeName}

                                {participant.user.year && ` • Year ${participant.user.year}`}
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1 mb-2">
                              Joined:{' '}
                              {new Date(participant.joinedAt).toLocaleDateString()}
                            </p>

                            {/* Display Custom Answers */}
                            {(participant as any).customAnswers?.length > 0 && (
                              <div className="mt-2 space-y-1 bg-gray-900/50 p-2 rounded border border-gray-800">
                                <p className="text-xs font-semibold text-gray-400 mb-1">Registration Details:</p>
                                {(participant as any).customAnswers.map((ans: any, i: number) => (
                                  <div key={i} className="flex text-xs">
                                    <span className="text-gray-500 mr-2 min-w-[80px]">{ans.label}:</span>
                                    <span className="text-gray-300 font-medium">
                                      {ans.answer.startsWith('http') ? (
                                        <a href={ans.answer} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{ans.answer}</a>
                                      ) : ans.answer}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {participantsPagination &&
                      participantsPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <p className="text-sm text-gray-400">
                            Showing {participants.length} of{' '}
                            {participantsPagination.total} attendees
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                setParticipantsPage((p) => Math.max(1, p - 1))
                              }
                              disabled={participantsPage === 1}
                              variant="outline"
                              size="sm"
                              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-400">
                              Page {participantsPagination.page} of{' '}
                              {participantsPagination.totalPages}
                            </span>
                            <Button
                              onClick={() =>
                                setParticipantsPage((p) =>
                                  Math.min(
                                    participantsPagination.totalPages,
                                    p + 1
                                  )
                                )
                              }
                              disabled={
                                participantsPage >=
                                participantsPagination.totalPages
                              }
                              variant="outline"
                              size="sm"
                              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="pt-6 border-t border-gray-800/80">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                Make Your Campus Life Unforgettable
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Join Zynvo and connect with your campus community.
              </p>
              <Button
                onClick={() => router.push(signupEventHref)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg px-5 py-2"
              >
                Join Zynvo
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            {(data.contactEmail || data.contactPhone) && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-5">
                <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
                <div className="space-y-3">
                  {data.contactEmail && (
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="flex items-center gap-3 text-sm text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="break-all">{data.contactEmail}</span>
                    </a>
                  )}
                  {data.contactPhone && (
                    <a
                      href={`tel:${data.contactPhone}`}
                      className="flex items-center gap-3 text-sm text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span>{data.contactPhone}</span>
                    </a>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <a
                    href={googleCalendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 text-white transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Save / Share
                  </a>
                </div>
              </div>
            )}

            {/* Compact Poster Card */}
            {data.posterUrl && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-3">
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
                  <Image
                    src={data.posterUrl}
                    alt="Event Poster"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      
      <CollegeRegistrationBlockedModal
        isOpen={collegeBlockModal.open}
        onOpenChange={(open) =>
          setCollegeBlockModal((prev) => ({ ...prev, open }))
        }
        reason={collegeBlockModal.reason}
        organizerCollegeName={data.university}
        userCollegeName={currentUser?.collegeName}
        onGoToProfile={() => router.push('/dashboard')}
      />

      <NoTokenModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        hasToken={hasTokenForModal}
        variant="event_register"
      />
      
      {/* Add Speaker Modal */}
      <AddSpeakerModal
        isOpen={isAddSpeakerModalOpen}
        onClose={() => setIsAddSpeakerModalOpen(false)}
        eventId={id}
      />

      {/* Add Judge Modal */}
      <AddJudgeModal
        isOpen={isAddJudgeModalOpen}
        onClose={() => setIsAddJudgeModalOpen(false)}
        eventId={id}
      />

      {/* Edit Judge Modal */}
      <AddJudgeModal
        isOpen={!!editingJudge}
        onClose={() => setEditingJudge(null)}
        eventId={id}
        initialData={editingJudge ?? undefined}
        onSave={(data) => {
          if (!editingJudge) return;
          updateJudgeMutation.mutate(
            { eventId: id as string, judgeId: editingJudge.id, ...data },
            { onSuccess: () => setEditingJudge(null) }
          );
        }}
      />

      {/* Payment Proof Modal for Paid Events */}
      <PaymentProofModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onProofSubmitted={handlePaymentProofSubmitted}
        qrCodeUrl={data.paymentQRCode || ''}
        eventName={data.EventName}
        paymentAmount={data.paymentAmount || 0}
        isSubmitting={isRegistering}
      />

      {/* Custom Questions Modal */}
      {showCustomQuestionsModal && data.customQuestions?.length ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-[#0B0B0B] p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">Registration Questions</h2>
              <p className="mt-1 text-sm text-gray-400">
                The organizer needs a few extra details before you register.
              </p>
            </div>

            <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
              {data.customQuestions.map((question, index) => {
                const questionId = question.id || String(index);
                const value = customQuestionsForm[questionId] || '';

                return (
                  <div key={questionId}>
                    <label
                      htmlFor={`custom-answer-${questionId}`}
                      className="mb-1 block text-sm font-medium text-yellow-400"
                    >
                      {question.label}
                      {question.required ? ' *' : ''}
                    </label>

                    {question.type === 'select' ? (
                      <select
                        id={`custom-answer-${questionId}`}
                        value={value}
                        onChange={(e) =>
                          setCustomQuestionsForm((prev) => ({
                            ...prev,
                            [questionId]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-yellow-500"
                      >
                        <option value="">Select an option</option>
                        {(question.options || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`custom-answer-${questionId}`}
                        type={question.type === 'url' ? 'url' : 'text'}
                        value={value}
                        onChange={(e) =>
                          setCustomQuestionsForm((prev) => ({
                            ...prev,
                            [questionId]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-yellow-500"
                        placeholder={question.type === 'url' ? 'https://...' : 'Your answer'}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCustomQuestionsModal(false)}
                className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCustomQuestionsSubmit}
                disabled={isRegistering}
                className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-400 disabled:opacity-70"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Achievement Celebration Modal */}
      <AchievementCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        eventName={data.EventName || 'Event'}
      />

      {/* WhatsApp Group Modal */}
      {showWhatsappModal && data.whatsappLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0B0B0B] border border-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">💚</div>
              <h2 className="text-2xl font-bold text-white mb-2">Join WhatsApp Group!</h2>
              <p className="text-gray-300 mb-6">
                You've successfully registered! Join our WhatsApp group to stay updated with event announcements and connect with other participants.
              </p>
              <div className="space-y-3">
                <a
                  href={data.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <span>Open WhatsApp Group</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setShowWhatsappModal(false)}
                  className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventid;
