'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LandingHeader from './landingHeader';

const founders = [
  {
    name: "Anirban Ghosh",
    role: "CEO & Founder",
    image: "/founders/ceoimage.webp",
    github: "https://github.com/kekubhai",
    twitter: "onirbanhere",
    linkedin: "anirban-ghosh010",
    website: "https://onirban.netlify.app/",
    bio: `A visionary second-year tech enthusiast who's revolutionizing the college community landscape. As the mastermind behind Zynvo, Anirban brings his deep passion for innovation and community building to the forefront. His impressive portfolio, including projects like TempoFlow and Algo-Prep, demonstrates his ability to create impactful solutions. With a keen eye for user experience and a deep understanding of modern web technologies, he's leading Zynvo's mission to transform how college students connect and engage with campus activities. His experience in building platforms like BeatNest and OrbitX showcases his versatility in creating engaging user experiences. Anirban's commitment to innovation is evident in his approach to combining technology with community building, making him the perfect leader to guide Zynvo's vision of revolutionizing campus engagement.`,
    quote: "Building the future of campus communities, one connection at a time.",
    skills: ["Full Stack Development", "UI/UX Design", "Community Building", "Product Strategy"]
  },
  {
    name: "Mohak Chakraborty",
    role: "COO",
    image: "/founders/COOImage.jpg",
    github: "https://github.com/mohakchakraborty2004",
    twitter: "I_Mohak19",
    linkedin: "mohak-chakraborty",
    website: "mochak.vercel.app",

    bio: "A driven builder and innovator who lives by the philosophy of Kaizen - continuous improvement. With impressive projects like CodexAI and Tasuku under his belt, Mohak brings his expertise in blockchain and AI to optimize Zynvo's operations and growth strategies.",
    quote: "Kaizen. I BUILD, bitch.",
    skills: ["Operations", "Blockchain", "AI Integration", "Growth Strategy"]
  },
  {
    name: "Swarnendu Ghosh",
    role: "CTO",
    image: "/founders/CTO.webp",
    github: "https://github.com/SwarnenduG07",
    twitter: "Swarnendug07",
    linkedin: "swarnendug07",
    website: "https://swarnendu.me",
    bio: "A technical powerhouse with expertise in building scalable applications like Prigen, Steel SDK  Builder and MarketFusionX Trading exchange, bringing robust engineering practices and innovative solutions to Zynvo's technology infrastructure.",
    quote: "Crafting the future through code.",
    skills: ["System Architecture", "Web3", "AI","Innovation"]
  }
];

const SocialIcons = {
  Github: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  Twitter: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Portfolio: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>
  ),
};

export const BackgroundElements = () => (
  <>
    {/* Animated gradient background */}
    <div className="fixed inset-0 bg-black -z-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-purple-500/5 to-blue-500/10 animate-gradient" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(255,215,0,0.1),transparent)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_500px_at_80%_80%,rgba(147,51,234,0.1),transparent)]" />
      </div>

      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-yellow-500/20"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,0.8))]" />
    </div>
  </>
);

const TeamSection = () => {
  const [activeFounder, setActiveFounder] = useState(0);

  return (
    
    <div className="min-h-screen relative">
      <BackgroundElements />
      <LandingHeader />

      {/* Hero Section with enhanced styling */}
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
            The Founders
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Visionaries shaping the future of campus communities
          </motion.p>
        </motion.div>
      </div>

      {/* Team Navigation with glass effect */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-wrap justify-center gap-12 mb-20">
          {founders.map((founder, index) => (
            <motion.button
              key={founder.name}
              onClick={() => setActiveFounder(index)}
              className={`relative group ${activeFounder === index ? 'scale-110' : ''}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-opacity" />
                <div className="absolute inset-0 ring-2 ring-yellow-500/20 group-hover:ring-yellow-500/50 transition-all" />
              </div>
              <div className={`mt-4 text-center ${
                activeFounder === index ? 'text-yellow-500' : 'text-gray-400'
              } group-hover:text-yellow-500 transition-colors`}>
                <p className="font-medium text-lg">{founder.name}</p>
                <p className="text-sm opacity-80">{founder.role}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Founder details with glass morphism */}
        <motion.div
          key={activeFounder}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden group">
            <Image
              src={founders[activeFounder].image}
              alt={founders[activeFounder].name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <div className="text-white space-y-2">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200">
                  {founders[activeFounder].name}
                </p>
                <p className="text-yellow-500 text-xl">{founders[activeFounder].role}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-yellow-500/10">
            <motion.blockquote 
              className="text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 font-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              "{founders[activeFounder].quote}"
            </motion.blockquote>

            <motion.p 
              className="text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {founders[activeFounder].bio}
            </motion.p>

            <div className="space-y-4">
              <h3 className="text-white text-xl">Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {founders[activeFounder].skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 text-sm border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Social Links with enhanced hover effects */}
            <div className="flex flex-wrap gap-6 pt-4">
              {founders[activeFounder].github && (
                <Link
                  href={founders[activeFounder].github}
                  target="_blank"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  title="GitHub"
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <SocialIcons.Github />
                  </motion.div>
                </Link>
              )}
              
              {founders[activeFounder].twitter && (
                <Link
                  href={`https://twitter.com/${founders[activeFounder].twitter}`}
                  target="_blank"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  title="Twitter"
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <SocialIcons.Twitter />
                  </motion.div>
                </Link>
              )}

              {founders[activeFounder].linkedin && (
                <Link
                  href={`https://linkedin.com/in/${founders[activeFounder].linkedin}`}
                  target="_blank"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  title="LinkedIn"
                >
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <SocialIcons.LinkedIn />
                  </motion.div>
                </Link>
              )}

              {(founders[activeFounder].website) && (
                <Link
                  href={founders[activeFounder].website || '#'}
                  target="_blank"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  title="Website"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative group"
                  >
                    <SocialIcons.Portfolio />
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {founders[activeFounder].website ? 'Website' : 'Portfolio'}
                    </span>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default TeamSection;