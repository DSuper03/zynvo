'use client';

import posthog from 'posthog-js';
import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  Calendar,
  Globe,
  Upload,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  CreditCard,
  Lock,
} from 'lucide-react';
import Image from 'next/image';
import { MagicCard } from '@/components/magicui/magic-card';
import { Card } from '@/components/ui/card';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventFormData, CustomQuestion } from '@/types/global-Interface';
import { Plus, Trash2, GripVertical, Settings2 } from 'lucide-react';
import {
  toBase64,
  uploadImageToImageKit,
  compressImageToUnder2MB,
} from '@/lib/imgkit';
import { toast } from 'sonner';
import axios from 'axios';
import NoTokenModal from '@/components/modals/remindModal';
import { collegesWithClubs } from '@/components/colleges/college';
import { useRouter } from 'next/navigation';
import AchievementUnlockModal from '@/components/AchievementUnlockModal';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [token, setToken] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const [qrCodeImg, setQrCodeImg] = useState<File | null>(null);
  const [qrCodePreviewUrl, setQrCodePreviewUrl] = useState('');
  const [step, setStep] = useState(1);

  // Added acceptanceBased to the initial state
  const [formData, setFormData] = useState<
    EventFormData & { acceptanceBased?: boolean }
  >({
    eventMode: '',
    eventName: '',
    university: '',
    tagline: '',
    description: '',
    eventType: '',
    maxTeamSize: 1,
    venue: '',
    collegeStudentsOnly: false,
    noParticipationFee: false,
    coreTeamOnly: false,
    acceptanceBased: false, // New Field Added Here
    eventWebsite: '',
    eventStartDate: '',
    eventEndDate: '',
    applicationStartDate: '',
    applicationEndDate: '',
    prizes: '',
    contactEmail: '',
    contactPhone: '',
    form: '',
    whatsappLink: '',
    isPaidEvent: false,
    paymentQRCode: '',
    paymentAmount: 0,
    maxParticipants: '',
    customQuestions: [],
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lockedUniversity, setLockedUniversity] = useState<string>('');
  const [clubName, setClubName] = useState<string>('');
  const [eventCount, setEventCount] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<{
    name: string;
    count: number;
    description: string;
  } | null>(null);
  const [closeAfterAchievement, setCloseAfterAchievement] = useState(false);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) setToken(tok);
    else {
      toast('Login required', {
        action: {
          label: 'Sign in',
          onClick: () => router.push('/auth/signin'),
        },
      });
      setIsModalOpen(true);
      return;
    }
    const session = sessionStorage.getItem('activeSession');
    if (!session) {
      setIsModalOpen(true);
      return;
    }
  }, []);

  // --- Custom Questions Handlers ---
  const addCustomQuestion = () => {
    if ((formData.customQuestions?.length || 0) >= 10) {
      toast.error('Maximum 10 custom questions allowed.');
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      customQuestions: [
        ...(prev.customQuestions || []),
        {
          id: Date.now().toString(),
          label: '',
          type: 'text',
          required: false,
          options: [],
        },
      ],
    }));
  };

  const removeCustomQuestion = (index: number) => {
    setFormData((prev: any) => {
      const newQs = [...(prev.customQuestions || [])];
      newQs.splice(index, 1);
      return { ...prev, customQuestions: newQs };
    });
  };

  const updateCustomQuestion = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newQs = [...(prev.customQuestions || [])];
      newQs[index] = { ...newQs[index], [field]: value };
      return { ...prev, customQuestions: newQs };
    });
  };

  const addPrebuiltQuestion = (
    label: string,
    type: 'text' | 'select' | 'url',
    options: string[] = []
  ) => {
    if ((formData.customQuestions?.length || 0) >= 10) {
      toast.error('Maximum 10 custom questions allowed.');
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      customQuestions: [
        ...(prev.customQuestions || []),
        { id: Date.now().toString(), label, type, required: false, options },
      ],
    }));
  };
  // ---------------------------------

  // Auto-fill and lock university to the founder's collegeName
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const res = await axios.get<{
          user: { collegeName: string; clubName: string };
        }>(`/api/v1/user/getUser`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const collegeName = res.data?.user?.collegeName || '';
        if (collegeName) {
          setLockedUniversity(collegeName);
          setFormData((prev: any) => ({ ...prev, university: collegeName }));
        }
        const clubName = res?.data?.user?.clubName || '';
        if (clubName) {
          setClubName(clubName);
        }

        // Fetch event count for this founder
        try {
          const eventRes = await axios.get<{ count: number }>(
            `/api/v1/events/founder-event-count`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          setEventCount(eventRes.data?.count || 0);
        } catch (e) {
          console.log('Could not fetch event count');
        }
      } catch (e) {
        // ignore; backend will still validate
      }
    };
    fetchUser();
  }, [token]);

  // Memoized handler for input changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev: any) => {
        const updated = { ...prev, [name]: value };

        // Validate dates in real-time
        const newErrors: Record<string, string> = { ...errors };

        // Validate event end date vs start date
        if (name === 'eventStartDate' || name === 'eventEndDate') {
          if (updated.eventStartDate && updated.eventEndDate) {
            const startDate = new Date(updated.eventStartDate);
            const endDate = new Date(updated.eventEndDate);
            if (endDate < startDate) {
              newErrors.eventEndDate = 'End date cannot be before start date';
            } else {
              delete newErrors.eventEndDate;
            }
          }
        }

        // Validate application end date vs start date
        if (name === 'applicationStartDate' || name === 'applicationEndDate') {
          if (updated.applicationStartDate && updated.applicationEndDate) {
            const appStartDate = new Date(updated.applicationStartDate);
            const appEndDate = new Date(updated.applicationEndDate);
            if (appEndDate < appStartDate) {
              newErrors.applicationEndDate =
                'Application end date cannot be before start date';
            } else {
              delete newErrors.applicationEndDate;
            }
          }
        }

        // Clear error when field is edited (only if validation passes)
        if (newErrors[name]) {
          delete newErrors[name];
        }

        setErrors(newErrors);
        return updated;
      });
    },
    [errors]
  );

  // Memoized handler for checkbox changes
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    },
    []
  );

  // Handle file upload with compression under 2MB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxBytes = 2 * 1024 * 1024;
      let processed = file;
      if (file.size > maxBytes) {
        processed = await compressImageToUnder2MB(file);
        if (processed.size > maxBytes) {
          toast('Could not compress image under 2 MB. Try a smaller image.');
          return;
        }
      }
      setImg(processed);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(processed);
      e.currentTarget.value = '';
    }
  };

  // Handle QR code file upload
  const handleQRCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxBytes = 2 * 1024 * 1024;
      let processed = file;
      if (file.size > maxBytes) {
        processed = await compressImageToUnder2MB(file);
        if (processed.size > maxBytes) {
          toast(
            'Could not compress QR code image under 2 MB. Try a smaller image.'
          );
          return;
        }
      }
      setQrCodeImg(processed);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setQrCodePreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(processed);
      e.currentTarget.value = '';
    }
  };

  // Validate form based on current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false;

    switch (step) {
      case 1:
        if (!formData.eventMode) newErrors.eventMode = 'Event mode is required';
        if (!formData.eventName?.trim())
          newErrors.eventName = 'Event name is required';
        if (!formData.university)
          newErrors.university = 'University is required';
        if (!formData.description?.trim())
          newErrors.description = 'Description is required';
        if (!formData.eventType) newErrors.eventType = 'Event type is required';
        break;

      case 2:
        if (!formData.maxTeamSize)
          newErrors.maxTeamSize = 'Maximum team size is required';
        if (formData.eventMode !== 'online') {
          const normalizedVenue = formData.venue?.trim().toLowerCase();
          if (!normalizedVenue) {
            newErrors.venue = 'Venue is required';
          } else if (normalizedVenue === 'online') {
            newErrors.venue = 'Please enter a real event venue for offline or hybrid events';
          }
        }
        formData.customQuestions?.forEach((question, index) => {
          if (!question.label.trim()) {
            newErrors[`customQuestion.${index}.label`] =
              'Question label is required';
          }
          if (
            question.type === 'select' &&
            !question.options?.some((option) => option.trim())
          ) {
            newErrors[`customQuestion.${index}.options`] =
              'Add at least one option for dropdown questions';
          }
        });
        if (formData.isPaidEvent) {
          if (!qrCodeImg)
            newErrors.paymentQRCode = 'QR code is required for paid events';
          if (!formData.paymentAmount || formData.paymentAmount <= 0)
            newErrors.paymentAmount =
              'Payment amount is required and must be greater than 0';
        }
        break;

      case 3:
        if (!formData.eventStartDate)
          newErrors.eventStartDate = 'Event start date is required';
        if (!formData.eventEndDate)
          newErrors.eventEndDate = 'Event end date is required';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (formData.eventStartDate) {
          const startDate = new Date(formData.eventStartDate);
          if (startDate < today) {
            newErrors.eventStartDate = 'Event start date cannot be in the past';
          }
        }

        if (formData.applicationStartDate) {
          const appStartDate = new Date(formData.applicationStartDate);
          if (appStartDate < today) {
            newErrors.applicationStartDate =
              'Application start date cannot be in the past';
          }
        }

        if (formData.eventStartDate && formData.eventEndDate) {
          const startDate = new Date(formData.eventStartDate);
          const endDate = new Date(formData.eventEndDate);
          if (endDate < startDate) {
            newErrors.eventEndDate = 'End date cannot be before start date';
          }
        }

        if (formData.applicationStartDate && formData.applicationEndDate) {
          const appStartDate = new Date(formData.applicationStartDate);
          const appEndDate = new Date(formData.applicationEndDate);
          if (appEndDate < appStartDate) {
            newErrors.applicationEndDate =
              'Application end date cannot be before start date';
          }
        }

        if (!formData.contactEmail?.trim())
          newErrors.contactEmail = 'Contact email is required';
        if (!formData.contactPhone?.trim())
          newErrors.contactPhone = 'Contact phone is required';
        break;

      case 4:
        if (!img) {
          newErrors.image = 'Event image is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const notifyStepValidationErrors = useCallback(
    (currentStep: number) => {
      const stepFieldOrder: Record<number, string[]> = {
        1: ['eventMode', 'eventName', 'university', 'description', 'eventType'],
        2: ['maxTeamSize', 'venue', 'paymentQRCode', 'paymentAmount'],
        3: [
          'eventStartDate',
          'eventEndDate',
          'applicationStartDate',
          'applicationEndDate',
          'contactEmail',
          'contactPhone',
        ],
        4: ['image'],
      };

      const prioritizedMessages = (stepFieldOrder[currentStep] || [])
        .map((field) => errors[field])
        .filter(Boolean);

      const customQuestionMessages = Object.entries(errors)
        .filter(([key]) => key.startsWith('customQuestion.'))
        .map(([, message]) => message);

      const uniqueMessages = Array.from(
        new Set([...prioritizedMessages, ...customQuestionMessages].filter(Boolean))
      );

      if (uniqueMessages.length === 0) {
        toast.error('Please fill in the required fields before continuing.');
        return;
      }

      toast.error(
        `Please fill in the required fields: ${uniqueMessages.join(', ')}`
      );
    },
    [errors]
  );

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      notifyStepValidationErrors(step);
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!token) {
      toast('please login or signup');
      return;
    }
    if (!clubName) {
      toast("You haven't created any club yet. Please create a club first.");
      return;
    }
    if (!validateStep()) {
      notifyStepValidationErrors(step);
      return;
    }

    setIsSubmitting(true);

    try {
      const dateCheckRes = await axios.post(
        `/api/v1/events/checkEventDates`,
        {
          eventStartDate: formData.eventStartDate,
          eventEndDate: formData.eventEndDate,
          applicationStartDate: formData.applicationStartDate,
          applicationEndDate: formData.applicationEndDate,
        }
      );
      const {
        isValid,
        errors: dateErrors,
        warnings,
        existingEvents,
      } = dateCheckRes.data;

      if (!isValid && dateErrors?.length) {
        dateErrors.forEach((msg: string) => toast.error(msg));
        setIsSubmitting(false);
        return;
      }

      if (warnings?.length) {
        warnings.forEach((msg: string) => toast(msg, { duration: 5000 }));
      }

      if (existingEvents?.length) {
        toast(
          `${existingEvents.length} event(s) already scheduled in this period. Double-check your dates.`,
          { duration: 6000 }
        );
      }
    } catch {
      // Non-blocking: if the check endpoint fails, proceed with creation
    }

    let imageLink = '';
    if (!img) {
      toast('you are required to upload a poster');
      setIsSubmitting(false);
      return;
    } else {
      const maxBytes = 2 * 1024 * 1024;
      let toUpload = img;
      if (img.size > maxBytes) {
        toUpload = await compressImageToUnder2MB(img);
        if (toUpload.size > maxBytes) {
          toast('Could not compress image under 2 MB. Try a smaller image.');
          setIsSubmitting(false);
          return;
        }
      }
      imageLink = await uploadImageToImageKit(
        await toBase64(toUpload),
        toUpload.name,
        '/events'
      );
      toast('Image uploaded');
    }

    let qrCodeLink = '';
    if (formData.isPaidEvent && qrCodeImg) {
      const maxBytes = 2 * 1024 * 1024;
      let toUpload = qrCodeImg;
      if (qrCodeImg.size > maxBytes) {
        toUpload = await compressImageToUnder2MB(qrCodeImg);
        if (toUpload.size > maxBytes) {
          toast(
            'Could not compress QR code image under 2 MB. Try a smaller image.'
          );
          setIsSubmitting(false);
          return;
        }
      }
      qrCodeLink = await uploadImageToImageKit(
        await toBase64(toUpload),
        toUpload.name,
        '/payment-qr'
      );
      toast('Payment QR code uploaded');
    }

    const payload: any = {
      ...formData,
      image: imageLink,
    };

    if (
      payload.maxParticipants === '' ||
      payload.maxParticipants === 0 ||
      payload.maxParticipants === undefined ||
      payload.maxParticipants === null
    ) {
      payload.maxParticipants = null;
    } else {
      payload.maxParticipants = parseInt(
        payload.maxParticipants.toString(),
        10
      );
    }
    payload.maxTeamSize = parseInt(payload.maxTeamSize.toString(), 10);
    payload.customQuestions = (formData.customQuestions || [])
      .map((question, index) => ({
        ...question,
        label: question.label.trim(),
        options:
          question.type === 'select'
            ? (question.options || [])
                .map((option) => option.trim())
                .filter(Boolean)
            : [],
        sortOrder: index,
      }))
      .filter((question) => question.label);
    if (!payload.customQuestions.length) {
      delete payload.customQuestions;
    }

    if (formData.isPaidEvent) {
      payload.isPaid = true;
      payload.paymentQRCode = qrCodeLink;
      payload.paymentAmount = formData.paymentAmount;
    } else {
      payload.isPaid = false;
      delete payload.isPaidEvent;
      delete payload.paymentQRCode;
      delete payload.paymentAmount;
    }
    delete payload.isPaidEvent;

    const createEvent = await axios.post<{
      msg: string;
      id: string;
    }>(`/api/v1/events/event`, payload, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (createEvent.status === 201 || createEvent.status === 200) {
      posthog.capture('event_created', {
        event_type: formData.eventType,
        event_mode: formData.eventMode,
        is_paid: formData.isPaidEvent,
      });
      const previousCount = eventCount;
      const newCount = previousCount + 1;
      setEventCount(newCount);

      let badgeUnlocked = null;
      if (previousCount < 20 && newCount >= 20) {
        badgeUnlocked = {
          name: 'Community Champion',
          count: 20,
          description:
            "You've created 20 events! You're the ultimate community champion! 🌟",
        };
      } else if (previousCount < 10 && newCount >= 10) {
        badgeUnlocked = {
          name: 'Event Legendary',
          count: 10,
          description: "Wow! 10 events created! You're a true event legend! ⚡",
        };
      } else if (previousCount < 5 && newCount >= 5) {
        badgeUnlocked = {
          name: 'Event Master',
          count: 5,
          description: "You've created 5 amazing events! You're on fire! 🔥",
        };
      }

      if (badgeUnlocked) {
        setUnlockedBadge(badgeUnlocked);
        setShowAchievementModal(true);
        setCloseAfterAchievement(true);
      }

      toast('Event created successfully! Start marketing now!!!');
      setIsSubmitting(false);

      if (!badgeUnlocked) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } else {
      toast(createEvent.data.msg);
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!clubName) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-transparent">
        <Card className="flex min-h-full items-center justify-center p-4 bg-transparent shadow-none">
          <MagicCard className="group relative bg-gray-900 rounded-xl w-full max-w-md transition-all duration-300 hover:scale-[1.01] border border-transparent hover:border-transparent">
            <div className="absolute inset-0 rounded-xl -z-10 bg-gray-900" />

            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                No Club Found
              </h2>
              <p className="text-gray-300 mb-6">
                You haven't created any club yet. Please create a club first
                before creating an event.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    onClose();
                    router.push('/clubs');
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg"
                >
                  Create Club Now
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </MagicCard>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-transparent">
      <Card className="flex min-h-full items-center justify-center p-4 bg-transparent  shadow-none">
        <MagicCard className="group relative bg-gray-900 rounded-xl w-full max-w-3xl transition-all duration-300 hover:scale-[1.01] border border-transparent hover:border-transparent">
          <div className="absolute inset-0 rounded-xl -z-10 bg-gray-900" />

          {/* Gradient border effect */}
          <div
            className="absolute -z-10 inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(90deg, #ff5bff 0%, #ff3131 50%, #38ff4c 100%)',
              padding: '1px',
              maskImage:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
          />

          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Create New Event</h2>
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center">
              {(['Basics', 'Details', 'Timing', 'Media'] as const).map(
                (label, i) => {
                  const stepNum = i + 1;
                  const done = step > stepNum;
                  const active = step === stepNum;
                  return (
                    <React.Fragment key={stepNum}>
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                            done
                              ? 'bg-yellow-500 text-black'
                              : active
                                ? 'bg-yellow-500 text-black ring-4 ring-yellow-500/20'
                                : 'bg-gray-800 text-gray-500'
                          }`}
                        >
                          {done ? <Check className="w-4 h-4" /> : stepNum}
                        </div>
                        <span
                          className={`text-xs mt-1.5 font-medium ${active ? 'text-yellow-400' : done ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all ${step > stepNum ? 'bg-yellow-500' : 'bg-gray-800'}`}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              )}
            </div>
          </div>

          {/* Modal Body - Form Steps */}
          <form
            id="event-creation-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 4) handleSubmit();
            }}
            className="px-6 py-4 max-h-[60vh] overflow-y-auto scrollbar-hide"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-yellow-400">
                  Event Basics
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      Event Mode*
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Online', 'Offline', 'Hybrid'].map((mode) => (
                        <div
                          key={mode}
                          className={`
                            cursor-pointer border rounded-lg p-3 flex items-center justify-center
                            ${
                              formData.eventMode === mode.toLowerCase()
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                : 'border-gray-700 text-gray-300 hover:border-gray-600'
                            }
                          `}
                          onClick={() => {
                            const modeValue = mode.toLowerCase();
                            setFormData((prev: any) => ({
                              ...prev,
                              eventMode: modeValue,
                              venue:
                                modeValue === 'online'
                                  ? 'Online'
                                  : prev.venue?.trim().toLowerCase() === 'online'
                                    ? ''
                                    : prev.venue,
                            }));
                            if (errors.eventMode) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.eventMode;
                                delete newErrors.venue;
                                return newErrors;
                              });
                            }
                          }}
                        >
                          {mode}
                        </div>
                      ))}
                    </div>
                    {errors.eventMode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.eventMode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="eventName"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Event Name*
                    </label>
                    <input
                      id="eventName"
                      name="eventName"
                      type="text"
                      value={formData.eventName}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="Enter event name"
                    />
                    {errors.eventName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.eventName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tagline"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Tagline
                    </label>
                    <input
                      id="tagline"
                      name="tagline"
                      type="text"
                      value={formData.tagline}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="Enter a catchy tagline"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Description*
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="Describe your event"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="eventType"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Event Type/Theme*
                    </label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          eventType: value,
                        }));
                        if (errors.eventType) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.eventType;
                            return newErrors;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white">
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="others">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.eventType && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.eventType}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Participation Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-yellow-400">
                  Participation Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="maxTeamSize"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Maximum Team Size*
                    </label>
                    <input
                      id="maxTeamSize"
                      name="maxTeamSize"
                      type="number"
                      min="1"
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="1"
                    />
                    {errors.maxTeamSize && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.maxTeamSize}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="maxParticipants"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Maximum Number of Participants (Optional)
                    </label>
                    <input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="Uncapped limit"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Leave empty for unlimited participation.
                    </p>
                  </div>

                  {formData.eventMode !== 'online' && (
                    <div>
                      <Label
                        htmlFor="venue"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Venue*
                      </Label>
                      <Input
                        id="venue"
                        name="venue"
                        type="text"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                        placeholder="Event venue"
                      />
                      {errors.venue && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.venue}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Access & Participation toggles */}
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-3">
                      Access Restrictions
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* College students only */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            collegeStudentsOnly: !prev.collegeStudentsOnly,
                          }))
                        }
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          formData.collegeStudentsOnly
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${formData.collegeStudentsOnly ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}
                        >
                          {formData.collegeStudentsOnly && (
                            <Check className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${formData.collegeStudentsOnly ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            College students only
                          </p>
                          <p className="text-xs text-gray-500">
                            Restrict to your college
                          </p>
                        </div>
                      </button>

                      {/* Core team only */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            coreTeamOnly: !prev.coreTeamOnly,
                          }))
                        }
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          formData.coreTeamOnly
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${formData.coreTeamOnly ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}
                        >
                          {formData.coreTeamOnly && (
                            <Check className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${formData.coreTeamOnly ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            Core team only
                          </p>
                          <p className="text-xs text-gray-500">
                            Internal club members
                          </p>
                        </div>
                      </button>

                      {/* Approval Required (Acceptance Based) */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            acceptanceBased: !prev.acceptanceBased,
                          }))
                        }
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          formData.acceptanceBased
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${formData.acceptanceBased ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}
                        >
                          {formData.acceptanceBased && (
                            <Check className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${formData.acceptanceBased ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            Approval Required
                          </p>
                          <p className="text-xs text-gray-500">
                            Manually accept participants
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="eventWebsite"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      {formData.eventMode === 'online'
                        ? 'Platform Link (e.g. Google Meet, Zoom)'
                        : 'Event Website (optional)'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="eventWebsite"
                        name="eventWebsite"
                        type="url"
                        value={formData.eventWebsite}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="form"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Registration/Application Form (optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="form"
                        name="form"
                        type="url"
                        value={formData.form || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        placeholder="https://forms.google.com/... or https://typeform.com/..."
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Add a link to your registration form (Google Forms,
                      Typeform, etc.)
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="whatsappLink"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      WhatsApp Group Link (optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="whatsappLink"
                        name="whatsappLink"
                        type="url"
                        value={formData.whatsappLink || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        placeholder="https://chat.whatsapp.com/..."
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Share WhatsApp group link with registered participants
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-yellow-400">
                          Registration Questions (Optional)
                        </p>
                        <p className="text-xs text-gray-400">
                          Ask participants for extra details during
                          registration.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={addCustomQuestion}
                        className="bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Question
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('GitHub profile', 'url')
                        }
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-yellow-400 border border-gray-700"
                      >
                        GitHub profile
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('Portfolio / LinkedIn', 'url')
                        }
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-yellow-400 border border-gray-700"
                      >
                        Portfolio / LinkedIn
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('Experience level', 'select', [
                            'Beginner',
                            'Intermediate',
                            'Advanced',
                          ])
                        }
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-yellow-400 border border-gray-700"
                      >
                        Experience level
                      </button>
                    </div>

                    {(formData.customQuestions || []).length > 0 && (
                      <div className="space-y-3">
                        {formData.customQuestions?.map((question, index) => (
                          <div
                            key={question.id || index}
                            className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <GripVertical className="w-4 h-4" />
                                Question {index + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeCustomQuestion(index)}
                                className="text-red-400 hover:text-red-300"
                                aria-label="Remove custom question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div>
                              <Label
                                htmlFor={`custom-question-${index}`}
                                className="block text-sm font-medium text-yellow-400 mb-1"
                              >
                                Question Label*
                              </Label>
                              <Input
                                id={`custom-question-${index}`}
                                value={question.label}
                                onChange={(e) =>
                                  updateCustomQuestion(
                                    index,
                                    'label',
                                    e.target.value
                                  )
                                }
                                className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white"
                                placeholder="What do you want to ask?"
                              />
                              {errors[`customQuestion.${index}.label`] && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors[`customQuestion.${index}.label`]}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <Label className="block text-sm font-medium text-yellow-400 mb-1">
                                  Answer Type
                                </Label>
                                <Select
                                  value={question.type}
                                  onValueChange={(
                                    value: 'text' | 'select' | 'url'
                                  ) =>
                                    updateCustomQuestion(index, 'type', value)
                                  }
                                >
                                  <SelectTrigger className="bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white">
                                    <SelectValue placeholder="Select answer type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black text-white">
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="url">URL</SelectItem>
                                    <SelectItem value="select">
                                      Dropdown
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateCustomQuestion(
                                    index,
                                    'required',
                                    !question.required
                                  )
                                }
                                className={`mt-6 flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                                  question.required
                                    ? 'border-yellow-500 bg-yellow-500/10'
                                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${question.required ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}
                                >
                                  {question.required && (
                                    <Check className="w-3 h-3 text-black" />
                                  )}
                                </div>
                                <span className="text-sm text-gray-300">
                                  Required
                                </span>
                              </button>
                            </div>

                            {question.type === 'select' && (
                              <div>
                                <Label
                                  htmlFor={`custom-question-options-${index}`}
                                  className="block text-sm font-medium text-yellow-400 mb-1"
                                >
                                  Dropdown Options*
                                </Label>
                                <Input
                                  id={`custom-question-options-${index}`}
                                  value={(question.options || []).join(', ')}
                                  onChange={(e) =>
                                    updateCustomQuestion(
                                      index,
                                      'options',
                                      e.target.value
                                        .split(',')
                                        .map((option) => option.trim())
                                    )
                                  }
                                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white"
                                  placeholder="Beginner, Intermediate, Advanced"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                  Separate options with commas.
                                </p>
                                {errors[`customQuestion.${index}.options`] && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors[`customQuestion.${index}.options`]}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fee — single Free / Paid selector */}
                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-sm font-medium text-yellow-400 mb-3">
                      Participation Fee
                    </p>
                    <div className="flex rounded-lg bg-gray-800 p-1 gap-1 mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            isPaidEvent: false,
                            noParticipationFee: true,
                            paymentAmount: 0,
                          }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                          !formData.isPaidEvent
                            ? 'bg-yellow-500 text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            isPaidEvent: true,
                            noParticipationFee: false,
                          }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                          formData.isPaidEvent
                            ? 'bg-yellow-500 text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Paid
                      </button>
                    </div>

                    {formData.isPaidEvent && (
                      <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg border border-yellow-500/20">
                        <div>
                          <label
                            htmlFor="paymentAmount"
                            className="block text-sm font-medium text-yellow-400 mb-1"
                          >
                            Registration Fee (₹)*
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                              ₹
                            </span>
                            <input
                              id="paymentAmount"
                              name="paymentAmount"
                              type="number"
                              min="1"
                              step="1"
                              value={formData.paymentAmount || ''}
                              onChange={handleChange}
                              className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white pl-7 pr-4 py-2.5 rounded-lg focus:outline-none"
                              placeholder="e.g. 500"
                            />
                          </div>
                          {errors.paymentAmount && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.paymentAmount}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-yellow-400 mb-2">
                            Payment QR Code*
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            id="qrCodeUpload"
                            className="hidden"
                            onChange={handleQRCodeChange}
                          />
                          {qrCodePreviewUrl ? (
                            <div className="flex items-center gap-4">
                              <div className="relative w-28 h-28 shrink-0">
                                <Image
                                  src={qrCodePreviewUrl}
                                  alt="QR Code Preview"
                                  fill
                                  className="rounded-lg object-cover border border-gray-700"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-300">
                                  QR code uploaded
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQrCodeImg(null);
                                    setQrCodePreviewUrl('');
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="qrCodeUpload"
                              className="cursor-pointer block"
                            >
                              <div className="w-full bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-5 hover:border-yellow-500 transition-colors flex flex-col items-center justify-center gap-1.5">
                                <Upload className="w-7 h-7 text-gray-400" />
                                <span className="text-sm text-gray-400">
                                  Click to upload QR code
                                </span>
                                <span className="text-xs text-gray-600">
                                  Max 2 MB · PNG, JPG
                                </span>
                              </div>
                            </label>
                          )}
                          {errors.paymentQRCode && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.paymentQRCode}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Registration Questions */}
                  <div className="border-t border-gray-800 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm font-medium text-yellow-400">
                          Custom Registration Questions
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Ask participants for specific details (Max 10)
                        </p>
                      </div>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        {formData.customQuestions?.length || 0}/10 Added
                      </span>
                    </div>

                    {/* Pre-built Questions */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('GitHub Profile URL', 'url')
                        }
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-gray-700"
                      >
                        <Plus className="w-3 h-3" /> GitHub
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('LinkedIn Profile', 'url')
                        }
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-gray-700"
                      >
                        <Plus className="w-3 h-3" /> LinkedIn
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('T-Shirt Size', 'select', [
                            'S',
                            'M',
                            'L',
                            'XL',
                            'XXL',
                          ])
                        }
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-gray-700"
                      >
                        <Plus className="w-3 h-3" /> T-Shirt Size
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addPrebuiltQuestion('Food Preference', 'select', [
                            'Veg',
                            'Non-Veg',
                            'Vegan',
                          ])
                        }
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-gray-700"
                      >
                        <Plus className="w-3 h-3" /> Food Pref
                      </button>
                    </div>

                    <div className="space-y-4 mb-4">
                      {formData.customQuestions?.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          className="bg-gray-800/40 border border-gray-700 p-4 rounded-lg relative group"
                        >
                          <button
                            type="button"
                            onClick={() => removeCustomQuestion(idx)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-start gap-3">
                            <GripVertical className="w-5 h-5 text-gray-600 mt-2 cursor-grab" />
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Question Label*
                                  </label>
                                  <input
                                    type="text"
                                    value={q.label}
                                    onChange={(e) =>
                                      updateCustomQuestion(
                                        idx,
                                        'label',
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. What is your GitHub ID?"
                                    className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white px-3 py-1.5 rounded text-sm focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Answer Type
                                  </label>
                                  <Select
                                    value={q.type}
                                    onValueChange={(val) =>
                                      updateCustomQuestion(idx, 'type', val)
                                    }
                                  >
                                    <SelectTrigger className="bg-gray-900 border border-gray-700 text-white h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black text-white">
                                      <SelectItem value="text">
                                        Short Text
                                      </SelectItem>
                                      <SelectItem value="url">
                                        URL / Link
                                      </SelectItem>
                                      <SelectItem value="select">
                                        Dropdown Options
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              {q.type === 'select' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Options (comma separated)*
                                  </label>
                                  <input
                                    type="text"
                                    value={q.options?.join(', ')}
                                    onChange={(e) =>
                                      updateCustomQuestion(
                                        idx,
                                        'options',
                                        e.target.value
                                          .split(',')
                                          .map((o) => o.trim())
                                          .filter(Boolean)
                                      )
                                    }
                                    placeholder="e.g. S, M, L, XL"
                                    className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white px-3 py-1.5 rounded text-sm focus:outline-none"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="checkbox"
                                  id={`req-${idx}`}
                                  checked={q.required}
                                  onChange={(e) =>
                                    updateCustomQuestion(
                                      idx,
                                      'required',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900"
                                />
                                <label
                                  htmlFor={`req-${idx}`}
                                  className="text-xs text-gray-300 cursor-pointer"
                                >
                                  Make this question required
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addCustomQuestion}
                      disabled={(formData.customQuestions?.length || 0) >= 10}
                      className="w-full py-2.5 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" /> Add Custom Question
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Timing & Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-yellow-400">
                  Event Timeline & Contact
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="eventStartDate"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Event Start Date*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="eventStartDate"
                          name="eventStartDate"
                          type="date"
                          value={formData.eventStartDate}
                          onChange={handleChange}
                          min={getTodayDateString()}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        />
                      </div>
                      {errors.eventStartDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.eventStartDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="eventEndDate"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Event End Date*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="size-5 text-gray-400" />
                        </div>
                        <input
                          id="eventEndDate"
                          name="eventEndDate"
                          type="date"
                          value={formData.eventEndDate}
                          onChange={handleChange}
                          min={formData.eventStartDate || undefined}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        />
                      </div>
                      {errors.eventEndDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.eventEndDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="applicationStartDate"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Application Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="applicationStartDate"
                          name="applicationStartDate"
                          type="date"
                          value={formData.applicationStartDate}
                          onChange={handleChange}
                          min={getTodayDateString()}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        />
                      </div>
                      {errors.applicationStartDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.applicationStartDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="applicationEndDate"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Application End Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="applicationEndDate"
                          name="applicationEndDate"
                          type="date"
                          value={formData.applicationEndDate}
                          onChange={handleChange}
                          min={formData.applicationStartDate || undefined}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        />
                      </div>
                      {errors.applicationEndDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.applicationEndDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="prizes"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Event Prizes (if any)
                    </label>
                    <Textarea
                      id="prizes"
                      name="prizes"
                      rows={3}
                      value={formData.prizes}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                      placeholder="Describe prizes and rewards"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Contact Email*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                          placeholder="contact@example.com"
                        />
                      </div>
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.contactEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-yellow-400 mb-1"
                      >
                        Contact Phone*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="size-5 text-gray-400" />
                        </div>
                        <input
                          id="contactPhone"
                          name="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                          placeholder="+91 1234567890"
                        />
                      </div>
                      {errors.contactPhone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.contactPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Media & Review */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-yellow-400">
                  Event Media & Final Review
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-1">
                      Event Image*
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-yellow-500/50 transition-colors">
                      {previewUrl ? (
                        <div className="relative">
                          <Image
                            src={previewUrl}
                            alt="Event preview"
                            width={300}
                            height={200}
                            className="mx-auto h-48 object-cover rounded-lg"
                          />
                          <Button
                            onClick={() => {
                              setPreviewUrl('');
                              setFormData((prev: any) => ({
                                ...prev,
                                image: null,
                              }));
                            }}
                            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-red-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center py-6 cursor-pointer"
                          onClick={() =>
                            document.getElementById('event-image')?.click()
                          }
                        >
                          <Upload className="size-10 text-gray-400 mb-3" />
                          <p className="text-gray-400 mb-1">
                            Drag and drop an image, or{' '}
                            <span className="text-yellow-400">browse</span>
                          </p>
                          <p className="text-gray-500 text-sm">
                            Recommended: 1200 x 600px, JPEG or PNG
                          </p>
                        </div>
                      )}
                      <input
                        id="event-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Event Summary Card */}
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden mt-2">
                    <div className="px-5 py-4 border-b border-gray-700">
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {formData.eventName || 'Untitled Event'}
                      </h4>
                      {formData.tagline && (
                        <p className="text-sm text-yellow-400/80 mt-0.5">
                          {formData.tagline}
                        </p>
                      )}
                      {formData.description && (
                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                          {formData.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-gray-700">
                      {[
                        {
                          label: 'Mode',
                          value: formData.eventMode
                            ? formData.eventMode.charAt(0).toUpperCase() +
                              formData.eventMode.slice(1)
                            : '—',
                        },
                        {
                          label: 'Type',
                          value: formData.eventType
                            ? formData.eventType.charAt(0).toUpperCase() +
                              formData.eventType.slice(1)
                            : '—',
                        },
                        {
                          label: 'Team size',
                          value: formData.maxTeamSize
                            ? `Up to ${formData.maxTeamSize}`
                            : '—',
                        },
                        {
                          label: 'Max participants',
                          value: formData.maxParticipants
                            ? String(formData.maxParticipants)
                            : 'Unlimited',
                        },
                        {
                          label: 'Start date',
                          value: formData.eventStartDate || '—',
                        },
                        {
                          label: 'End date',
                          value: formData.eventEndDate || '—',
                        },
                        { label: 'Venue', value: formData.venue || '—' },
                        {
                          label: 'Fee',
                          value: formData.isPaidEvent
                            ? `₹${formData.paymentAmount || '?'}`
                            : 'Free',
                        },
                        {
                          label: 'Contact email',
                          value: formData.contactEmail || '—',
                        },
                        {
                          label: 'Contact phone',
                          value: formData.contactPhone || '—',
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-800/80 px-4 py-3">
                          <p className="text-xs text-gray-500 mb-0.5">
                            {label}
                          </p>
                          <p className="text-sm text-white truncate">{value}</p>
                        </div>
                      ))}
                    </div>

                    {(formData.collegeStudentsOnly ||
                      formData.coreTeamOnly ||
                      formData.acceptanceBased) && (
                      <div className="px-5 py-3 border-t border-gray-700 flex gap-2 flex-wrap">
                        {formData.collegeStudentsOnly && (
                          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            College students only
                          </span>
                        )}
                        {formData.coreTeamOnly && (
                          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            Core team only
                          </span>
                        )}
                        {formData.acceptanceBased && (
                          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            Approval Required
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-400 text-sm">
                    Review all details carefully. Once submitted your event goes
                    live immediately.
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-yellow-500/30 p-4 flex justify-between">
            {step > 1 ? (
              <Button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onClose}
                className="my-2 mx-2 px-3 rounded-3xl border border-gray-700  text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
              >
                Cancel
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors flex items-center"
              >
                Zync It
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                form="event-creation-form"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            )}
          </div>
        </MagicCard>
      </Card>

      {/* Achievement Unlock Modal */}
      {unlockedBadge && (
        <AchievementUnlockModal
          isOpen={showAchievementModal}
          onClose={() => {
            setShowAchievementModal(false);
            setUnlockedBadge(null);
            if (closeAfterAchievement) {
              setCloseAfterAchievement(false);
              onClose();
            }
          }}
          badgeName={unlockedBadge.name}
          achievementCount={unlockedBadge.count}
          description={unlockedBadge.description}
          shareText={`🏆 I just unlocked the "${unlockedBadge.name}" badge on Zynvo! I've created ${unlockedBadge.count} amazing events. Join me and let's build an incredible campus community! 🎉 #Zynvo #EventCreator`}
        />
      )}

      <NoTokenModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default CreateEventModal;
