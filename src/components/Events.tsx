import React from 'react'
import { FaUniversity, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import WrapButton from './ui/wrap-button'


const Events = () => {
  return (
    <div>
       <section id="events" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Upcoming Events</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Don&rsquo;t miss out on these exciting campus activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Annual Tech Summit',
                  date: 'June 15, 2025',
                  organizer: 'Computer Science Club',
                  location: 'Main Campus Auditorium',
                  image: '/event-placeholder-1.jpg',
                  attendees: 237,
                },
                {
                  title: 'Cultural Festival',
                  date: 'July 3-5, 2025',
                  organizer: 'International Students Association',
                  location: 'University Plaza',
                  image: '/event-placeholder-2.jpg',
                  attendees: 540,
                },
                {
                  title: 'Entrepreneurship Workshop',
                  date: 'June 28, 2025',
                  organizer: 'Business Club',
                  location: 'Wilson Hall, Room 302',
                  image: '/event-placeholder-3.jpg',
                  attendees: 124,
                },
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
                      <p className="text-sm text-gray-400">
                        Event Image Placeholder
                      </p>
                    </div>
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      {event.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center mb-2">
                      <FaUsers className="text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-300">
                        {event.organizer}
                      </span>
                    </div>
                    <div className="flex items-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-300">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-500/30 rounded-full px-2 py-1">
                        {event.attendees} attending
                      </span>
                      <button className="text-yellow-500 text-sm font-medium hover:underline">
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/events" className="mt-12 text-center">
              <WrapButton className="bg-transparent text-black font-medium transition duration-300 transform hover:-translate-y-1">
                View All Events
              </WrapButton>
            </Link>
          </div>
        </section>
    </div>
  )
}

export default Events
