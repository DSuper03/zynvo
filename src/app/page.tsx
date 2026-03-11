'use client';
import { useEffect, useRef } from 'react';
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
import {
  Hero,
  Features,
  HowItWorks,
  Events,
  Footer,
} from '@/components/DynamicComponents';
export default function Home() {
  const heroRef = useRef(null);
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

  return (
    <div className="bg-yellow-300 text-black relative">
      {/* Fixed Background Image */}

      <title>
        Zynvo - Intelligent Agentic Social Media Platform for Campus Communities
      </title>
      <meta
        name="description"
        content="Zynvo connects college students through club and 
        society experiences."
      />
      <meta
        name="keywords"
        content="agentic social media platform, intelligent campus networking, college student social platform, AI-powered university connections, smart campus community, autonomous social networking, college clubs discovery, intelligent event matching, student engagement AI, campus social intelligence, university networking platform, smart student connections"
      />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="classification" content="Agentic Social Media Platform" />
      <meta
        name="category"
        content="Social Media, Education Technology, AI Networking"
      />
      <meta
        name="topic"
        content="Campus Social Networking, Student Communities, College Connections"
      />
      <meta
        name="summary"
        content="Zynvo revolutionizes campus life through intelligent social networking that autonomously connects students with relevant clubs, events, and opportunities."
      />
      <meta
        name="abstract"
        content="An agentic social media platform leveraging artificial intelligence to create meaningful connections within college and university communities."
      />
      <meta
        name="subject"
        content="Intelligent Campus Social Networking Platform"
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
              'Agentic social media platform for campus communities that intelligently connects college students with clubs, events, and opportunities',
            url: 'https://zynvo.social',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web, iOS, Android',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            creator: {
              '@type': 'Organization',
              name: 'Zynvo Team',
              url: 'https://zynvo.social/founders',
            },
            keywords:
              'agentic social media platform, intelligent campus networking, college student connections, AI-powered university platform',
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student',
            },
            featureList: [
              'Club discovery and joining',
              'Campus event discovery and RSVP',
              'Student profiles (Zyncers)',
              'Campus news and announcements',
              'Leaderboard and gamified participation',
              'AI assistant for campus navigation',
              'Shared club resources',
              'PWA — installable on mobile',
            ],
            screenshot: 'https://zynvo.social/landing%20page.png',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '120',
              bestRating: '5',
            },
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
            alternateName: 'Zynvo - Agentic Social Media Platform',
            url: 'https://zynvo.social',
            logo: 'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226',
            description:
              'The leading agentic social media platform revolutionizing campus communities through intelligent networking and AI-powered connections',
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
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: 'English',
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
            url: 'https://zynvo.social',
            description:
              'Zynvo is a campus social network for college students in India — discover clubs, join events, and connect with your campus community.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate:
                  'https://zynvo.social/discover?q={search_term_string}',
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
                  text: 'Zynvo is a social platform built exclusively for college campuses. It helps students discover clubs, find events, connect with peers, and stay updated on campus life — all in one place. Think of it as the social layer of your college.',
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
                name: 'How do I join a club on Zynvo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sign up at zynvo.social/auth/signup, then browse clubs at zynvo.social/discover and tap Join on any club that interests you.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which colleges use Zynvo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Zynvo started in West Bengal, India and is expanding to colleges across the country. Any student can sign up and invite their college community.',
                },
              },
              {
                '@type': 'Question',
                name: 'What makes Zynvo different from WhatsApp groups or Facebook?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Zynvo is organised around clubs and events rather than open chats. Everything is structured, searchable, and tied to your real campus identity — no noise, no spam, just your campus community.',
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
                  text: 'Zynvo was founded in 2026 by Anirban Ghosh (CEO), Mohak Chakraborty (COO), and Swarnendu Ghosh (CTO). Learn more at zynvo.social/founders.',
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
        <Hero />
        {/*     
        <ZynvoDashboard /> */}
        <Features />

        
        {/* Testimonials Section */}
        {/* <Testimonials /> */}

        {/* Event Highlights Section */}
        <Events />
        {/* CTA Section */}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
