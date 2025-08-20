import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import Image from "next/legacy/image";

// How It Works Section
const HowItWorks = () => {
  const heroref = React.useRef(null);
  
  return (
    <section
      ref={heroref}
      className="relative min-h-screen flex items-center justify-center py-12 md:py-32 overflow-hidden"
    >
      {/* Background Image - Fixed Correctly */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/20250520_1731_LEGO%20College%20Festivities_simple_compose_01jvps0810emxrm5zr3tre0vas%20(1).png?updatedAt=1748011509153"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk6TqX6HbZ8SR5Ikbq63UJSDnJYb5tBp3TWIDUuek5JpWv/EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8Af//Z"
        />
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
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
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2"
          >
            Zync It and connect with your campus life. Follow these simple steps to get started:
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            {
              step: 1,
              title: 'Create an account',
              description:
                'Sign up using your university email to join the campus network',
              icon: <FaUsers className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />,
            },
            {
              step: 2,
              title: 'Discover clubs',
              description:
                'Browse through clubs and societies based on your interests',
              icon: <FaSearch className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />,
            },
            {
              step: 3,
              title: 'Join activities',
              description:
                'Connect with club members and participate in events',
              icon: <FaCalendarAlt className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />,
            },
            {
              step: 4,
              title: 'Build your network',
              description:
                'Expand your university experience through meaningful connections',
              icon: <FaRocket className="text-yellow-500 text-2xl sm:text-3xl mb-3 sm:mb-4" />,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-center text-center p-4 sm:p-6 bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-800 flex items-center justify-center mb-3 sm:mb-4 border-2 border-yellow-500 shadow-lg shadow-yellow-500/10">
                <span className="text-lg sm:text-xl font-bold">{item.step}</span>
              </div>
              {item.icon}
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 px-2">{item.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;