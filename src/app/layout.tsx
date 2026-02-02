import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/sonner';
import { WarmupProvider } from '@/components/WarmupProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { QueryProvider } from '@/providers/QueryProvider';
import FloatingPWAInstall from '@/components/FloatingPWAInstall';
import { ClerkKeyDebug } from '@/components/ClerkKeyDebug';
import { ClerkProvider } from '@clerk/nextjs'

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
  manifest: "/manifest.json",
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
  icons: {
    icon: [
      {
        url: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226&v=2',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226&v=2',
        type: 'image/png',
        sizes: '192x192',
      },
    ],
    shortcut: [
      {
        url: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226&v=2',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226&v=2',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider
      appearance={{
        elements: {
          rootBox: "mx-auto",
        },
      }}
    >
    <html lang="en">
       <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0E7B1VF3JX"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0E7B1VF3JX');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ClerkKeyDebug />
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
          <FloatingPWAInstall />
        </ErrorBoundary>
      </body>
    </html>
    </ClerkProvider>
  );
}
