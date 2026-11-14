'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";

interface MemberSelectProps {
  members: any[];
  value: string;
  onChange: (email: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => Promise<any[]>;
  /** Offer the typed text as a choice when it is a valid email. */
  allowCustomEmail?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isEmpty = (v: string | null | undefined) => !v || v === 'none';

export default function MemberSelect({
  members,
  value,
  onChange,
  placeholder = 'Select a member',
  onSearch,
  allowCustomEmail = false,
}: MemberSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  // Remembers the picked search result: with onSearch, `members` may be empty.
  const [picked, setPicked] = useState<any | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    members.find((m: any) => m.email === value) ??
    (picked && picked.email === value ? picked : null);
  const label = selected
    ? selected.name
      ? `${selected.name} (${selected.email})`
      : selected.email
    : isEmpty(value)
      ? placeholder
      : value;

  // Only people with an email can be chosen (the value is an email).
  const displayMembers = (onSearch ? results : members).filter((m: any) => !!m?.email);

  const q = query.trim().toLowerCase();
  // Server search already matched the query; filter only local lists.
  const filtered = onSearch
    ? displayMembers
    : displayMembers.filter(
        (m: any) => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)
      );

  const customEmail =
    allowCustomEmail &&
    EMAIL_RE.test(q) &&
    !filtered.some((m: any) => m.email?.toLowerCase() === q)
      ? q
      : null;

  const choose = (member: any) => {
    setPicked(member);
    onChange(member.email);
    setOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (!onSearch || !query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await onSearch(query.trim());
        if (!cancelled) setResults(Array.isArray(res) ? res : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, onSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-black border border-yellow-500/40 text-left p-2 rounded-lg flex items-center justify-between gap-2"
      >
        <span className={`truncate ${isEmpty(value) ? 'text-yellow-400/50' : 'text-yellow-400'}`}>
          {label}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-yellow-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-zinc-950 border border-yellow-400/30 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-yellow-400/20">
            <div className="flex items-center gap-2 bg-black rounded-md px-2">
              <Search className="w-3.5 h-3.5 text-yellow-400/60 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder={allowCustomEmail ? 'Search by name, or type an email...' : 'Search by name or email...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-yellow-400 text-sm py-1.5 w-full focus:outline-none placeholder:text-yellow-400/40"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {customEmail && (
              <button
                type="button"
                onClick={() => choose({ email: customEmail })}
                className="w-full text-left px-3 py-2 text-sm text-yellow-300 hover:bg-yellow-400/10 border-b border-yellow-400/10"
              >
                Use <span className="font-semibold">{customEmail}</span>
              </button>
            )}
            {searching ? (
              <div className="p-3 text-sm text-yellow-400/50 text-center">Searching...</div>
            ) : filtered.length === 0 ? (
              customEmail ? null : (
                <div className="p-3 text-sm text-yellow-400/50 text-center">No members found</div>
              )
            ) : (
              filtered.map((member: any) => (
                <button
                  key={member.id ?? member.email}
                  type="button"
                  onClick={() => choose(member)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-yellow-400/10 transition-colors ${member.email === value ? 'bg-yellow-400/15 text-yellow-300' : 'text-yellow-400'}`}
                >
                  <Image
                    src={member.profileAvatar || '/default-avatar.png'}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                  <span className="truncate">{member.name} <span className="text-yellow-400/60">({member.email})</span></span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
