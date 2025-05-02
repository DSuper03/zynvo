"use client"
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaUsers, FaComments, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import { features } from '@/constants/Features';

// You'll need to install these packages:
// npm install framer-motion react-icons

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);
  
  useEffect(() => {
    // Animation for background floating elements
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.classList.add('floating-element');
      
      // Random size between 20px and 100px
      const size = Math.random() * 80 + 20;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      
      // Random position
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 100}vh`;
      
      // Random opacity between 0.2 and 0.5 for brighter glow
      element.style.opacity = `${Math.random() * 0.3 + 0.2}`;
      
      // Add to the background container
      //@ts-ignore
      document.querySelector('.background-animation').appendChild(element);
      
      // Animate
      const duration = Math.random() * 50 + 30; // 30-80 seconds
      element.style.animation = `float ${duration}s linear infinite`;
      
      // Remove after some time to prevent too many elements
      setTimeout(() => {
        element.remove();
      }, duration * 1000);
    };
    
    // Create more initial elements for a more vibrant background
    for (let i = 0; i < 15; i++) {
      createFloatingElement();
    }
    
    // Create new elements periodically
    const interval = setInterval(createFloatingElement, 5000);
    
    // Clean up
    return () => clearInterval(interval);
  }, []);
  
  
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <img
      src={'/landing page.png'}
      width={100}
      height={100}
      alt="Zynvo Logo"
      className="absolute top-0 left-0 w-full h-full z-0"
      />
      <Head>
        <title>Zynvo - Connect Through Campus Life</title>
        <meta name="description" content="Zynvo connects college students through club and society experiences" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      
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
        `}</style>

{/* Background Animation Container */}
<div className="background-animation"></div>

{/* Content Container (above animations) */}
<div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">zynvo</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-yellow-400 transition duration-300">Features</a>
              <a href="#how-it-works" className="hover:text-yellow-400 transition duration-300">How It Works</a>
              <a href="#testimonials" className="hover:text-yellow-400 transition duration-300">Testimonials</a>
              <button className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-full hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1">
                Sign Up
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" 
                   strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
                   stroke="currentColor">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4"
                >
                <div className="flex flex-col space-y-4 px-2 py-4 bg-gray-800 rounded-lg">
                  <a href="#features" className="hover:text-yellow-400 transition duration-300">Features</a>
                  <a href="#how-it-works" className="hover:text-yellow-400 transition duration-300">How It Works</a>
                  <a href="#testimonials" className="hover:text-yellow-400 transition duration-300">Testimonials</a>
                  <button className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-full hover:bg-yellow-400 transition duration-300">
                    Sign Up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

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
          </div>
          
          {/* Mockup Image */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="gradient-text">Zynvo</span> Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our platform makes it easy to discover, connect, and engage with campus clubs across institutions.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-500/30"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {[
                  {
                    title: "Create Your Profile",
                    description: "Sign up and tell us about your interests, skills, and club experiences."
                  },
                  {
                    title: "Discover Clubs & Students",
                    description: "Browse clubs across institutions and connect with students who share your passions."
                  },
                  {
                    title: "Join Discussions",
                    description: "Engage in forums and chats about club activities, events, and initiatives."
                  },
                  {
                    title: "Collaborate on Projects",
                    description: "Launch or join cross-campus collaborations between different clubs."
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative flex items-center justify-center"
                  >
                    <div className={`flex w-full items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <div className="w-full md:w-1/2 px-4 py-6">
                        <div className={`bg-gray-800 rounded-lg p-6 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-300">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-black font-bold">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Student <span className="gradient-text">Testimonials</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Hear what students are saying about their experience with Zynvo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Drama Club President, NYU",
                  quote: "Zynvo helped our drama club collaborate with theater groups from three other universities. We're now planning our first joint production!"
                },
                {
                  name: "Maya Patel",
                  role: "Robotics Team, MIT",
                  quote: "Finding other robotics enthusiasts across different schools used to be challenging. Zynvo made it easy to connect and share ideas."
                },
                {
                  name: "Jamal Williams",
                  role: "Student Government, UCLA",
                  quote: "As a student leader, Zynvo has been invaluable for networking with other student governments and sharing best practices."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-yellow-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Decorative Elements - Brighter glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/30 rounded-full blur-3xl"></div>
              <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your <span className="gradient-text">Campus Experience?</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Join thousands of students already connecting through Zynvo and discover a new dimension to campus life.
                </p>
                <button className="px-8 py-3 bg-yellow-500 text-black font-medium rounded-full hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1 shadow-lg">
                  Sign Up Now — It's Free!
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-950">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <span className="text-2xl font-bold gradient-text">zynvo</span>
                <p className="text-gray-400 mt-2">Connecting campus communities.</p>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition duration-300">About</a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition duration-300">Features</a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition duration-300">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition duration-300">Contact</a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© 2025 Zynvo. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}