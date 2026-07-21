import type { Metadata } from 'next';
import { AudienceLanding } from '@/components/marketing/AudienceLanding';
import { JsonLd } from '@/components/marketing/JsonLd';
import { faqPageJsonLd, faqsByCategory } from '@/lib/seo/aeoFaqs';

const faqs = faqsByCategory('Clubs').slice(0, 6);

export const metadata: Metadata = {
  title: 'Club Management Software for Colleges | Zynvo',
  description:
    'Club management software for student societies: member tools, announcements, and campus event promotion in one platform built for Indian colleges.',
  keywords:
    'club management software, student club management platform, college society management, campus club admin tools',
  openGraph: {
    title: 'Club Management Software for Colleges | Zynvo',
    description:
      'Manage members, announce updates, and promote campus events—purpose-built for college clubs.',
    url: 'https://zynvosocial.com/club-management-software',
  },
  alternates: {
    canonical: 'https://zynvosocial.com/club-management-software',
  },
};

export default function ClubManagementSoftwarePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zynvo Club Management',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          description:
            'Club management software for college societies—profiles, members, announcements, and event promotion.',
          url: 'https://zynvosocial.com/club-management-software',
        }}
      />
      <AudienceLanding
        eyebrow="Club management software"
        headline="Run your college club like an organisation—not a group chat"
        subhead="Zynvo is club management software for campus societies. Profiles, member ops, announcements, and event promotion sit in one operating system built for colleges."
        primaryCta={{ href: '/auth/signup', label: 'Start managing your club' }}
        secondaryCta={{ href: '/for-clubs', label: 'See club features' }}
        benefits={[
          {
            title: 'Purpose-built for campus',
            description:
              'Not generic event SaaS. Zynvo understands college clubs, fests, and campus identity.',
          },
          {
            title: 'Promotion that students can find',
            description:
              'Events live where students discover campus life—not only in a muted WhatsApp blast.',
          },
          {
            title: 'Ops without spreadsheet tax',
            description:
              'Keep members and announcements structured so presidents spend time on programming, not admin chaos.',
          },
        ]}
        steps={[
          {
            step: '1',
            title: 'Create your club presence',
            description: 'A clear profile students can find and follow.',
          },
          {
            step: '2',
            title: 'Publish what you run',
            description: 'Events and announcements with campus reach.',
          },
          {
            step: '3',
            title: 'Operate from one admin surface',
            description: 'Members, updates, and engagement in one loop.',
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { href: '/for-clubs', label: 'For clubs' },
          { href: '/campus-event-app', label: 'Campus event app' },
          { href: '/for-colleges', label: 'For colleges' },
        ]}
      />
    </>
  );
}
