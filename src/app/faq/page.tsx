import FAQSection from '@/components/FAQSection';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd } from '@/lib/seo/aeoFaqs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Campus Events, Clubs & Colleges | Zynvo',
  description:
    'Answers for students, club heads, and college admins: what Zynvo is, how campus event discovery works, and how clubs and colleges use the platform.',
  alternates: { canonical: 'https://zynvosocial.com/faq' },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd()} />
      <FAQSection />
    </>
  );
}
