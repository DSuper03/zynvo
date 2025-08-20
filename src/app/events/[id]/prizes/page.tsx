'use client';
import React from 'react';
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaGift,
  FaArrowRight,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PrizePage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      {/* Main Prize Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
            Epic Prizes
          </h1>
          <p className="text-gray-300 text-xl">Win big at MoodX 2025!</p>
        </div>

        {/* Featured prize categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {/* First Prize */}
          <motion.div
            variants={itemVariants}
            className="bg-black border-2 border-yellow-400 rounded-xl overflow-hidden transform transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            <div className="bg-yellow-400 p-4 flex justify-between items-center">
              <h2 className="font-bold text-2xl text-black">First Place</h2>
              <FaTrophy size={30} className="text-black" />
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-white mb-3">$5,000</div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                  Industry mentorship opportunities
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                  Pro developer tools access
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                  Feature in campus tech journal
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                  Exclusive MoodX champion merch
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 px-4 rounded-lg w-full flex justify-center items-center space-x-2 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300">
                <span>Claim Your Glory</span>
                <FaArrowRight />
              </Button>
            </div>
          </motion.div>

          {/* Second Prize */}
          <motion.div
            variants={itemVariants}
            className="bg-black border-2 border-yellow-500/60 rounded-xl overflow-hidden transform transition-all hover:scale-105 shadow-lg"
          >
            <div className="bg-yellow-500/70 p-4 flex justify-between items-center">
              <h2 className="font-bold text-2xl text-black">Second Place</h2>
              <FaMedal size={28} className="text-black" />
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-white mb-3">$2,500</div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500/70 rounded-full mr-2"></span>
                  Development software licenses
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500/70 rounded-full mr-2"></span>
                  Tech company tour and lunch
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500/70 rounded-full mr-2"></span>
                  Limited edition MoodX gear
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500/70 rounded-full mr-2"></span>
                  Startup accelerator fast track
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <Button className="bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 text-black font-semibold py-2 px-4 rounded-lg w-full flex justify-center items-center space-x-2 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300">
                <span>Silver Status</span>
                <FaArrowRight />
              </Button>
            </div>
          </motion.div>

          {/* Third Prize */}
          <motion.div
            variants={itemVariants}
            className="bg-black border-2 border-yellow-600/40 rounded-xl overflow-hidden transform transition-all hover:scale-105 shadow-lg"
          >
            <div className="bg-yellow-600/50 p-4 flex justify-between items-center">
              <h2 className="font-bold text-2xl text-black">Third Place</h2>
              <FaAward size={28} className="text-black" />
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-white mb-3">$1,000</div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-600/50 rounded-full mr-2"></span>
                  Cloud credits package
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-600/50 rounded-full mr-2"></span>
                  MoodX finalist recognition
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-600/50 rounded-full mr-2"></span>
                  College tech fair booth
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-600/50 rounded-full mr-2"></span>
                  Access to premium workshops
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6">
              <Button className="bg-gradient-to-r from-yellow-600/60 to-yellow-700/60 text-black font-semibold py-2 px-4 rounded-lg w-full flex justify-center items-center space-x-2 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
                <span>Bronze Contender</span>
                <FaArrowRight />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Special Prizes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
            Special Recognition Awards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Innovative */}
            <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start">
              <div className="bg-yellow-400 rounded-full p-3 mr-4">
                <FaGift size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">
                  Most Innovative Concept
                </h3>
                <p className="text-gray-300 mt-1">
                  A special prize for the team that pushes technological
                  boundaries. Includes $500 and innovation lab access.
                </p>
              </div>
            </div>

            {/* Best Design */}
            <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start">
              <div className="bg-yellow-400 rounded-full p-3 mr-4">
                <FaGift size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">
                  Best UX/UI Design
                </h3>
                <p className="text-gray-300 mt-1">
                  Awarded to the most intuitive and aesthetically pleasing user
                  experience. $500 prize with design consultation package.
                </p>
              </div>
            </div>

            {/* Best Freshman Team */}
            <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start">
              <div className="bg-yellow-400 rounded-full p-3 mr-4">
                <FaGift size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">
                  Freshman Breakthrough
                </h3>
                <p className="text-gray-300 mt-1">
                  For outstanding teams made entirely of first-year students.
                  $300 prize and special campus recognition.
                </p>
              </div>
            </div>

            {/* Community Impact */}
            <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start">
              <div className="bg-yellow-400 rounded-full p-3 mr-4">
                <FaGift size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">
                  Campus Impact Award
                </h3>
                <p className="text-gray-300 mt-1">
                  For solutions addressing real campus problems. $500 prize with
                  opportunity to implement at partner institutions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prize FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-black border-2 border-yellow-500/30 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Prize FAQ</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white mb-2">
                When will prizes be distributed?
              </h3>
              <p className="text-gray-300">
                Prizes will be awarded during the closing ceremony on May 12th.
                All team members must be present to receive their prizes.
              </p>
            </div>

            <div className="border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white mb-2">
                How are winners selected?
              </h3>
              <p className="text-gray-300">
                Projects will be judged by a panel of industry experts and
                faculty based on innovation, technical difficulty, design, and
                presentation.
              </p>
            </div>

            <div className="border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white mb-2">
                Can teams win multiple prizes?
              </h3>
              <p className="text-gray-300">
                Yes! Teams can win one placement prize (1st, 2nd, 3rd) plus any
                number of special recognition awards.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">
                What happens in case of a tie?
              </h3>
              <p className="text-gray-300">
                In case of a tie, judges will deliberate and may split prizes or
                award additional recognition as appropriate.
              </p>
            </div>
          </div>

          <Button className="mt-6 bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition duration-300 flex items-center justify-center space-x-2 w-full md:w-auto">
            <span>Download Contest Rules</span>
            <FaArrowRight />
          </Button>
        </motion.div>
      </div>

      {/* Visual elements */}
      <div className="fixed top-1/4 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-1/3 left-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
