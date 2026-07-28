import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = [
  ...faqsByCategory('Students').slice(0, 4),
  ...faqsByCategory('Clubs').slice(1, 3),
];

export const metadata: Metadata = {
  title: 'Campus Event App for College Students & Clubs | Zynvo',
  description:
    'A campus event app for discovering and promoting college events, fests, and club programmes—one feed for students, one OS for organisers.',
  keywords:
    'campus event app, college events app India, promote college event, campus fest discovery, student RSVP app',
  openGraph: {
    title: 'Campus Event App | Zynvo',
    description:
      'Discover and promote college events in one campus-native app.',
    url: 'https://zynvosocial.com/campus-event-app',
  },
  alternates: { canonical: 'https://zynvosocial.com/campus-event-app' },
};

export default function CampusEventAppPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zynvo Campus Event App',
          applicationCategory: 'SocialNetworkingApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          description:
            'Campus event app for students and clubs—discover, RSVP, and promote college events in one place.',
          url: 'https://zynvosocial.com/campus-event-app',
        }}
      />
      <AudienceLanding
        eyebrow="Campus event app"
        headline="Campus events, finally in one place"
        subhead="Zynvo is a campus event app for students who want to discover what is happening—and for clubs that need to promote programmes beyond a single WhatsApp forward."
        primaryCta={{ href: '/auth/signup', label: 'Get started free' }}
        secondaryCta={{ href: '/events', label: 'View events' }}
        benefits={[
          {
            title: 'For students: discover',
            description:
              'One feed for fests, workshops, and club nights tied to your campus—not scattered forwards.',
          },
          {
            title: 'For clubs: promote',
            description:
              'Publish event pages, reach interested students, and track interest with RSVPs.',
          },
          {
            title: 'For colleges: visibility',
            description:
              'Structured event activity becomes something institutions can actually see.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Browse or publish',
            description:
              'Students explore upcoming campus events; clubs post what they are running.',
          },
          {
            step: '2',
            title: 'RSVP and share',
            description:
              'Interest is captured on a real event page—not lost in chat history.',
          },
          {
            step: '3',
            title: 'Show up and grow',
            description:
              'Better discovery means fuller rooms and a clearer campus calendar.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/for-students', label: 'For students' },
          { href: '/for-clubs', label: 'For clubs' },
          { href: '/club-management-software', label: 'Club management' },
        ]}
      />
    </>
  );
}
