'use client';

import { useEffect, useId, useRef, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import {
  MAX_EVENT_TAGS,
  MAX_TAG_LENGTH,
  addTags,
  normalizeTag,
} from '@/lib/eventTags';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  id?: string;
}

interface Suggestion {
  tag: string;
  count: number;
}

/**
 * Tag field for events: type and press Enter or comma to add, Backspace to
 * remove the last one, or tap a suggestion (popular tags matching what you
 * typed). Never submits the surrounding form on Enter.
 */
export default function TagInput({ value, onChange, id }: TagInputProps) {
  const inputId = useId();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const atLimit = value.length >= MAX_EVENT_TAGS;

  // Popular tags, narrowed by what's typed. Failing to load is fine: the field
  // still works without suggestions (also the case before the backend has tags).
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get<{ tags?: Suggestion[] }>(
          '/api/v1/events/tags',
          { params: { q: normalizeTag(text), limit: 12 }, timeout: 8000 }
        );
        if (!cancelled) setSuggestions(res.data?.tags ?? []);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text]);

  const commit = (raw: string) => {
    if (!raw.trim()) return;
    const result = addTags(value, raw);
    setError(result.error ?? null);
    if (result.tags.length !== value.length) onChange(result.tags);
    setText('');
  };

  const remove = (tag: string) => {
    setError(null);
    onChange(value.filter((t) => t !== tag));
    inputRef.current?.focus();
  };

  const shown = suggestions.filter((s) => !value.includes(s.tag)).slice(0, 8);

  return (
    <div>
      <div
        className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 focus-within:border-yellow-500"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-2.5 py-0.5 text-xs font-medium text-yellow-300"
          >
            #{tag}
            <button
              type="button"
              // keep focus in the input so a half-typed tag isn't committed by the blur
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              aria-label={`Remove tag ${tag}`}
              className="rounded-full p-0.5 hover:bg-yellow-400/25"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id ?? inputId}
          ref={inputRef}
          type="text"
          value={text}
          maxLength={80}
          disabled={atLimit}
          onChange={(e) => {
            // A comma commits what came before it, like Enter.
            const next = e.target.value;
            if (next.includes(',')) {
              commit(next);
            } else {
              setText(next);
              if (error) setError(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // don't submit the event form
              commit(text);
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => commit(text)}
          placeholder={
            atLimit
              ? `Maximum ${MAX_EVENT_TAGS} tags`
              : value.length
                ? 'Add another…'
                : 'e.g. hackathon, ai, beginner-friendly'
          }
          aria-describedby={`${inputId}-help`}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-400">
        Press Enter or comma to add. Up to {MAX_EVENT_TAGS} tags,{' '}
        {MAX_TAG_LENGTH} characters each. {value.length}/{MAX_EVENT_TAGS} used.
      </p>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}

      {!atLimit && shown.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Suggested tags">
          <span className="text-xs text-gray-500">Popular:</span>
          {shown.map((s) => (
            <button
              key={s.tag}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(s.tag)}
              className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300 transition-colors hover:border-yellow-500 hover:text-yellow-300"
            >
              #{s.tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
