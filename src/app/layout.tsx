import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import StructuredData from '@/components/StructuredData';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Zynvo - Connect with College Clubs and Societies',
  description: 'Zynvo is the premier platform for college students to discover, join, and engage with university clubs and societies. Connect with like-minded students, participate in events, and enhance your campus experience.',
  keywords: 'college clubs, university societies, student organizations, campus events, student networking, college activities',
  openGraph: {
    title: 'Zynvo - Connect with College Clubs and Societies',
    description: 'Join the ultimate platform for college clubs and societies',
    type: 'website',
    locale: 'en_US',
    images: ['/landing.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zynvo - Connect with College Clubs and Societies',
    description: 'Join the ultimate platform for college clubs and societies',
    images: ['/landing.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteData = {
    name: 'Zynvo',
    description: 'The premier platform for college clubs and societies',
    url: 'https://zynvo.social',
  };

  const organizationData = {
    name: 'Zynvo',
    description: 'Connecting college students through clubs and societies',
    logo: 'https://zynvo.social/logo.png',
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://zynvo.social" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <StructuredData type="website" data={websiteData} />
        <StructuredData type="organization" data={organizationData} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}