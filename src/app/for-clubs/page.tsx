import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = faqsByCategory('Clubs');

export const metadata: Metadata = {
  title: 'Club Management Software for College Societies | Zynvo',
  description:
    'Zynvo is an operating system for campus clubs—promote events, manage members, and reach students without living in WhatsApp and spreadsheets.',
  keywords:
    'club management software, college society admin, promote college events, student club management platform',
  openGraph: {
    title: 'Club Management Software for College Societies | Zynvo',
    description:
      'Manage, promote, and run campus club events in one place built for colleges.',
    url: 'https://zynvosocial.com/for-clubs',
  },
  alternates: { canonical: 'https://zynvosocial.com/for-clubs' },
};

export default function ForClubsPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Zynvo for Clubs',
          description:
            'Club management software for campus societies—profiles, members, announcements, and event promotion.',
          url: 'https://zynvosocial.com/for-clubs',
          isPartOf: { '@type': 'WebSite', url: 'https://zynvosocial.com' },
        }}
      />
      <AudienceLanding
        eyebrow="For clubs"
        headline="An operating system for everything your club runs"
        subhead="Zynvo is club management software built for campus societies: promote events, reach students, and keep members organised—without generic event SaaS or disappearing chats."
        primaryCta={{ href: '/auth/signup', label: 'Set up your club' }}
        secondaryCta={{ href: '/clubs', label: 'See clubs' }}
        benefits={[
          {
            title: 'Promote events',
            description:
              'Publish campus-ready event pages and reach students who are already looking for something to do.',
          },
          {
            title: 'Run membership',
            description:
              'Keep members, roles, and announcements structured so ops do not live in Excel and mute-heavy groups.',
          },
          {
            title: 'Grow discoverability',
            description:
              'An always-on club profile means students can find you without a personal invite.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Claim or create your club profile',
            description:
              'Set up a clear profile so students know who you are and what you run.',
          },
          {
            step: '2',
            title: 'Post events and announcements',
            description:
              'Share upcoming programmes with RSVP-friendly pages instead of one-off forwards.',
          },
          {
            step: '3',
            title: 'Manage and measure',
            description:
              'Use admin tools to stay organised and see who is engaging with your activity.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/club-management-software', label: 'Club management software' },
          { href: '/for-students', label: 'For students' },
          { href: '/for-colleges', label: 'For colleges' },
        ]}
      />
    </>
  );
}
