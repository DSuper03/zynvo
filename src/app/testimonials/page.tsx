import type { Metadata } from 'next';
import TestimonialsSection from '@/components/TestimonialsSection';

export const metadata: Metadata = {
  title: 'Campus Stories & Feedback | Zynvo',
  description:
    'What Zynvo delivers for students, clubs, and colleges—and how to share a verified campus story.',
  alternates: { canonical: 'https://zynvosocial.com/testimonials' },
};

export default function TestimonialsPage() {
  return <TestimonialsSection />;
}
