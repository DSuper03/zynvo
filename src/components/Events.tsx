import React from 'react';
import { FaUniversity, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import WrapButton from './ui/wrap-button';
import Image from 'next/image';

const Events = () => {
  const heroRef = React.useRef(null);
  return (
    <div>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
      >
        {/* Background Image - Fixed Correctly */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/20250524_1536_LEGO%20College%20Life_remix_01jw0w1w0jfv9am8a3bxcg8erg.png?updatedAt=1748081232078"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
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
                date: 'July 15, 2025',
                organizer: 'Computer Science Club',
                location: 'IIT Delhi Auditorium',
                image:
                  'https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/Gemini_Generated_Image_rsa8rersa8rersa8.png?updatedAt=1748084982775',
                attendees: 237,
              },
              {
                title: 'Cultural Festival',
                date: 'August 3-5, 2025',
                organizer: 'International Students Association',
                location: 'BITS Pilani Plaza',
                image:
                  'https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/Gemini_Generated_Image_bl9cqrbl9cqrbl9c.png?updatedAt=1748084848689',
                attendees: 540,
              },
              {
                title: 'Entrepreneurship Workshop',
                date: 'July 28, 2025',
                organizer: 'Business Club',
                location: 'IIM Bangalore, Room 302',
                image:
                  'https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/Gemini_Generated_Image_ukkdlyukkdlyukkd.png?updatedAt=1748085201113',
                attendees: 124,
              },
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-yellow-500/20 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-800/90 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-gray-400">
                      <Image
                        src={event.image}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </p>
                  </div>
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {event.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {event.title}
                  </h3>
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
                    <span className="text-xs bg-yellow-500/30 text-yellow-100 rounded-full px-2 py-1">
                      {event.attendees} attending
                    </span>
                    <button className="text-yellow-400 text-sm font-medium hover:text-yellow-300 hover:underline">
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
  );
};

export default Events;
