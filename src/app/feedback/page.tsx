'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios'; // Add this missing import
import { Button } from '@/components/ui/button';

export default function FeedbackForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'enhancement',
    description: '',
    improvements: '',
  });
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      else {
        toast('login please');
        return;
      }
      if (sessionStorage.getItem('activeSession') != 'true') {
        toast('login please');
        return;
      }
    }
  }, []);

  const backgroundImage =
    'https://i.pinimg.com/736x/0a/8a/54/0a8a54b3aa265248460da6a0e9eb7179.jpg';
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Categories for selection
  const categories = [
    {
      id: 'enhancement',
      label: 'Enhancement',
      description: 'Improve an existing feature',
      icon: '⚡',
    },
    {
      id: 'bug-fix',
      label: 'Bug Fix',
      description: 'Report a bug or issue',
      icon: '🐞',
    },
    {
      id: 'new-feature',
      label: 'New Feature',
      description: 'Suggest a new feature',
      icon: '✨',
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other type of request',
      icon: '📝',
    },
  ];

  // Handle form input changes - Fix type
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle category selection - Fix type
  const handleCategorySelect = (category: string) => {
    setFormData({
      ...formData,
      category,
    });
  };

  // Navigate between steps
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission - Fix type and move token inside function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!token) {
        toast('login please');
        return;
      }

      // Format email data
      const emailData = {
        subject: `Feedback: ${formData.title}`,
        category: formData.category,
        description: formData.description,
        improvements: formData.improvements,
      };

      const feedback = await axios.post<{ msg: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contact/feedback`,
        emailData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (feedback.status === 200) {
        toast(feedback.data.msg);
        setSubmitted(true);
        setFormData({
          title: '',
          category: 'enhancement',
          description: '',
          improvements: '',
        });
        setCurrentStep(1);

        // Reset submitted state after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        toast(feedback.data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute h-1 bg-gray-700 w-full top-1/2 -translate-y-1/2"></div>
      {[1, 2, 3].map((step) => (
        <div key={step} className="relative z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step < currentStep
                ? 'bg-yellow-500 text-gray-900'
                : step === currentStep
                  ? 'bg-yellow-500 ring-4 ring-yellow-300/30 text-gray-900'
                  : 'bg-gray-800 text-gray-400'
            }`}
          >
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              step
            )}
          </div>
          <div
            className={`text-xs mt-2 absolute -left-8 w-24 text-center ${
              step === currentStep
                ? 'text-yellow-500 font-medium'
                : 'text-gray-500'
            }`}
          >
            {step === 1 ? 'Basics' : step === 2 ? 'Details' : 'Review'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-0"></div>

      {/* Main Container */}
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Yellow accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-yellow-500">Feed</span>back
          </h1>
          <p className="text-gray-400 mt-2">
            We value your input to make our product better
          </p>
        </div>

        {/* Form content based on step */}
        <div className="px-8 pb-8">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              {/* Progress tracker */}
              <ProgressBar />

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="peer w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-transparent transition-all"
                      required
                    />
                    <label
                      htmlFor="title"
                      className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-yellow-500"
                    >
                      Title
                    </label>
                    <p className="text-gray-500 text-xs mt-2 ml-1">
                      Briefly describe your feedback
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm text-gray-300">
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            formData.category === category.id
                              ? 'bg-yellow-500 bg-opacity-10 border border-yellow-500'
                              : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-3">
                              {category.icon}
                            </span>
                            <div>
                              <h3
                                className={`font-medium ${formData.category === category.id ? 'text-yellow-500' : 'text-white'}`}
                              >
                                {category.label}
                              </h3>
                              <p className="text-gray-400 text-xs mt-1">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
                    >
                      Continue
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder=" "
                      className="peer w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-transparent transition-all resize-none"
                      required
                    ></textarea>
                    <label
                      htmlFor="description"
                      className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-yellow-500"
                    >
                      Description
                    </label>
                    <p className="text-gray-500 text-xs mt-2 ml-1">
                      Please provide a detailed explanation
                    </p>
                  </div>

                  <div className="relative">
                    <textarea
                      id="improvements"
                      name="improvements"
                      value={formData.improvements}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder=" "
                      className="peer w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-transparent transition-all resize-none"
                    ></textarea>
                    <label
                      htmlFor="improvements"
                      className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-yellow-500"
                    >
                      Suggested Improvements
                    </label>
                    <p className="text-gray-500 text-xs mt-2 ml-1">
                      How can we make this better?
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="text-gray-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
                    >
                      Review
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Submit */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Title
                      </h3>
                      <p className="text-white mt-1">
                        {formData.title || '(Not provided)'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Category
                      </h3>
                      <p className="text-white mt-1 flex items-center">
                        <span className="mr-2">
                          {
                            categories.find((c) => c.id === formData.category)
                              ?.icon
                          }
                        </span>
                        {
                          categories.find((c) => c.id === formData.category)
                            ?.label
                        }
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Description
                      </h3>
                      <p className="text-white mt-1 whitespace-pre-line">
                        {formData.description || '(Not provided)'}
                      </p>
                    </div>

                    {formData.improvements && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">
                          Suggested Improvements
                        </h3>
                        <p className="text-white mt-1 whitespace-pre-line">
                          {formData.improvements}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex justify-between items-center">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="text-gray-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center ${
                        submitting
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/20'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-16 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900 bg-opacity-20 border-2 border-green-500 mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Thank You!</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Your feedback has been submitted successfully. We appreciate
                your input and will review it shortly.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-8 py-4 text-center text-gray-500 text-xs">
          Your feedback helps us build better products
        </div>
      </div>
    </div>
  );
}
