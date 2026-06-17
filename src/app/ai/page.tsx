'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Radar,
  Search,
  Send,
  Sparkles,
  StopCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import NoTokenModal from '@/components/modals/remindModal';

const quickPrompts = [
  'Find upcoming hackathons for students in Bengaluru',
  'Scan Indian college fests with live registration this month',
  'Workshops around AI, design, or product for college students',
  'Parse events from official campus and community websites',
];

type AgentEvent = {
  title: string;
  type: 'fest' | 'hackathon' | 'workshop' | 'other';
  date: string;
  venue: string;
  registrationUrl?: string;
  sourceUrl?: string;
  organizer?: string;
  confidence?: 'verified' | 'likely' | 'needs_check';
  actionLabel?: string;
  whyRelevant?: string;
};

type SourceLink = {
  title?: string;
  url: string;
};

type StreamEvent =
  | { type: 'status'; text: string }
  | { type: 'thought'; text: string }
  | { type: 'event'; event: AgentEvent }
  | { type: 'summary'; text: string; sources?: SourceLink[] }
  | { type: 'error'; error: string }
  | { type: 'done' };

const typeStyles: Record<AgentEvent['type'], string> = {
  fest: 'border-pink-400/30 bg-pink-400/10 text-pink-200',
  hackathon: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  workshop: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  other: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200',
};

const confidenceCopy: Record<NonNullable<AgentEvent['confidence']>, string> = {
  verified: 'Verified',
  likely: 'Likely',
  needs_check: 'Needs check',
};

