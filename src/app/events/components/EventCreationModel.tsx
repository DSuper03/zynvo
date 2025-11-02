'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  Calendar,
  Globe,
  MapPin,
  Upload,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
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
import { EventFormData } from '@/types/global-Interface';
import { toBase64, uploadImageToImageKit, compressImageToUnder2MB } from '@/lib/imgkit';
import { toast } from 'sonner';
import axios from 'axios';
import NoTokenModal from '@/components/modals/remindModal';
import { collegesWithClubs } from '@/components/colleges/college';
import { stringify } from 'querystring';
import { useRouter } from 'next/navigation';
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
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
    eventWebsite: '',
    eventStartDate: '',
    eventEndDate: '',
    applicationStartDate: '',
    applicationEndDate: '',
    prizes: '',
    contactEmail: '',
    contactPhone: '',
    form: '',
  });
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 const [lockedUniversity, setLockedUniversity] = useState<string>('');
 const [clubName, setClubName] = useState<string>('');
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

  // Auto-fill and lock university to the founder's collegeName
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const res = await axios.get<{ user: { collegeName: string , clubName: string} }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        const collegeName = res.data?.user?.collegeName || '';
        if (collegeName) {
          setLockedUniversity(collegeName);
          setFormData((prev: any) => ({ ...prev, university: collegeName }));
        }
        const clubName = res?.data?.user?.clubName || '';
        if (clubName) {
        setClubName(clubName);
         
        }
      } catch (e) {
        // ignore; backend will still validate
      }
    };
    fetchUser();
  }, [token]);

  // Memoized handler for input changes
  const handleChange = useCallback((
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
            newErrors.applicationEndDate = 'Application end date cannot be before start date';
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
  }, [errors]);

  // Memoized handler for checkbox changes
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  }, []);

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

  // Validate form based on current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (!formData) return false; // Add this check

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
        // Don't repeat step 1 validations here - only validate step 2 fields
        if (!formData.maxTeamSize)
          newErrors.maxTeamSize = 'Maximum team size is required';
        if (!formData.venue?.trim()) newErrors.venue = 'Venue is required';
        break;

      case 3:
        if (!formData.eventStartDate)
          newErrors.eventStartDate = 'Event start date is required';
        if (!formData.eventEndDate)
          newErrors.eventEndDate = 'Event end date is required';
        
        // Validate end date is not before start date
        if (formData.eventStartDate && formData.eventEndDate) {
          const startDate = new Date(formData.eventStartDate);
          const endDate = new Date(formData.eventEndDate);
          if (endDate < startDate) {
            newErrors.eventEndDate = 'End date cannot be before start date';
          }
        }
        
        // Validate application end date is not before application start date
        if (formData.applicationStartDate && formData.applicationEndDate) {
          const appStartDate = new Date(formData.applicationStartDate);
          const appEndDate = new Date(formData.applicationEndDate);
          if (appEndDate < appStartDate) {
            newErrors.applicationEndDate = 'Application end date cannot be before start date';
          }
        }
        
        if (!formData.contactEmail?.trim())
          newErrors.contactEmail = 'Contact email is required';
        if (!formData.contactPhone?.trim())
          newErrors.contactPhone = 'Contact phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Navigate to next step
  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!token) {
      toast('please login or signup');
      return;
    }
    if (!validateStep()) return;

    setIsSubmitting(true);
  const userUniAndClub = `${lockedUniversity}-${clubName}`;
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
      imageLink = await uploadImageToImageKit(await toBase64(toUpload), toUpload.name, '/events');
      toast('Image uploaded');
    }

    // Submit with the correct image link
    const createEvent = await axios.post<{
      msg: string;
      id: string;
    }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event`,
      { ...formData, image: imageLink },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (createEvent.status === 201 || createEvent.status === 200  ) {
      toast('Event registered , start marketing now!!!');
      setIsSubmitting(false);
      onClose();
    } else {
      toast(createEvent.data.msg);
      setIsSubmitting(false);
      onClose();
    }
  };
 
  if (!isOpen) return null;

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
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400'
                      }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-2 text-gray-400">
                    {stepNumber === 1 && 'Basics'}
                    {stepNumber === 2 && 'Details'}
                    {stepNumber === 3 && 'Timing'}
                    {stepNumber === 4 && 'Media'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Body - Form Steps */}
          <form id="event-creation-form" onSubmit={(e) => { e.preventDefault(); if (step === 4) handleSubmit(); }} className="px-6 py-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
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
                            ${formData.eventMode === mode.toLowerCase()
                              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                              : 'border-gray-700 text-gray-300 hover:border-gray-600'
                            }
                          `}
                          onClick={() => {
                            const modeValue = mode.toLowerCase();
                            setFormData((prev: any) => ({
                              ...prev,
                              eventMode: modeValue,
                              // If online, set venue to "Online"
                              venue: modeValue === 'online' ? 'Online' : prev.venue,
                            }));
                            if (errors.eventMode) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.eventMode;
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

                { /* <div>
                    <label
                      htmlFor="university"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      University/College* (locked to your club)
                    </label>
                    <input
                      id="university"
                      name="university"
                      type="text"
                      value={`${lockedUniversity}${clubName ? `-${clubName}` : ''}` || formData.university}
                      readOnly
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg opacity-80 cursor-not-allowed"
                    />
                    {errors.university && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.university}
                      </p>
                    )}
                  </div>
                  */}

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
                        <SelectItem value="other">Other</SelectItem>
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
                      disabled={formData.eventMode === 'online'}
                      className={`w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none ${
                        formData.eventMode === 'online' ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      placeholder={formData.eventMode === 'online' ? 'Online' : 'Event venue'}
                    />
                    {formData.eventMode === 'online' && (
                      <p className="mt-1 text-xs text-gray-400">
                        Venue is automatically set to "Online" for online events
                      </p>
                    )}
                    {errors.venue && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.venue}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      id="collegeStudentsOnly"
                      name="collegeStudentsOnly"
                      type="checkbox"
                      checked={formData.collegeStudentsOnly}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-700 text-yellow-600 focus:ring-yellow-600 bg-gray-800"
                    />
                    <Label
                      htmlFor="collegeStudentsOnly"
                      className="text-sm text-gray-300"
                    >
                      For college students only
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      id="noParticipationFee"
                      name="noParticipationFee"
                      type="checkbox"
                      checked={formData.noParticipationFee}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-700 text-yellow-600 focus:ring-yellow-600 bg-gray-800"
                    />
                    <Label
                      htmlFor="noParticipationFee"
                      className="text-sm text-gray-300"
                    >
                      No participation fee
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="coreTeamOnly"
                      name="coreTeamOnly"
                      type="checkbox"
                      checked={formData.coreTeamOnly}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-700 text-yellow-600 focus:ring-yellow-600 bg-gray-800"
                    />
                    <label
                      htmlFor="coreTeamOnly"
                      className="text-sm text-gray-300"
                    >
                      Allowed to core team only
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="eventWebsite"
                      className="block text-sm font-medium text-yellow-400 mb-1"
                    >
                      Event Website (optional)
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
                      Add a link to your registration form (Google Forms, Typeform, etc.)
                    </p>
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
                          className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                        />
                      </div>
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
                  <div className="bg-gray-800 rounded-lg overflow-hidden mt-6">
                    <div className="p-4">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {formData.eventName || 'Event Name'}
                      </h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Event University
                          </span>
                          <span className="capitalize">
                            {formData.university || 'Not specified'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-1">
                        {formData.tagline || 'Event tagline'}
                      </p>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {formData.description || 'Event description'}
                      </p>

                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Mode:
                          </span>
                          <span className="capitalize">
                            {formData.eventMode || 'Not specified'}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Team Size:
                          </span>
                          <span>{formData.maxTeamSize || 'Not specified'}</span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Dates:
                          </span>
                          <span>
                            {formData.eventStartDate || '--'} to{' '}
                            {formData.eventEndDate || '--'}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Fee:
                          </span>
                          <span>
                            {formData.noParticipationFee ? 'Free' : 'Paid'}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Venue:
                          </span>
                          <span>{formData.venue || 'Not specified'}</span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <span className="font-medium text-yellow-400 mr-2">
                            Contact:
                          </span>
                          <span>{formData.contactEmail || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400 text-sm">
                    <p>
                      Please review all details carefully before submitting.
                      Once submitted, your event will be visible to all users.
                    </p>
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
                className={`px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            )}
          </div>
        </MagicCard>
      </Card>
      <NoTokenModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default CreateEventModal;
