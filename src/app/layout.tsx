import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/sonner';
import { WarmupProvider } from '@/components/WarmupProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { QueryProvider } from '@/providers/QueryProvider';

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
  title:
    'Zynvo - Agentic Social Media Platform for Campus Communities | Student Network',
  description:
    'Zynvo is the leading agentic social media platform connecting college students, clubs, and societies. Discover events, join communities, compete in challenges, and build meaningful campus connections through AI-powered networking.',
  keywords: [
    'agentic social media platform',
    'college social network',
    'campus community platform',
    'student networking app',
    'university clubs platform',
    'college events discovery',
    'AI-powered student connections',
    'campus social media',
    'student engagement platform',
    'college societies network',
    'academic social platform',
    'intelligent campus networking',
  ].join(', '),
  authors: [{ name: 'Zynvo Team' }],
  creator: 'Zynvo',
  publisher: 'Zynvo',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zynvo.com',
    siteName: 'Zynvo',
    title: 'Zynvo - Agentic Social Media Platform for Campus Communities',
    description:
      'The intelligent social platform revolutionizing how college students connect, discover events, join clubs, and build meaningful campus relationships through AI-powered networking.',
    images: [
      {
        url: '/landing page.png',
        width: 1200,
        height: 630,
        alt: 'Zynvo - Agentic Social Media Platform for Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zynvo',
    creator: '@zynvo',
    title: 'Zynvo - Agentic Social Media Platform for Campus Communities',
    description:
      'Join the intelligent social platform connecting college students, clubs, and societies. Discover events, build networks, and compete in challenges.',
    images: ['/landing page.png'],
  },
  category: 'Social Media',
  classification: 'Agentic Social Media Platform',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <WarmupProvider>
              {children}
            </WarmupProvider>
          </QueryProvider>
          <Analytics />
          <SpeedInsights />
          <PerformanceMonitor />
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
