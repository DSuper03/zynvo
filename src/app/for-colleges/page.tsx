import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = faqsByCategory('Colleges');

export const metadata: Metadata = {
  title: 'Student Engagement Platform for Colleges | Zynvo',
  description:
    'Give student affairs structured visibility into clubs, events, and campus activity. Zynvo is the student engagement platform connecting students, clubs, and colleges.',
  keywords:
    'student engagement platform for colleges, campus engagement software, campus activity analytics, student involvement reporting',
  openGraph: {
    title: 'Student Engagement Platform for Colleges | Zynvo',
    description:
      'Structured visibility into campus clubs, events, and student involvement—beyond the LMS.',
    url: 'https://zynvosocial.com/for-colleges',
  },
  alternates: { canonical: 'https://zynvosocial.com/for-colleges' },
};

export default function ForCollegesPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Zynvo for Colleges',
          description:
            'Student engagement platform for colleges—visibility into clubs, events, and campus activity.',
          url: 'https://zynvosocial.com/for-colleges',
          isPartOf: { '@type': 'WebSite', url: 'https://zynvosocial.com' },
        }}
      />
      <AudienceLanding
        eyebrow="For colleges"
        headline="Visibility into campus activity—not another LMS"
        subhead="Zynvo is a student engagement platform for colleges: structured data on clubs, events, and involvement so student affairs can see campus life beyond classroom tools."
        primaryCta={{ href: '/contact', label: 'Talk to us' }}
        secondaryCta={{ href: '/founders', label: 'Meet the team' }}
        benefits={[
          {
            title: 'Structured campus data',
            description:
              'Events, clubs, and participation become reviewable activity—not guesswork from posters and group chats.',
          },
          {
            title: 'Stronger student life',
            description:
              'When discovery is shared, more students find clubs and programmes that fit—supporting belonging and engagement.',
          },
          {
            title: 'One loop, three audiences',
            description:
              'Students discover, clubs operate, colleges measure—no major competitor currently connects all three in one product loop.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Pilot with active clubs',
            description:
              'Start with societies already running events so campus activity lands in one structured layer.',
          },
          {
            step: '2',
            title: 'Open discovery to students',
            description:
              'Give students a campus feed for events and clubs instead of fragmented forwards.',
          },
          {
            step: '3',
            title: 'Review involvement signals',
            description:
              'Use structured activity as input for student success, culture, and co-curricular narratives.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/student-engagement-platform', label: 'Engagement platform' },
          { href: '/for-clubs', label: 'For clubs' },
          { href: '/contact', label: 'Contact' },
        ]}
      />
    </>
  );
}
