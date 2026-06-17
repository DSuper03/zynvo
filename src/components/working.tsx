'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import Image from 'next/legacy/image';

// How It Works Section
const HowItWorks = () => {
  const heroref = React.useRef(null);

  return (
    <section
      ref={heroref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-yellow-300 py-12 md:py-32"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl px-2 text-base text-gray-800 sm:text-lg md:text-xl"
          >
            Zync It and connect with your campus life. Follow these simple steps
            to get started:
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[
            {
              step: 1,
              title: 'Create an account',
              description:
                'Sign up using your university email to join the campus network',
              icon: (
                <FaUsers className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />
              ),
            },
            {
              step: 2,
              title: 'Discover clubs',
              description:
                'Browse through clubs and societies based on your interests',
              icon: (
                <FaSearch className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />
              ),
            },
            {
              step: 3,
              title: 'Join activities',
              description:
                'Connect with club members and participate in events',
              icon: (
                <FaCalendarAlt className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />
              ),
            },
            {
              step: 4,
              title: 'Build your network',
              description:
                'Expand your university experience through meaningful connections',
              icon: (
                <FaRocket className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex flex-col items-center rounded-xl border border-yellow-500/40 bg-yellow-100 p-4 text-center transition-all duration-300 sm:p-6"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-500 bg-yellow-200 shadow-lg shadow-yellow-500/20 sm:mb-4 sm:h-16 sm:w-16">
                <span className="text-lg font-bold sm:text-xl">
                  {item.step}
                </span>
              </div>
              {item.icon}
              <h3 className="mb-2 px-2 text-lg font-semibold sm:mb-3 sm:text-xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-800 sm:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
