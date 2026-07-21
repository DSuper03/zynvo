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
import ClientTelemetryBootstrap from '@/components/ClientTelemetryBootstrap';
import WebMcpBootstrap from '@/components/WebMcpBootstrap';
import { ClerkProvider } from '@clerk/nextjs';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://zynvosocial.com'),
  manifest: "/manifest.json",
  title:
    'Zynvo — Campus Events, Club Management & Student Engagement',
  description:
    'Zynvo is the behavioral layer for campus life: students discover events and clubs, clubs manage and promote everything they run, and colleges get structured visibility into campus activity. LinkedIn for the journey before LinkedIn.',
  keywords: [
    'campus events app',
    'club management software',
    'student engagement platform',
    'college social network',
    'campus community platform',
    'college events discovery',
    'student club management',
    'campus social app India',
    'college societies network',
    'campus activity platform',
  ].join(', '),
  authors: [{ name: 'Zynvo Team' }],
  creator: 'Zynvo',
  publisher: 'Zynvo',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://zynvosocial.com',
    siteName: 'Zynvo',
    title: 'Zynvo — Behavioral Layer for Campus Life',
    description:
      'Students discover. Clubs operate. Colleges measure. One campus loop for events, societies, and involvement before LinkedIn.',
    images: [
      {
        url: '/titlecard.png',
        width: 1200,
        height: 630,
        alt: 'Zynvo — Campus events, clubs, and student engagement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zynvo',
    creator: '@zynvo',
    title: 'Zynvo — Campus Events, Clubs & Engagement',
    description:
      'The campus behavioral layer: discover events, run clubs, and give colleges visibility into student life.',
    images: ['/landing page.png'],
  },
  category: 'Education Technology',
  classification: 'Campus Engagement Platform',

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
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/auth/sso-callback"
      signUpFallbackRedirectUrl="/auth/sso-callback"
      appearance={{
        elements: {
          rootBox: "mx-auto",
        },
      }}
    >
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6745473381903668"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
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
        <ClerkKeyDebug />
        <ClientTelemetryBootstrap />
        <WebMcpBootstrap />
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
