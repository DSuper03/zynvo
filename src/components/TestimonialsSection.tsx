"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LandingHeader from './landingHeader';
import { BackgroundElements } from './TeamSection';
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      testimonial: 'This is a great platform for learning and growth. I have learned so much and it has been a game-changer for my career.',
      image: '/testimonials/john-doe.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Jane Smith',
      testimonial: 'I love the community here. Everyone is so supportive and helpful. I have made some great connections.',
      image: '/testimonials/jane-smith.jpg',
      rating: 4
    },
    {
      id: 3,
      name: 'Bob Johnson',
      testimonial: 'Zynvo has exceeded my expectations. The platform is easy to use and the content is top-notch.',
      image: '/testimonials/bob-johnson.jpg',
      rating: 5
    }
  ];

  return (
    <div className="relative">
        <LandingHeader />
        <BackgroundElements />
      <div className="container mx-auto p-4">
        <div className="relative">
          <div className="flex justify-center">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-yellow-500 scale-125'
                    : 'bg-yellow-500/20 hover:bg-yellow-500/50'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-2 rounded-full bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '95%', label: 'Student Satisfaction' },
            { number: '2x', label: 'Club Engagement' },
            { number: '10k+', label: 'Event Participants' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-8 rounded-2xl bg-black/50 backdrop-blur-sm border border-yellow-500/20"
            >
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">{stat.number}</h3>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection; 