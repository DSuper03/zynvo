import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download the Zynvo App | Zynvo',
  alternates: { canonical: 'https://zynvosocial.com/application' },
};

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
