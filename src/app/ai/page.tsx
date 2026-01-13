'use client';

import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Repeat, Sparkles, Send } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import NoTokenModal from '@/components/modals/remindModal';

const quickPrompts = [
  'Looking for the most relevant answers?',
  'Too much data to analyze?',
  'Need the latest info?',
  'Want everything connected?',
];

export default function AIHome() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>('');
  const [items, setItems] = useState<Array<{
    title: string;
    subtitle?: string;
    description?: string;
    url?: string;
    badge?: string;
    image?: string;
    meta?: string;
  }>>([]);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (!tok) {
        setIsOpen(true);
      }
    }
  }, []);

  // SECURITY: Removed API key check from frontend - server route handles authentication
  // API keys should never be exposed in frontend code

  const handleAsk = async (p?: string) => {
    const q = (p ?? prompt).trim();
    if (!q || loading) return;

    setLoading(true);
    setAnswer('');
    setItems([]);
    setError('');

    try {
      // Call server API to generate content (avoids CORS/referrer issues)
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({} as any));
        throw new Error(errBody?.error || `Server error: ${res.status}`);
      }
      const data = (await res.json()) as { text?: string; items?: any[] };
      setAnswer(String(data?.text || 'No response.'));
      if (Array.isArray(data?.items) && data!.items!.length > 0) {
        setItems(
          data!.items!.map((it: any) => ({
            title: String(it?.title ?? ''),
            subtitle: it?.subtitle ? String(it.subtitle) : undefined,
            description: it?.description ? String(it.description) : undefined,
            url: it?.url ? String(it.url) : undefined,
            badge: it?.badge ? String(it.badge) : undefined,
            image: it?.image ? String(it.image) : undefined,
            meta: it?.meta ? String(it.meta) : undefined,
          }))
        );
      }
    } catch (e: any) {
      const rawMessage = e?.message || '';
      const isFetchError = /Failed to fetch/i.test(rawMessage);
      const helpful = isFetchError
        ? 'Network request failed. Check internet, ad-blockers, CORS/referrer restrictions on your Google AI API key, and that the chosen model is available. If you just switched models, try reverting to gemini-2.5-flash or set NEXT_PUBLIC_GOOGLE_AI_MODEL.'
        : 'Failed to get AI response.';
      setError(`${helpful}${rawMessage ? `\n\nDetails: ${rawMessage}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-10 pb-20">
          {/* Top bar mock */}
          <div className="mx-auto mb-10 h-10 w-full max-w-4xl rounded-xl border border-gray-800 bg-gray-900 shadow-sm" />

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Hello,
            </h1>
            <p className="mt-2 text-2xl sm:text-[40px] leading-tight text-gray-400">
              Find What Matters, Faster.
            </p>
          </div>

          {/* Quick cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {quickPrompts.map((label, i) => (
              <Card
                key={i}
                className="border border-gray-800 bg-gray-900 hover:border-yellow-500/30 hover:shadow-[0_0_0_1px_rgba(234,179,8,0.15)] transition cursor-pointer"
                onClick={() => handleAsk(label)}
              >
                <CardContent className="p-5 flex items-start justify-between">
                  <span className="text-sm text-gray-200">{label}</span>
                  <span className="text-yellow-400">
                    {i === 0 ? (
                      <Search className="h-4 w-4" />
                    ) : i === 1 ? (
                      <Repeat className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input pill */}
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-end gap-3">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything..."
                  className="min-h-[56px] rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  disabled={loading}
                />
                <Button
                  onClick={() => handleAsk()}
                  disabled={!prompt.trim() || loading}
                  className="h-12 rounded-full px-4 bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-3 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                >
                  AI-generated results may not always be 100% accurate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {(loading || answer || error) && (
            <div className="mx-auto mt-10 max-w-3xl">
              <Card className="border border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-400">
                    {loading ? 'Working on it…' : error ? 'Error' : 'Result'}
                  </CardTitle>
                </CardHeader>
                {!loading && <Separator className="bg-gray-800" />}
                <CardContent className="p-6">
                  {loading && (
                    <div className="py-4 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                    </div>
                  )}
                  {!loading && !!error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                  {!loading && !error && items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map((it, idx) => (
                        <Card
                          key={idx}
                          className="border border-gray-800 bg-gray-900 hover:border-yellow-500/30 hover:shadow-[0_0_0_1px_rgba(234,179,8,0.15)] transition"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {it.image ? (
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-800">
                                  <Image
                                    src={it.image}
                                    alt={it.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-800/60" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-base font-semibold text-white truncate">
                                    {it.title}
                                  </h3>
                                  {it.badge && (
                                    <Badge className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                                      {it.badge}
                                    </Badge>
                                  )}
                                </div>
                                {it.subtitle && (
                                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {it.subtitle}
                                  </p>
                                )}
                                {it.description && (
                                  <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                                    {it.description}
                                  </p>
                                )}
                                <div className="mt-3 flex items-center justify-between">
                                  {it.meta && (
                                    <span className="text-xs text-gray-500 truncate max-w-[60%]">
                                      {it.meta}
                                    </span>
                                  )}
                                  {it.url && (
                                    <Link
                                      href={it.url}
                                      target="_blank"
                                      className="text-xs text-yellow-400 hover:text-yellow-300"
                                    >
                                      View
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {!loading && !error && items.length === 0 && (
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                      <p className="whitespace-pre-wrap text-white">{answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <NoTokenModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
