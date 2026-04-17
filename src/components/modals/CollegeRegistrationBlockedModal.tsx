'use client';

import { X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type CollegeBlockReason = 'mismatch' | 'unknown' | 'missing';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reason: CollegeBlockReason;
  /** Organizer / event college (from event listing) */
  organizerCollegeName: string;
  /** User's college from profile — shown for mismatch */
  userCollegeName?: string;
  onGoToProfile?: () => void;
};

export default function CollegeRegistrationBlockedModal({
  isOpen,
  onOpenChange,
  reason,
  organizerCollegeName,
  userCollegeName,
  onGoToProfile,
}: Props) {
  if (!isOpen) return null;

  const organizer =
    organizerCollegeName.trim() || 'the organizer college';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="college-block-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-yellow-500/40 bg-[#0f0f0f] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-500/15">
            <GraduationCap className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="college-block-title"
              className="text-lg font-semibold text-white"
            >
              {reason === 'missing'
                ? 'Add your college to register'
                : 'You cannot register for this event'}
            </h2>
            {reason === 'mismatch' && (
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                This event is for students of{' '}
                <span className="font-medium text-yellow-400">{organizer}</span>{' '}
                only. Your profile lists a different college
                {userCollegeName?.trim() ? (
                  <>
                    {' '}
                    (
                    <span className="text-gray-200">{userCollegeName.trim()}</span>
                    ).
                  </>
                ) : (
                  '.'
                )}
              </p>
            )}
            {reason === 'unknown' && (
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                This event is restricted to the organizer&apos;s college, but we
                couldn&apos;t verify the organizer college on this listing. Please
                contact the event organizer if you think this is a mistake.
              </p>
            )}
            {reason === 'missing' && (
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                The organizer limited registration to their college. Add your
                college to your Zynvo profile so we can check if you&apos;re
                eligible.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {reason === 'missing' && onGoToProfile && (
            <Button
              type="button"
              className="bg-yellow-500 text-black hover:bg-yellow-400"
              onClick={() => {
                onOpenChange(false);
                onGoToProfile();
              }}
            >
              Go to profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
