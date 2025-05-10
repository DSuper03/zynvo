'use client'
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaUsers, FaComments, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import { features } from '@/constants/Features';
import LandingHeader from '@/components/landingHeader';
import WrapButton from '@/components/ui/wrap-button';
import { SkiperCard } from '@/components/ui/skiper-card';
import ASCIIText from '@/components/ASCIIText/ASCIIText';

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
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <img
          src="/landing page.png"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>
      
      <title>Zynvo </title>
      <meta name="description" content="Zynvo connects college students through club and society experiences" />
      
      

      {/* Background Animation Container */}
      <div className="background-animation"></div>

      {/* Content Container (above animations) - Made scrollable with semi-transparent overlay */}
      <div className="content-overlay relative min-h-screen">
        {/* Navigation */}
           <LandingHeader/>

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
           <motion.div>

             <ASCIIText
  text='Zynvo Zynvo'
  enableWaves={true}
  asciiFontSize={8}
/>
  </motion.div>
            
           
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-300"
            >
              Zynvo bridges the gap between college clubs and societies, creating a vibrant network for students across institutions.
            </motion.p>
            <div
     className='flex justify-center gap-4 mb-10'
            >
              <WrapButton className=" bg-transparent text-black font-medium r  transition duration-300 transform hover:-translate-y-1">
                Get Started
              </WrapButton>
            
            </div>
            
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get started with Zynvo in just a few simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  step: 1, 
                  title: "Create an account", 
                  description: "Sign up using your university email to join the campus network",
                  icon: <FaUsers className="text-yellow-500 text-3xl mb-4" />
                },
                { 
                  step: 2, 
                  title: "Discover clubs", 
                  description: "Browse through clubs and societies based on your interests",
                  icon: <FaSearch className="text-yellow-500 text-3xl mb-4" />
                },
                { 
                  step: 3, 
                  title: "Join activities", 
                  description: "Connect with club members and participate in events",
                  icon: <FaCalendarAlt className="text-yellow-500 text-3xl mb-4" />
                },
                { 
                  step: 4, 
                  title: "Build your network", 
                  description: "Expand your university experience through meaningful connections",
                  icon: <FaRocket className="text-yellow-500 text-3xl mb-4" />
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 border-2 border-yellow-500">
                    <span className="text-xl font-bold">{item.step}</span>
                  </div>
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Club Categories Section */}
        <section id="club-categories" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Discover Clubs</span> By Category
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Explore diverse communities across your campus
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "Academic", count: 42, icon: <FaUniversity className="text-2xl" /> },
                { name: "Sports", count: 37, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg> },
                { name: "Arts", count: 29, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
                { name: "Technology", count: 31, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { name: "Culture", count: 24, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { name: "Gaming", count: 19, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg> },
                { name: "Music", count: 22, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
                { name: "Volunteering", count: 16, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/80 rounded-lg p-6 cursor-pointer hover:bg-gray-700/80 transition duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      {category.icon}
                    </div>
                    <span className="text-sm bg-yellow-500/30 rounded-full px-2 py-1">{category.count}</span>
                  </div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                </motion.div>
              ))}
            </div>
            
           
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Success Stories</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                See how Zynvo transforms campus club experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "President, Tech Club",
                  university: "Stanford University",
                  quote: "Zynvo helped us increase our membership by 300% in just one semester. The platform's event management tools saved us countless hours of work.",
                  image: "/placeholder-avatar-1.png"
                },
                {
                  name: "Mira Patel",
                  role: "Member, Dance Society",
                  university: "UCLA",
                  quote: "I found my passion for dance through Zynvo. The platform made it easy to discover events and connect with other dance enthusiasts.",
                  image: "/placeholder-avatar-2.png"
                },
                {
                  name: "James Wilson",
                  role: "Organizer, Debate Club",
                  university: "MIT",
                  quote: "Coordinating with other universities for debate competitions was a nightmare before Zynvo. Now we can seamlessly organize inter-college events.",
                  image: "/placeholder-avatar-3.png"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-xl p-8 relative"
                >
                  <div className="mb-4">
                    {/* Quote icon */}
                    <svg 
                      className="w-10 h-10 text-yellow-500 opacity-30 absolute top-6 right-6" 
                      fill="currentColor" 
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 8v10c0 2.2-1.8 4-4 4s-4-1.8-4-4v-2h2v2c0 1.1.9 2 2 2s2-.9 2-2v-10h-6v10h2v-8h2zm14 0v10c0 2.2-1.8 4-4 4s-4-1.8-4-4v-2h2v2c0 1.1.9 2 2 2s2-.9 2-2v-10h-6v10h2v-8h2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 flex items-center justify-center text-lg font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-yellow-500">{testimonial.university}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Event Highlights Section */}
        <section id="events" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Upcoming Events</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Don't miss out on these exciting campus activities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Annual Tech Summit",
                  date: "June 15, 2025",
                  organizer: "Computer Science Club",
                  location: "Main Campus Auditorium",
                  image: "/event-placeholder-1.jpg",
                  attendees: 237
                },
                {
                  title: "Cultural Festival",
                  date: "July 3-5, 2025",
                  organizer: "International Students Association",
                  location: "University Plaza",
                  image: "/event-placeholder-2.jpg",
                  attendees: 540
                },
                {
                  title: "Entrepreneurship Workshop",
                  date: "June 28, 2025",
                  organizer: "Business Club",
                  location: "Wilson Hall, Room 302",
                  image: "/event-placeholder-3.jpg",
                  attendees: 124
                }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-gray-400">Event Image Placeholder</p>
                    </div>
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      {event.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center mb-2">
                      <FaUsers className="text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-300">{event.organizer}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-300">{event.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-500/30 rounded-full px-2 py-1">{event.attendees} attending</span>
                      <button className="text-yellow-500 text-sm font-medium hover:underline">Learn More</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <WrapButton className="bg-transparent text-black font-medium transition duration-300 transform hover:-translate-y-1">
                View All Events
              </WrapButton>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-24 bg-gray-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your <span className="gradient-text">campus experience?</span></h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of students who are discovering new opportunities, making connections, and enhancing their college journey.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <WrapButton className="bg-transparent text-black font-medium px-8 py-4 text-lg transition duration-300 transform hover:-translate-y-1">
                  Get Started Now
                </WrapButton>
                <button className="bg-gray-800 text-white hover:bg-gray-700 font-medium px-8 py-4 rounded-full transition duration-300">
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Watch Demo
                  </div>
                </button>
              </div>
              
              <div className="mt-16 flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-yellow-500">100+</h3>
                  <p className="text-gray-300">Universities</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-yellow-500">5,000+</h3>
                  <p className="text-gray-300">Clubs</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-yellow-500">50,000+</h3>
                  <p className="text-gray-300">Students</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-yellow-500">2,500+</h3>
                  <p className="text-gray-300">Events Monthly</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4">Zynvo</h3>
                <p className="mb-4">Connecting college students through club and society experiences.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">For Club Leaders</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">For Students</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">For Universities</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Support Center</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Community Forum</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">© 2025 Zynvo. All rights reserved.</p>
                <div className="mt-4 md:mt-0">
                  <form className="flex">
                    <input 
                      type="email" 
                      placeholder="Subscribe to our newsletter" 
                      className="px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64"
                    />
                    <button 
                      className="bg-yellow-500 text-black px-4 py-2 rounded-r-lg hover:bg-yellow-400 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}