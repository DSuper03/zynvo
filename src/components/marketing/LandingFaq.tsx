'use client';

import { useState } from 'react';
import type { AeoFaq } from '@/lib/seo/aeoFaqs';

export function LandingFaq({
  faqs,
  title = 'Frequently asked questions',
}: {
  faqs: AeoFaq[];
  title?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-lg border border-yellow-500/20 bg-black/50"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="pr-4 font-medium text-white">{faq.question}</span>
                <span className="shrink-0 text-yellow-500">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-yellow-500/20 px-5 py-4 text-sm leading-relaxed text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
