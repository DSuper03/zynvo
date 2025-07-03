import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaCalendarAlt, FaRocket } from 'react-icons/fa';
import Image from 'next/image';

// How It Works Section
const HowItWorks = () => {
  const heroref = React.useRef(null);
  return (
    <section
      ref={heroref}
      className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
    >
      {/* Background Image - Fixed Correctly */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/20250520_1731_LEGO%20College%20Festivities_simple_compose_01jvps0810emxrm5zr3tre0vas%20(1).png?updatedAt=1748011509153"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
           Zync It  and connect with your campus life. Follow these simple steps to get started:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: 1,
              title: 'Create an account',
              description:
                'Sign up using your university email to join the campus network',
              icon: <FaUsers className="text-yellow-500 text-3xl mb-4" />,
            },
            {
              step: 2,
              title: 'Discover clubs',
              description:
                'Browse through clubs and societies based on your interests',
              icon: <FaSearch className="text-yellow-500 text-3xl mb-4" />,
            },
            {
              step: 3,
              title: 'Join activities',
              description:
                'Connect with club members and participate in events',
              icon: <FaCalendarAlt className="text-yellow-500 text-3xl mb-4" />,
            },
            {
              step: 4,
              title: 'Build your network',
              description:
                'Expand your university experience through meaningful connections',
              icon: <FaRocket className="text-yellow-500 text-3xl mb-4" />,
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
  );
};

export default HowItWorks;
