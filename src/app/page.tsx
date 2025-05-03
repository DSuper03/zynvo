'use client'
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaUsers, FaComments, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import { features } from '@/constants/Features';
import LandingHeader from '@/components/landingHeader';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <img
          src="/landing page.png"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>
      
      <title>Zynvo - Connect Through Campus Life</title>
      <meta name="description" content="Zynvo connects college students through club and society experiences" />
      
      <style jsx global>{`
        :root {
          --black: #0F0F0F;
          --yellow: #FFC107;
          --yellow-light: #FFDD4A;
          --dark-gray: #1A1A1A;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--black);
          overflow-x: hidden;
        }
        
        .gradient-text {
          background: linear-gradient(to right, var(--yellow), var(--yellow-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .background-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          overflow: hidden;
        }
        
        .floating-element {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, var(--yellow), var(--yellow-light));
          filter: blur(60px);
          z-index: 0;
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(100px, 100px) rotate(120deg);
          }
          66% {
            transform: translate(-100px, 200px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        
        /* Add overlay to improve content visibility over background image */
        .content-overlay {
          position: relative;
          z-index: 10;
          background-color: rgba(17, 24, 39, 0.2); /* semi-transparent bg-gray-900 */
        }
      `}</style>

      {/* Background Animation Container */}
      <div className="background-animation"></div>

      {/* Content Container (above animations) - Made scrollable with semi-transparent overlay */}
      <div className="content-overlay relative min-h-screen">
        {/* Navigation */}
           <LandingHeader/>

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Connect Through <span className="gradient-text">Campus Life</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-300"
            >
              Zynvo bridges the gap between college clubs and societies, creating a vibrant network for students across institutions.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="px-8 py-3 bg-yellow-500 text-black font-medium rounded-full hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1">
                Get Started
              </button>
              <button className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 font-medium rounded-full hover:bg-yellow-500/10 transition duration-300 transform hover:-translate-y-1">
                Learn More
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 relative max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-2xl p-2">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="relative h-96 w-full">
                    <div className="absolute inset-0 flex items-center justify-center text-yellow-500 text-xl">
                      Zynvo App Interface Mockup
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements - Enhanced brightness */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/40 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500/40 rounded-full blur-xl"></div>
              <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Features</span> that Connect
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover how Zynvo transforms the campus club experience with these powerful features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 border-l-4 border-yellow-500 rounded-lg p-6 hover:transform hover:-translate-y-2 transition duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}