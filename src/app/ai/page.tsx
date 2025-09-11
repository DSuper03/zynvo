'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Repeat, Sparkles, Send } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [error, setError] = useState<string>('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (!tok) {
        onOpen();
      }
    }
  }, [onOpen]);

  // Read the key once; if missing, show a warning and disable calls
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY as
    | string
    | undefined;
  const hasKey = Boolean(API_KEY && API_KEY.trim().length > 0);

  const handleAsk = async (p?: string) => {
    const q = (p ?? prompt).trim();
    if (!q || loading) return;

    if (!hasKey) {
      setError(
        'Missing NEXT_PUBLIC_GOOGLE_AI_API_KEY. Add it to .env.local and restart the dev server.'
      );
      return;
    }

    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const ai = new GoogleGenAI({
        apiKey: API_KEY!,
      } as any);

      const groundingTool = { googleSearch: {} };
      const config = { tools: [groundingTool] };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: q,
        config,
      });

      const text = (response as any)?.text ?? 'No response.';
      setAnswer(String(text));
    } catch (e: any) {
      setError(e?.message || 'Failed to get AI response.');
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
                  {!loading && !error && (
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
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        hideCloseButton
        classNames={{
          base: 'bg-neutral-300 border border-gray-200 border-2 rounded-2xl',
          header: 'border-b border-gray-200',
          footer: 'border-t border-gray-200',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/modal/legomodalreminder.png"
                    alt="Welcome to Zynvo AI"
                    width={220}
                    height={220}
                    className="rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome to Zynvo 🚀
                </h2>
              </ModalHeader>
              <ModalBody className="text-center">
                <p className="text-gray-900 mb-4 text-mono">
                  Hey there! We're excited to have you try our AI features. To
                  get started and unlock personalized answers, please sign up or
                  sign in.
                </p>
                <p className="text-sm text-gray-500">
                  Don't worry, it only takes a minute! 😊
                </p>
              </ModalBody>
              <ModalFooter className="flex flex-col gap-3">
                <div className="flex gap-3 w-full">
                  <Link href="/auth/signin" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="flex-1">
                    <Button
                      className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                      onClick={onClose}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onClose();
                    window.location.href = '/auth/signup';
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Maybe later
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
