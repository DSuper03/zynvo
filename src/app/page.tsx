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
import WrapButton from '@/components/ui/wrap-button';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import Image from 'next/image';
import Link from 'next/link';
import ZynvoDashboard from '@/components/features';
import HowItWorks from '@/components/working';
import Category from '@/components/category';

import Testimonials from '@/components/testimonials';
import Events from '@/components/Events';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Animation for background floating elements
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

      <title>Zynvo </title>
      <meta
        name="description"
        content="Zynvo connects college students through club and society experiences"
      />

      {/* Content Container (above animations) - Made scrollable with semi-transparent overlay */}
      <div className="content-overlay relative min-h-screen">
        {/* Navigation */}
        <LandingHeader />

        <Hero />

        <ZynvoDashboard />

        <HowItWorks />

        <Category />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Event Highlights Section */}
        <Events />
        {/* CTA Section */}

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  );
}
