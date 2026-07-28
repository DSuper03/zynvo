'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUniversity,
  FaUsers,
  FaSearch,
  FaCalendarAlt,
  FaRocket,
} from 'react-icons/fa';

import LandingHeader from '@/components/landingHeader';
import { Skiper39 } from '@/components/SkipperLanding';
import { cn } from '@/lib/utils';
import { CanvasText } from '@/components/ui/canvas-text';
import { ParallaxHeroImages } from '@/components/ui/parallax-hero-images';
import OpenRolesSection from '@/components/OpenRolesSection';
import {
  fetchDiscoverPostPreviews,
  type DiscoverPostPreview,
} from '@/app/discover/discoverImages';
import { CommunityFeed } from '@/components/CommunityFeed';
import TopClubs from '@/components/TopClubs';
import {
  Hero,
  Features,
  HowItWorks,
  Events,
  Footer,
} from '@/components/DynamicComponents';


export default function Home() {
  const heroRef = useRef(null);
  const [discoverPosts, setDiscoverPosts] =
    useState<DiscoverPostPreview[]>([]);
  // PERFORMANCE: Store timeout IDs so we can clear on unmount and avoid leaks + setState after unmount
  const floatingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.classList.add('floating-element');

      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.width = `${Math.random() * 100 + 50}px`;
      element.style.height = `${Math.random() * 100 + 50}px`;
      element.style.opacity = `${Math.random() * 0.3 + 0.2}`;

      const container = document.querySelector('.background-animation');
      if (container) {
        container.appendChild(element);
      }

      const duration = Math.random() * 50 + 30;
      element.style.animation = `float ${duration}s infinite linear`;

      const timeoutId = setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, duration * 1000);
      floatingTimeoutsRef.current.push(timeoutId);
    };

    for (let i = 0; i < 5; i++) {
      createFloatingElement();
    }

    const interval = setInterval(createFloatingElement, 5000);

    return () => {
      clearInterval(interval);
      floatingTimeoutsRef.current.forEach((id) => clearTimeout(id));
      floatingTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const loadDiscoverPosts = async () => {
      try {
        const posts = await fetchDiscoverPostPreviews(6);
        if (posts.length) {
          setDiscoverPosts(posts);
        }
      } catch {
        console.warn('Using fallback Discover posts for landing.');
      }
    };

    loadDiscoverPosts();
  }, []);

  return (
    <div className="bg-yellow-300 text-black relative">
      {/* Fixed Background Image */}

      <title>
        Zynvo — Campus Events, Club Management & Student Engagement
      </title>
      <meta
        name="description"
        content="Zynvo is the behavioral layer for campus life: students discover events and clubs, clubs manage and promote everything they run, and colleges get structured visibility into campus activity."
      />
      <meta
        name="keywords"
        content="campus events app, club management software, student engagement platform, college social network, campus community platform, college events discovery, student club management, campus social app India"
      />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="classification" content="Campus Engagement Platform" />
      <meta
        name="category"
        content="Education Technology, Campus Life, Student Engagement"
      />
      <meta
        name="topic"
        content="Campus Events, Club Management, Student Engagement"
      />
      <meta
        name="summary"
        content="Zynvo connects students, clubs, and colleges in one campus activity loop—discovery, operations, and visibility."
      />
      <meta
        name="abstract"
        content="A behavioral layer for campus life that helps students discover events and clubs, helps clubs operate and promote programmes, and gives colleges structured campus activity data."
      />
      <meta
        name="subject"
        content="Campus Events and Club Management Platform"
      />
      <meta name="copyright" content="Zynvo Team" />
      <meta name="language" content="EN" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Zynvo',
            description:
              'Behavioral layer for campus life: students discover events and clubs, clubs manage and promote programmes, colleges get structured visibility into campus activity.',
            url: 'https://zynvosocial.com',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web, iOS, Android',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
            },
            creator: {
              '@type': 'Organization',
              name: 'Zynvo',
              url: 'https://zynvosocial.com/founders',
            },
            keywords:
              'campus events app, club management software, student engagement platform, college social network',
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student',
            },
            featureList: [
              'Club discovery and joining',
              'Campus event discovery and RSVP',
              'Club management and announcements',
              'Student profiles (Zyncers)',
              'Campus news and announcements',
              'Leaderboard and gamified participation',
              'AI assistant for campus navigation',
              'Shared club resources',
              'PWA — installable on mobile',
            ],
            screenshot: 'https://zynvosocial.com/landing%20page.png',
          }),
        }}
      />

      {/* Additional structured data for organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Zynvo',
            alternateName: 'Zynvo Social',
            url: 'https://zynvosocial.com',
            logo: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226',
            description:
              'Zynvo is the behavioral layer for campus life—connecting students, clubs, and colleges in one activity loop.',
            foundingDate: '2026',
            founders: [
              {
                '@type': 'Person',
                name: 'Anirban Ghosh',
                jobTitle: 'CEO & Founder',
              },
              {
                '@type': 'Person',
                name: 'Mohak Chakraborty',
                jobTitle: 'COO',
              },
              {
                '@type': 'Person',
                name: 'Swarnendu Ghosh',
                jobTitle: 'CTO',
              },
            ],
            sameAs: [
              'https://x.com/Zynvonow',
              'https://www.linkedin.com/company/dsuper03',
              'https://www.instagram.com/zynvo.social',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: 'English',
              url: 'https://zynvosocial.com/contact',
            },
          }),
        }}
      />

      {/* WebSite schema — enables sitelinks search box in Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Zynvo',
            url: 'https://zynvosocial.com',
            description:
              'Zynvo is a campus behavioral layer for college students in India — discover clubs, join events, and give colleges visibility into campus activity.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate:
                  'https://zynvosocial.com/discover?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* FAQPage schema — surfaces answers directly in AI and search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is Zynvo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Zynvo is a behavioral layer for campus life: students discover events and clubs, clubs run and promote everything they do, and colleges get structured visibility into campus activity. Think of it as LinkedIn for the journey before LinkedIn.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is Zynvo free for students?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Zynvo is completely free for students. There are no subscription fees or hidden charges.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I find clubs to join in college?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'On Zynvo, browse college-scoped clubs by interest, open a club profile, and join or follow so you get events and announcements in one place. Start at zynvosocial.com/discover.',
                },
              },
              {
                '@type': 'Question',
                name: 'What makes Zynvo different from WhatsApp groups?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'WhatsApp is chat; Zynvo is discovery and structure. Use WhatsApp to talk—use Zynvo to find what is happening, RSVP, and follow clubs without mute-and-miss chaos.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can club organisers post events and manage members on Zynvo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Club admins have tools to post events, send announcements, and manage their member list directly from Zynvo.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is a student engagement platform for colleges?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A student engagement platform helps colleges see and support campus activity—clubs, events, and participation—beyond classroom attendance. Zynvo provides that visibility layer.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does Zynvo have a mobile app?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Zynvo works as a Progressive Web App (PWA) — install it directly from your browser on Android or iOS for a native-like experience. A dedicated app is in development.',
                },
              },
              {
                '@type': 'Question',
                name: 'Who founded Zynvo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Zynvo was founded in 2026 by Anirban Ghosh (CEO), Mohak Chakraborty (COO), and Swarnendu Ghosh (CTO). Learn more at zynvosocial.com/founders.',
                },
              },
            ],
          }),
        }}
      />

      {/* LLMs.txt link — helps AI crawlers find the machine-readable product brief */}
      <link rel="llms" type="text/plain" href="/llms.txt" />

      {/* Content Container */}
      <div className="content-overlay relative min-h-screen">
        {/* Navigation */}
        <LandingHeader />

        <Skiper39 />
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-yellow-300 text-black">
          <ParallaxHeroImages posts={discoverPosts} />
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
            <p className="rounded-full border-2 border-black bg-yellow-200 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-black shadow-[4px_4px_0_rgba(0,0,0,0.95)]">
              Discover feed
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-black md:text-6xl">
              Campus moments, everywhere.
            </h1>
            <p className="max-w-md text-base font-semibold text-black/80 md:text-lg">
              Live club and community moments from ZynvoSocial Discover, animated in real time.
            </p>
          </div>
        </section>
        <TopClubs />
        <Hero />
        {/*     
        <ZynvoDashboard /> */}
        <Features discoverPosts={discoverPosts} />

        {discoverPosts.length > 0 && (
          <section className="bg-yellow-300/60 py-10">
            <CommunityFeed posts={discoverPosts} />
          </section>
        )}

        {/* Event Highlights Section */}
        <Events />
        <OpenRolesSection />
        {/* CTA Section */}
        <section className="flex min-h-80 items-center justify-center bg-yellow-300 p-8 text-black">
          <h2
            className={cn(
              'group relative mx-auto mt-4 max-w-2xl text-left text-4xl font-bold leading-tight tracking-tight text-balance text-neutral-900 sm:text-5xl md:text-6xl xl:text-7xl',
            )}
          >
            Explore campus at{' '}
            <CanvasText
              text="Lightning Speed"
              backgroundClassName="bg-black"
              colors={[
                'rgba(250, 204, 21, 1)',
                'rgba(250, 204, 21, 0.9)',
                'rgba(250, 204, 21, 0.8)',
                'rgba(250, 204, 21, 0.7)',
                'rgba(250, 204, 21, 0.6)',
                'rgba(250, 204, 21, 0.5)',
                'rgba(250, 204, 21, 0.4)',
                'rgba(250, 204, 21, 0.3)',
                'rgba(250, 204, 21, 0.2)',
                'rgba(250, 204, 21, 0.1)',
              ]}
              lineGap={4}
              animationDuration={20}
            />
          </h2>
        </section>

        {/* Footer */}
        <Footer discoverPosts={discoverPosts} />
      </div>
    </div>
  );
}
