'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const OTHER_LABEL = 'Other';

interface CollegeSearchSelectProps {
  colleges: { college: string; State: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

type Option =
  | { kind: 'listed'; name: string }
  | { kind: 'community'; name: string }
  | { kind: 'other' };

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * College names other students typed via "Other" (GET /api/v1/user/colleges).
 * Fails quietly (e.g. backend without the endpoint) — suggestions are optional.
 */
function useCollegeSuggestions(query: string): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/user/colleges?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return setSuggestions([]);
        const data = await res.json();
        setSuggestions(Array.isArray(data?.colleges) ? data.colleges : []);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);
  return suggestions;
}

export default function CollegeSearchSelect({
  colleges,
  value,
  onChange,
  placeholder = 'Select your college/university',
  required = false,
}: CollegeSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOther, setIsOther] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const listedColleges = colleges.filter(
    (college) => college.college.toLowerCase() !== 'other'
  );
  const listedKeys = new Set(listedColleges.map((c) => norm(c.college)));

  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const inList = listedColleges.some((college) => college.college === trimmed);
    setIsOther(!inList);
  }, [value, colleges]);

  // Suggestions follow whatever the user is typing: the search box while the
  // dropdown is open, otherwise the custom "Other" input.
  const suggestions = useCollegeSuggestions(isOpen ? searchTerm : isOther ? value : '');
  const communityColleges = suggestions.filter((name) => !listedKeys.has(norm(name)));

  const listedMatches = listedColleges.filter((college) =>
    college.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Listed matches, then names other students entered, then Other (always last)
  const options: Option[] = [
    ...listedMatches.map((c) => ({ kind: 'listed' as const, name: c.college })),
    ...communityColleges.map((name) => ({ kind: 'community' as const, name })),
    { kind: 'other' },
  ];

  const close = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (option.kind === 'other') {
      // Keep what was typed in the search box so it needn't be retyped.
      const typed = searchTerm.replace(/\s+/g, ' ').trim();
      setIsOther(true);
      onChange(typed);
      close();
      setTimeout(() => customInputRef.current?.focus(), 0);
      return;
    }
    // A name another student entered is a custom ("Other") college too.
    setIsOther(option.kind === 'community');
    onChange(option.name);
    close();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        close();
        break;
    }
  };

  const handleInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setSearchTerm('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCustomBlur = () => {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    if (trimmed !== value) onChange(trimmed);
  };

  // In the custom box: existing spellings that differ from what was typed.
  const customSuggestions = isOther
    ? suggestions.filter((name) => norm(name) !== norm(value)).slice(0, 5)
    : [];

  const firstCommunityIndex = listedMatches.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Display Input */}
      <div
        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus-within:ring-2 focus-within:ring-yellow-500 cursor-pointer relative"
        onClick={handleInputClick}
      >
        <FiSearch className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : isOther ? OTHER_LABEL : value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white w-full outline-none cursor-pointer"
          placeholder={(!isOpen && isOther ? OTHER_LABEL : value) || placeholder}
          readOnly={!isOpen}
          required={required && !isOther}
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck={false}
        />
        <FiChevronDown
          className={`text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-overlay">
          {options.length === 1 && (
            <div className="px-4 py-2 text-xs text-gray-400">
              No matches — choose Other to use what you typed
            </div>
          )}
          {options.map((option, index) => {
            const label = option.kind === 'other' ? OTHER_LABEL : option.name;
            return (
              <React.Fragment key={`${option.kind}-${label}-${index}`}>
                {option.kind === 'community' && index === firstCommunityIndex && (
                  <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wide text-gray-500 border-t border-gray-700">
                    Entered by other students
                  </div>
                )}
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    option.kind === 'other' ? 'border-t border-gray-700' : ''
                  } ${
                    index === highlightedIndex
                      ? 'bg-yellow-500 text-black'
                      : 'text-white hover:bg-gray-700'
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {label}
                  {option.kind === 'other' && (
                    <span className="block text-xs opacity-70">
                      {searchTerm.trim()
                        ? `College not listed? Use "${searchTerm.trim()}"`
                        : 'College not listed? Type it after selecting'}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {isOther && (
        <div className="mt-2 space-y-1">
          <input
            ref={customInputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleCustomBlur}
            className="bg-gray-800 text-white w-full py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter your college/university name"
            required={required}
            autoComplete="off"
            minLength={2}
            maxLength={200}
          />
          {customSuggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                Other students at your college may have used one of these. Pick it so you can join their clubs:
              </p>
              <div className="flex flex-wrap gap-2">
                {customSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    // mousedown so the input's blur doesn't swallow the click
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(name);
                    }}
                    className="px-3 py-1 rounded-full text-xs bg-gray-700 text-gray-100 hover:bg-yellow-500 hover:text-black transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400">
            Type your full college name. Do not leave this as &quot;Other&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
