'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { DiscoverPostPreview } from '@/app/discover/discoverImages';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
  </div>
);

// Modal loading component
const ModalLoading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-gray-900 rounded-xl p-8">
      <LoadingSpinner />
    </div>
  </div>
);

// Dynamic imports for heavy components
export const CreateEventModal = dynamic(
  () => import('../app/events/components/EventCreationModel'),
  {
    loading: () => <ModalLoading />,
    ssr: false
  }
);

export const Hero = dynamic(() => import('./Hero'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});

type FeaturesProps = {
  discoverPosts?: DiscoverPostPreview[];
};

export const Features = dynamic<FeaturesProps>(
  () => import('./features') as Promise<{ default: ComponentType<FeaturesProps> }>,
  {
  loading: () => <LoadingSpinner />,
  ssr: false
  }
);

export const Events = dynamic(() => import('./Events'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export const HowItWorks = dynamic(() => import('./working'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

type FooterProps = {
  discoverPosts?: DiscoverPostPreview[];
};

export const Footer = dynamic<FooterProps>(() => import('./Footer') as Promise<{ default: ComponentType<FooterProps> }>, {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

// Testimonials component
export const Testimonials = dynamic(() => import('./testimonials'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Team section
export const TeamSection = dynamic(() => import('./TeamSection'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// FAQ Section
export const FAQSection = dynamic(() => import('./FAQSection'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
