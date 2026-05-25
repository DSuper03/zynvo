'use client';

import { Loader2, Plus, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ScheduleTimeRangePicker } from './ScheduleTimeRangePicker';

export type SessionFormData = {
  time: string;
  title: string;
  description: string;
  location: string;
  speakers: string;
};

type Props = {
  isOpen: boolean;
  isSubmitting: boolean;
  formData: SessionFormData;
  activeDayLabel?: string;
  onOpen: () => void;
  onClose: () => void;
  onChange: (data: SessionFormData) => void;
  onSubmit: () => void;
  className?: string;
};

export function AddSessionPanel({
  isOpen,
  isSubmitting,
  formData,
  activeDayLabel,
  onOpen,
  onClose,
  onChange,
  onSubmit,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-800 bg-[#0B0B0B] overflow-hidden',
        className
      )}
    >
      <div className="border-b border-gray-800/80 bg-gradient-to-r from-yellow-400/10 via-transparent to-transparent px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400/80">
              <Sparkles className="h-3 w-3" />
              Founder tools
            </div>
            <h2 className="text-xl font-bold text-white">
              {isOpen ? 'Add new session' : 'Manage sessions'}
            </h2>
            {activeDayLabel && (
              <p className="mt-1 text-sm text-gray-400">Adding to {activeDayLabel}</p>
            )}
          </div>
          {isOpen && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {!isOpen ? (
          <Button
            onClick={onOpen}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 py-6 text-base font-bold text-black hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/10"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add session
          </Button>
        ) : (
          <div className="space-y-5">
            <Field label="Time" required hint="Pick start and end times for this session">
              <ScheduleTimeRangePicker
                value={formData.time}
                onChange={(time) => onChange({ ...formData, time })}
              />
            </Field>

            <Field label="Location" required hint="Room or venue">
              <Input
                value={formData.location}
                onChange={(e) => onChange({ ...formData, location: e.target.value })}
                placeholder="Main Hall"
                className="border-gray-700 bg-gray-900/80 text-white placeholder:text-gray-600"
              />
            </Field>

            <Field label="Session title" required>
              <Input
                value={formData.title}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
                placeholder="Opening keynote"
                className="border-gray-700 bg-gray-900/80 text-white placeholder:text-gray-600"
              />
            </Field>

            <Field label="Description" hint="Optional details for attendees">
              <Textarea
                value={formData.description}
                onChange={(e) => onChange({ ...formData, description: e.target.value })}
                placeholder="What attendees can expect from this session..."
                rows={3}
                className="border-gray-700 bg-gray-900/80 text-white placeholder:text-gray-600 resize-none"
              />
            </Field>

            <Field label="Speakers" hint="Comma-separated names">
              <Input
                value={formData.speakers}
                onChange={(e) => onChange({ ...formData, speakers: e.target.value })}
                placeholder="Jane Smith, John Doe"
                className="border-gray-700 bg-gray-900/80 text-white placeholder:text-gray-600"
              />
            </Field>

            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-base font-bold text-black hover:from-yellow-500 hover:to-amber-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding session...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save session
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-baseline gap-1 text-sm font-semibold text-yellow-400">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {hint && <p className="mb-2 text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  );
}
