import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = faqsByCategory('Students');

export const metadata: Metadata = {
  title: 'Campus Events App for Students | Zynvo',
  description:
    'One feed to discover clubs, fests, and campus events. Zynvo is the campus events app for students—free to use, built for college life in India.',
  keywords:
    'campus events app, college events near me, find college clubs, campus social app India, student event discovery',
  openGraph: {
    title: 'Campus Events App for Students | Zynvo',
    description:
      'Discover clubs, events, and campus life in one feed. Free for students.',
    url: 'https://zynvosocial.com/for-students',
  },
  alternates: { canonical: 'https://zynvosocial.com/for-students' },
};

export default function ForStudentsPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Zynvo for Students',
          description:
            'Zynvo is a campus events app that helps students discover clubs, fests, and activities in one feed.',
          url: 'https://zynvosocial.com/for-students',
          isPartOf: { '@type': 'WebSite', url: 'https://zynvosocial.com' },
        }}
      />
      <AudienceLanding
        eyebrow="For students"
        headline="One feed for what matters on campus"
        subhead="Zynvo is a campus events app and club discovery layer—so you stop missing fests, workshops, and societies buried in WhatsApp forwards."
        primaryCta={{ href: '/auth/signup', label: 'Join free' }}
        secondaryCta={{ href: '/events', label: 'Browse events' }}
        benefits={[
          {
            title: 'Discover events',
            description:
              'See campus fests, club nights, hackathons, and workshops in one place—filtered to your college.',
          },
          {
            title: 'Find your clubs',
            description:
              'Browse societies by interest, follow what fits, and get updates without hunting through group chats.',
          },
          {
            title: 'Build your journey',
            description:
              'Capture leadership and involvement before LinkedIn—your campus activity becomes a visible story.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Sign up with your campus identity',
            description:
              'Create a free student account and connect to your college community.',
          },
          {
            step: '2',
            title: 'Explore clubs and events',
            description:
              'Use Discover and Events to find what is happening around you this week.',
          },
          {
            step: '3',
            title: 'Join, RSVP, show up',
            description:
              'Follow clubs, RSVP to events, and stay in the loop without muting fifty chats.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/for-clubs', label: 'For clubs' },
          { href: '/campus-event-app', label: 'Campus event app' },
          { href: '/faq', label: 'FAQ' },
        ]}
      />
    </>
  );
}
