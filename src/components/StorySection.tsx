'use client';

import { motion } from 'framer-motion';
import { BackgroundElements } from './TeamSection';
import LandingHeader from './landingHeader';
const timeline = [
  {
    year: '2024',
    title: 'The Beginning',
    description:
      'Born from a shared frustration with fragmented campus communication, three college students came together with a vision to revolutionize how campus communities connect.',
    // image: '/story/inception.webp',
    milestone: 'First line of code written for Zynvo',
  },
  {
    year: '2025',
    title: 'Launch & Growth',
    description:
      'Zynvo launches with its core features - event discovery, club management, and campus-wide networking. The platform quickly gains traction across multiple colleges.',
    // image: '/story/launch.webp',
    milestone: 'Successfully connected 1000+ students',
  },
  {
    year: 'Vision',
    title: 'The Road Ahead',
    description:
      "We're building the future of campus engagement, where every student can easily discover opportunities, connect with peers, and make their college experience truly memorable.",
    // image: '/story/future.webp',
    milestone: 'Expanding to colleges nationwide',
  },
];

const StorySection = () => {
  return (
    <div className="min-h-screen bg-black">
      <LandingHeader />
      <BackgroundElements />
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15),transparent)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Story
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            The journey of building the future of campus communities
          </motion.p>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-yellow-500/50 via-yellow-500/20 to-transparent" />

          {/* Timeline Items */}
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative mb-32 last:mb-0"
            >
              {/* Year Marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-black font-bold">{item.year}</span>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div
                  className={`flex flex-col justify-center ${
                    index % 2 === 0
                      ? 'lg:text-right lg:items-end'
                      : 'lg:text-left lg:items-start'
                  }`}
                >
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-lg">
                    {item.description}
                  </p>
                  <div className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 text-sm border border-yellow-500/20">
                    {item.milestone}
                  </div>
                </div>

                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-64 lg:h-96 rounded-2xl overflow-hidden"
                >
                  {/* <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're on a mission to transform how college communities connect,
            share, and grow together. By breaking down communication barriers
            and creating seamless digital experiences, we're making campus life
            more engaging, inclusive, and memorable for every student.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '1000+', label: 'Students Connected' },
            { number: '50+', label: 'Campus Events' },
            { number: '20+', label: 'Active Clubs' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-8 rounded-2xl bg-black/50 backdrop-blur-sm border border-yellow-500/20"
            >
              <h3 className="text-4xl font-bold text-yellow-500 mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorySection;
