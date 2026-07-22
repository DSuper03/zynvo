import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = faqsByCategory('Colleges');

export const metadata: Metadata = {
  title: 'Student Engagement Platform for Colleges | Zynvo',
  description:
    'Student engagement platform for colleges: structured visibility into clubs, events, and campus involvement—without turning co-curricular life into another LMS.',
  keywords:
    'student engagement platform, campus engagement software, student activity analytics, college student involvement platform',
  openGraph: {
    title: 'Student Engagement Platform | Zynvo',
    description:
      'Help colleges see and support campus clubs, events, and student involvement.',
    url: 'https://zynvosocial.com/student-engagement-platform',
  },
  alternates: {
    canonical: 'https://zynvosocial.com/student-engagement-platform',
  },
};

export default function StudentEngagementPlatformPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zynvo Student Engagement Platform',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          description:
            'Student engagement platform for colleges—clubs, events, and campus activity visibility.',
          url: 'https://zynvosocial.com/student-engagement-platform',
        }}
      />
      <AudienceLanding
        eyebrow="Student engagement platform"
        headline="Campus involvement you can actually see"
        subhead="Zynvo is a student engagement platform for colleges. It digitises co-curricular life—clubs, events, community—so institutions get structured visibility without another academic LMS."
        primaryCta={{ href: '/contact', label: 'Book a conversation' }}
        secondaryCta={{ href: '/for-colleges', label: 'For colleges' }}
        benefits={[
          {
            title: 'Beyond classroom systems',
            description:
              'LMS tools academics. Zynvo covers the behavioral layer of campus life students actually live.',
          },
          {
            title: 'One loop with clubs and students',
            description:
              'Engagement data is more useful when students discover and clubs operate on the same platform.',
          },
          {
            title: 'Built for Indian campuses',
            description:
              'Fest culture, society structures, and WhatsApp-first habits—designed around how campuses actually run.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Map active campus organisations',
            description: 'Bring clubs onto a shared discovery and ops layer.',
          },
          {
            step: '2',
            title: 'Open the student feed',
            description: 'Make events and societies findable campus-wide.',
          },
          {
            step: '3',
            title: 'Review structured activity',
            description:
              'Use involvement signals for culture, success, and reporting narratives.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/for-colleges', label: 'For colleges' },
          { href: '/for-clubs', label: 'For clubs' },
          { href: '/contact', label: 'Contact' },
        ]}
      />
    </>
  );
}
