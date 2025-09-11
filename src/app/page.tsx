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
import HowItWorks from '@/components/working';

import Events from '@/components/Events';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Features from '@/components/features';
export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.classList.add('floating-element');

      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.width = `${Math.random() * 100 + 50}px`;
      element.style.height = `${Math.random() * 100 + 50}px`;
      element.style.opacity = `${Math.random() * 0.3 + 0.2}`;

      // Add to the background container
      const container = document.querySelector('.background-animation');
      if (container) {
        container.appendChild(element);
      }

      // Animate
      const duration = Math.random() * 50 + 30; // 30-80 seconds
      element.style.animation = `float ${duration}s infinite linear`;

      // Remove after animation completes
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, duration * 1000);
    };

    // Create initial elements
    for (let i = 0; i < 5; i++) {
      createFloatingElement();
    }

    // Continue creating elements
    const interval = setInterval(createFloatingElement, 5000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" bg-gray-900 text-white relative">
      {/* Fixed Background Image */}

      <title>Zynvo - Intelligent Agentic Social Media Platform for Campus Communities</title>
      <meta
        name="description"
        content="Zynvo connects college students through club and 
        society experiences."
      />
      <meta 
        name="keywords" 
        content="agentic social media platform, intelligent campus networking, college student social platform, AI-powered university connections, smart campus community, autonomous social networking, college clubs discovery, intelligent event matching, student engagement AI, campus social intelligence, university networking platform, smart student connections" 
      />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="classification" content="Agentic Social Media Platform" />
      <meta name="category" content="Social Media, Education Technology, AI Networking" />
      <meta name="topic" content="Campus Social Networking, Student Communities, College Connections" />
      <meta name="summary" content="Zynvo revolutionizes campus life through intelligent social networking that autonomously connects students with relevant clubs, events, and opportunities." />
      <meta name="abstract" content="An agentic social media platform leveraging artificial intelligence to create meaningful connections within college and university communities." />
      <meta name="subject" content="Intelligent Campus Social Networking Platform" />
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
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Zynvo",
            "description": "Agentic social media platform for campus communities that intelligently connects college students with clubs, events, and opportunities",
            "url": "https://zynvo.social",
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Zynvo Team",
              "url": "https://zynvo.social/founders"
            },
            "keywords": "agentic social media platform, intelligent campus networking, college student connections, AI-powered university platform",
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "student"
            },
            "featureList": [
              "Intelligent club discovery",
              "AI-powered event matching", 
              "Autonomous networking",
              "Smart campus connections",
              "Competitive challenges",
              "Community building tools"
            ]
          })
        }}
      />
      
      {/* Additional structured data for organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Zynvo",
            "alternateName": "Zynvo - Agentic Social Media Platform",
            "url": "https://zynvo.social",
            "logo": "https://zynvo.social/logozynvo.jpg",
            "description": "The leading agentic social media platform revolutionizing campus communities through intelligent networking and AI-powered connections",
            "foundingDate": "2024",
            "founders": [
              {
                "@type": "Person",
                "name": "Anirban Ghosh",
                "jobTitle": "CEO & Founder"
              },
              {
                "@type": "Person", 
                "name": "Mohak Chakraborty",
                "jobTitle": "COO"
              },
              {
                "@type": "Person",
                "name": "Swarnendu Ghosh", 
                "jobTitle": "CTO"
              }
            ],
            "sameAs": [
              "https://x.com/Zynvonow",
              "https://www.linkedin.com/company/dsuper03",
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />

      {/* Content Container (above animations) - Made scrollable with semi-transparent overlay */}
      <div className="content-overlay relative min-h-screen">
        {/* Navigation */}
        <LandingHeader />

        <Hero />
        {/*     
        <ZynvoDashboard /> */}
        <Features />

        <HowItWorks />
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
