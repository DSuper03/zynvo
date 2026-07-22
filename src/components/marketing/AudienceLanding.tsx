import Link from 'next/link';
import LandingHeader from '@/components/landingHeader';
import { BackgroundElements } from '@/components/TeamSection';
import { LandingFaq } from '@/components/marketing/LandingFaq';
import type { AeoFaq } from '@/lib/seo/aeoFaqs';

export type LandingBenefit = {
  title: string;
  description: string;
};

export type LandingStep = {
  step: string;
  title: string;
  description: string;
};

type AudienceLandingProps = {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  benefits: LandingBenefit[];
  steps: LandingStep[];
  faqs: AeoFaq[];
  relatedLinks?: { href: string; label: string }[];
};

export function AudienceLanding({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  benefits,
  steps,
  faqs,
  relatedLinks,
}: AudienceLandingProps) {
  return (
    <div className="relative min-h-screen bg-black pt-24 text-white">
      <LandingHeader />
      <BackgroundElements />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-4 pb-12 pt-8 text-center sm:px-6">
          <p className="mb-4 inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
            {eyebrow}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            {subhead}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={primaryCta.href}
              className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-yellow-300"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-xl border border-white/20 bg-black/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/90"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Why it matters
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-yellow-500/20 bg-black/50 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <ol className="space-y-6">
            {steps.map((s) => (
              <li
                key={s.step}
                className="flex gap-4 rounded-2xl border border-yellow-500/15 bg-black/40 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                  {s.step}
                </span>
                <div>
                  <h3 className="mb-1 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <LandingFaq faqs={faqs} />

        {relatedLinks && relatedLinks.length > 0 && (
          <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
            <p className="mb-4 text-sm text-gray-400">Explore more</p>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-yellow-500/30 px-4 py-2 text-sm text-yellow-400 transition-colors hover:bg-yellow-500/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
