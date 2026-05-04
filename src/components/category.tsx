import React from 'react';
import {
  IconSchool,
  IconTrophy,
  IconPalette,
  IconCpu,
  IconUsersGroup,
  IconDeviceGamepad2,
  IconMusic,
  IconHeartHandshake,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
const Category = () => {
  const heroRef = React.useRef(null);
  return (
    <div>
      {/* Club Categories Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
      >
        {/* Background Image - Fixed Correctly */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-18.jpg?updatedAt=1748011606531"
            alt="Hero Background"
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
              <span className="gradient-text">Discover Clubs</span> By Category
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore diverse communities across your campus
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Academic',
                count: 42,
                icon: <IconSchool size={24} />,
              },
              {
                name: 'Sports',
                count: 37,
                icon: <IconTrophy size={24} />,
              },
              {
                name: 'Arts',
                count: 29,
                icon: <IconPalette size={24} />,
              },
              {
                name: 'Technology',
                count: 31,
                icon: <IconCpu size={24} />,
              },
              {
                name: 'Culture',
                count: 24,
                icon: <IconUsersGroup size={24} />,
              },
              {
                name: 'Gaming',
                count: 19,
                icon: <IconDeviceGamepad2 size={24} />,
              },
              {
                name: 'Music',
                count: 22,
                icon: <IconMusic size={24} />,
              },
              {
                name: 'Volunteering',
                count: 16,
                icon: <IconHeartHandshake size={24} />,
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl p-6 cursor-pointer transition duration-300 bg-black/70 backdrop-blur-sm ring-1 ring-white/10 hover:bg-black/80 hover:ring-yellow-500/40"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 rounded-lg text-yellow-400 bg-white/5 ring-1 ring-white/10 group-hover:text-yellow-300">
                    {category.icon}
                  </div>
                  <span className="text-sm rounded-full px-2 py-1 text-yellow-100 bg-yellow-500/20 group-hover:bg-yellow-500/30">
                    {category.count}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white group-hover:text-yellow-200">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