export default function AIHome() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [thoughts, setThoughts] = useState<string[]>([
    'Ready to scan official pages, registration platforms, and community listings.',
  ]);
  const [status, setStatus] = useState('Idle');
  const [summary, setSummary] = useState('');
  const [sources, setSources] = useState<SourceLink[]>([]);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (!tok) {
        setIsOpen(true);
      }
    }

    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    streamRef.current?.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [thoughts, status]);

  const activityLevel = useMemo(() => {
    if (loading) return 'Live';
    if (events.length > 0) return 'Extracted';
    return 'Ready';
  }, [events.length, loading]);

  const handleAsk = async (p?: string) => {
    const q = (p ?? prompt).trim();
    if (!q || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setEvents([]);
    setThoughts([]);
    setStatus('Booting event intelligence agent');
    setSummary('');
    setSources([]);
    setError('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errBody?.error || `Server error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream returned from the agent.');

      const decoder = new TextDecoder();
      let buffer = '';
      let shouldStop = false;

      while (!shouldStop) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex = buffer.indexOf('\n');

        while (newlineIndex !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            const event = JSON.parse(line) as StreamEvent;

            if (event.type === 'status') {
              setStatus(event.text);
            }

            if (event.type === 'thought') {
              setThoughts((prev) => [...prev.slice(-10), event.text]);
            }

            if (event.type === 'event') {
              setEvents((prev) => [...prev, event.event]);
              setStatus('Actionable event found');
            }

            if (event.type === 'summary') {
              setSummary(event.text);
              setSources(event.sources || []);
            }

            if (event.type === 'error') {
              throw new Error(event.error);
            }

            if (event.type === 'done') {
              shouldStop = true;
              break;
            }
          }

          newlineIndex = buffer.indexOf('\n');
        }
      }

      setStatus('Extraction complete');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setStatus('Extraction stopped');
        return;
      }

      const rawMessage = e instanceof Error ? e.message : '';
      setError(
        rawMessage || 'Failed to get an AI event intelligence response.'
      );
      setStatus('Error');
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const stopStream = () => {
    abortRef.current?.abort();
    setLoading(false);
    setStatus('Extraction stopped');
  };

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAsk();
  };

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-black text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.2),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_28%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="mb-3 border-yellow-400/20 bg-yellow-400/10 text-yellow-200">
                <Radar className="mr-1 h-3 w-3" />
                Student Event Intelligence
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Discover what is worth showing up for.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-gray-400 sm:text-base">
                Zynvo scans campus and community web data, strips away noise, and
                streams verified event actions directly into adaptive cards.
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full bg-yellow-300 ${
                    loading ? 'animate-ping' : ''
                  }`}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-yellow-200/70">
                    Agent
                  </p>
                  <p className="text-sm font-medium text-yellow-100">
                    {activityLevel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <main className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickPrompts.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className="group rounded-2xl border border-white/10 bg-gray-950/80 p-4 text-left transition hover:border-yellow-400/40 hover:bg-yellow-400/10"
                    onClick={() => handleAsk(label)}
                    disabled={loading}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm text-gray-200">{label}</span>
                      <span className="rounded-full bg-yellow-400/10 p-2 text-yellow-300 transition group-hover:bg-yellow-400/20">
                        {i === 0 ? (
                          <Zap className="h-4 w-4" />
                        ) : i === 1 ? (
                          <Search className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <Card className="border border-white/10 bg-gray-950/90 shadow-2xl">
                <CardContent className="p-4">
                  <form onSubmit={submitPrompt} className="flex flex-col gap-3">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Paste event pages, college names, cities, communities, or ask for upcoming fests/hackathons/workshops..."
                      className="min-h-[108px] rounded-2xl border border-gray-800 bg-black/70 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAsk();
                        }
                      }}
                      disabled={loading}
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Badge
                        variant="secondary"
                        className="w-fit border border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                      >
                        Live streaming with web intelligence
                      </Badge>
                      <div className="flex gap-2">
                        {loading && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={stopStream}
                            className="rounded-full border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20"
                          >
                            <StopCircle className="h-4 w-4" />
                            Stop
                          </Button>
                        )}
                        <Button
                          type="submit"
                          disabled={!prompt.trim() || loading}
                          className="rounded-full bg-yellow-500 px-5 text-black hover:bg-yellow-400"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Extract
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {error && (
                <Card className="border border-red-500/30 bg-red-950/40">
                  <CardContent className="p-4 text-sm text-red-200">{error}</CardContent>
                </Card>
              )}

              {(loading || events.length > 0 || summary) && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Action Cards</h2>
                      <p className="text-sm text-gray-500">
                        Built from the agent&apos;s verified extraction stream.
                      </p>
                    </div>
                    {events.length > 0 && (
                      <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                        {events.length} found
                      </Badge>
                    )}
                  </div>

                  {events.length === 0 && loading && (
                    <Card className="border border-white/10 bg-gray-950/80">
                      <CardContent className="flex items-center justify-center gap-3 p-8 text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin text-yellow-300" />
                        Waiting for verified event cards...
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    {events.map((event, idx) => (
                      <Card
                        key={`${event.title}-${idx}`}
                        className="overflow-hidden border border-white/10 bg-gray-950/90 transition hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-[0_24px_80px_rgba(234,179,8,0.12)]"
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <Badge className={typeStyles[event.type]}>
                              {event.type}
                            </Badge>
                            {event.confidence && (
                              <Badge className="border-white/10 bg-white/5 text-gray-200">
                                <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-300" />
                                {confidenceCopy[event.confidence]}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-snug text-white">
                            {event.title}
                          </CardTitle>
                          {event.organizer && (
                            <p className="text-sm text-gray-400">{event.organizer}</p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                              <CalendarDays className="mt-0.5 h-4 w-4 text-yellow-300" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 text-yellow-300" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          {event.whyRelevant && (
                            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                              {event.whyRelevant}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {event.registrationUrl && (
                              <Button
                                asChild
                                className="rounded-full bg-yellow-500 text-black hover:bg-yellow-400"
                              >
                                <Link href={event.registrationUrl} target="_blank">
                                  {event.actionLabel || 'Register'}
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {event.sourceUrl && (
                              <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                              >
                                <Link href={event.sourceUrl} target="_blank">
                                  Source
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {summary && (
                    <Card className="border border-white/10 bg-white/[0.03]">
                      <CardContent className="space-y-3 p-4">
                        <p className="text-sm text-gray-300">{summary}</p>
                        {sources.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {sources.map((source) => (
                              <Link
                                key={source.url}
                                href={source.url}
                                target="_blank"
                                className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-yellow-200 hover:border-yellow-400/30"
                              >
                                {source.title || 'Source'}
                              </Link>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </section>
              )}
            </main>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      Thought Stream
                    </p>
                    <h2 className="text-lg font-semibold">Extraction activity</h2>
                  </div>
                  <div className="relative">
                    <span
                      className={`absolute inset-0 rounded-full bg-yellow-400/40 ${
                        loading ? 'animate-ping' : ''
                      }`}
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-400/10 text-yellow-200">
                      <Activity className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-200/70">
                    Current phase
                  </p>
                  <p className="text-sm text-gray-200">{status}</p>
                </div>

                <div
                  ref={streamRef}
                  className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1"
                >
                  {thoughts.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-gray-500">
                      The agent will show concise, user-visible audit updates here.
                    </div>
                  )}
                  {thoughts.map((thought, idx) => (
                    <div
                      key={`${thought}-${idx}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-300" />
                        <span className="text-xs text-gray-500">
                          Step {idx + 1}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-300">{thought}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <NoTokenModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
