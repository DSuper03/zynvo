'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CustomQuestion } from '@/types/global-Interface';
import {
  MAX_CUSTOM_QUESTIONS,
  moveQuestion,
  parseOptions,
} from '@/lib/customQuestions';

interface CustomQuestionsEditorProps {
  questions: CustomQuestion[];
  onChange: (questions: CustomQuestion[]) => void;
  /** People who already registered; changing questions affects their answers. */
  registrationCount?: number;
  /** True when the list differs from what is saved. */
  changed?: boolean;
  /** The organiser accepted that existing answers will be cleared. */
  acknowledged?: boolean;
  onAcknowledgeChange?: (value: boolean) => void;
  error?: string;
}

const newId = () => `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const PRESETS: {
  label: string;
  button: string;
  type: CustomQuestion['type'];
  options?: string[];
}[] = [
  { label: 'GitHub Profile URL', button: 'GitHub', type: 'url' },
  { label: 'LinkedIn Profile', button: 'LinkedIn', type: 'url' },
  {
    label: 'T-Shirt Size',
    button: 'T-Shirt Size',
    type: 'select',
    options: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    label: 'Food Preference',
    button: 'Food Pref',
    type: 'select',
    options: ['Veg', 'Non-Veg', 'Vegan'],
  },
];

/** Comma separated options. Keeps what you typed so "S, M" can be typed live. */
function OptionsInput({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const [text, setText] = useState(options.join(', '));
  return (
    <input
      type="text"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(parseOptions(e.target.value));
      }}
      placeholder="e.g. S, M, L, XL"
      className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white focus:border-yellow-500 focus:outline-none"
    />
  );
}

/**
 * Add, edit, reorder and remove the custom registration questions of an
 * event. Fully controlled: the parent owns the list.
 */
export default function CustomQuestionsEditor({
  questions,
  onChange,
  registrationCount = 0,
  changed = false,
  acknowledged = false,
  onAcknowledgeChange,
  error,
}: CustomQuestionsEditorProps) {
  const atMax = questions.length >= MAX_CUSTOM_QUESTIONS;

  const add = (question?: Partial<CustomQuestion>) => {
    if (atMax) {
      toast.error(`Maximum ${MAX_CUSTOM_QUESTIONS} custom questions allowed.`);
      return;
    }
    onChange([
      ...questions,
      {
        id: newId(),
        label: '',
        type: 'text',
        required: false,
        options: [],
        ...question,
      },
    ]);
  };

  const update = (index: number, patch: Partial<CustomQuestion>) =>
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const remove = (index: number) =>
    onChange(questions.filter((_, i) => i !== index));

  return (
    <div className="mt-6 border-t border-gray-800 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-400">
            Custom Registration Questions
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Ask participants for specific details (max {MAX_CUSTOM_QUESTIONS})
          </p>
        </div>
        <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">
          {questions.length}/{MAX_CUSTOM_QUESTIONS} added
        </span>
      </div>

      {registrationCount > 0 && (
        <div
          role="note"
          className="mb-4 flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
          <p>
            {registrationCount} {registrationCount === 1 ? 'person has' : 'people have'}{' '}
            already registered. Saving changes to these questions clears the
            answers they already gave. Edit them only if you don&apos;t need
            those answers (download the attendee list first if you do).
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() =>
              add({
                label: preset.label,
                type: preset.type,
                options: preset.options ?? [],
              })
            }
            className="flex items-center gap-1 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-700"
          >
            <Plus className="h-3 w-3" aria-hidden /> {preset.button}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-4">
        {questions.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-700 p-4 text-center text-xs text-gray-500">
            No custom questions. Participants only fill the standard form.
          </p>
        )}
        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="rounded-lg border border-gray-700 bg-gray-800/40 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-400">
                Question {idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Move question ${idx + 1} up`}
                  disabled={idx === 0}
                  onClick={() => onChange(moveQuestion(questions, idx, -1))}
                  className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Move question ${idx + 1} down`}
                  disabled={idx === questions.length - 1}
                  onClick={() => onChange(moveQuestion(questions, idx, 1))}
                  className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove question ${idx + 1}`}
                  onClick={() => remove(idx)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-700 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`q-label-${idx}`}
                    className="mb-1 block text-xs font-medium text-gray-400"
                  >
                    Question label*
                  </label>
                  <input
                    id={`q-label-${idx}`}
                    type="text"
                    value={q.label}
                    maxLength={200}
                    onChange={(e) => update(idx, { label: e.target.value })}
                    placeholder="e.g. What is your GitHub ID?"
                    className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="mb-1 block text-xs font-medium text-gray-400">
                    Answer type
                  </span>
                  <Select
                    value={q.type}
                    onValueChange={(val) =>
                      update(idx, { type: val as CustomQuestion['type'] })
                    }
                  >
                    <SelectTrigger className="h-8 border border-gray-700 bg-gray-900 text-sm text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="text">Short text</SelectItem>
                      <SelectItem value="url">URL / link</SelectItem>
                      <SelectItem value="select">Dropdown options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {q.type === 'select' && (
                <div>
                  <span className="mb-1 block text-xs font-medium text-gray-400">
                    Options (comma separated)*
                  </span>
                  <OptionsInput
                    options={q.options || []}
                    onChange={(options) => update(idx, { options })}
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) => update(idx, { required: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-yellow-500"
                />
                Make this question required
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => add()}
        disabled={atMax}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 py-2.5 text-sm font-medium text-gray-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/5 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add custom question
      </button>

      {registrationCount > 0 && changed && (
        <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-amber-100">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => onAcknowledgeChange?.(e.target.checked)}
            className="mt-0.5 rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-yellow-500"
          />
          I understand that saving these changes clears the answers the{' '}
          {registrationCount} existing {registrationCount === 1 ? 'registrant' : 'registrants'} already gave.
        </label>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
