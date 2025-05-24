'use client'
import React from 'react'
import { motion } from 'framer-motion'

import Image from 'next/image'
const Testimonials = () => {
  return (
    <div>
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
                  name: 'Alex Johnson',
                  role: 'President, Tech Club',
                  university: 'Stanford University',
                  quote:
                    "Zynvo helped us increase our membership by 300% in just one semester. The platform's event management tools saved us countless hours of work.",
                  image: '/student1.png',
                },
                {
                  name: 'Mira Patel',
                  role: 'Member, Dance Society',
                  university: 'UCLA',
                  quote:
                    'I found my passion for dance through Zynvo. The platform made it easy to discover events and connect with other dance enthusiasts.',
                  image: '/student2.png',
                },
                {
                  name: 'James Wilson',
                  role: 'Organizer, Debate Club',
                  university: 'MIT',
                  quote:
                    'Coordinating with other universities for debate competitions was a nightmare before Zynvo. Now we can seamlessly organize inter-college events.',
                  image: '/student3.png',
                },
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
                  <p className="text-gray-300 mb-6">
                    &rdquo;{testimonial.quote}&#34;
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-yellow-500/20 mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-yellow-500">
                        {testimonial.university}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
    </div>
  )
}

export default Testimonials
