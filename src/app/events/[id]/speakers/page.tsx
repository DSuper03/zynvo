'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin, FaTwitter, FaGithub, FaMicrophone, FaGavel } from 'react-icons/fa'
import Image from 'next/image';

const Speakers = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Speaker data
  const speakers = [
    {
      id: 1,
      name: "Anirban Ghosh",
      role: "Technology Lead",
      image: "https://i.pravatar.cc/300?img=11",
      bio: "Anirban is a technology entrepreneur and developer with expertise in AI and machine learning. With multiple successful startups under his belt, he brings practical insights on scaling tech solutions and navigating the innovation landscape.",
      tags: ["AI/ML", "Entrepreneurship", "Web3"],
      type: "speaker",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      id: 2,
      name: "Swarnendu Ghosh",
      role: "Product Design Expert",
      image: "https://i.pravatar.cc/300?img=12",
      bio: "Swarnendu specializes in product design and user experience. His background spans across multiple industries, helping teams create intuitive and engaging digital products. He focuses on the intersection of design thinking and technical implementation.",
      tags: ["UX/UI", "Product Strategy", "Design Systems"],
      type: "speaker",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      id: 3,
      name: "Mohak Chakraborty",
      role: "Innovation Specialist",
      image: "https://i.pravatar.cc/300?img=13",
      bio: "Mohak has led innovation initiatives at several tech companies. His expertise in emerging technologies and digital transformation helps teams approach problems with fresh perspectives. He regularly mentors student startups and hackathon teams.",
      tags: ["Innovation", "Emerging Tech", "Mentorship"],
      type: "speaker",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      id: 4,
      name: "Dr. Sarah Wilson",
      role: "Head Judge",
      image: "https://i.pravatar.cc/300?img=1",
      bio: "Dr. Wilson leads our judging panel with her extensive background in computer science and entrepreneurship. As department chair at Tech University, she brings academic rigor and industry connections to evaluate submissions.",
      tags: ["Computer Science", "Academic", "Entrepreneurship"],
      type: "judge",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 5,
      name: "Jay Park",
      role: "Industry Judge",
      image: "https://i.pravatar.cc/300?img=3",
      bio: "As CTO of TechVentures, Jay evaluates projects from a commercial viability perspective. His background in scaling startups makes him keenly aware of what takes an idea from concept to market success.",
      tags: ["Startup", "Investment", "Scaling"],
      type: "judge",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Speakers & Judges</h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Learn from industry experts and get your projects evaluated by our distinguished panel of judges.
          </p>
        </motion.div>

        {/* Speakers Section */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center mr-4">
              <FaMicrophone className="text-black text-lg" />
            </div>
            <h2 className="text-3xl font-bold text-white">Featured Speakers</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {speakers.filter(person => person.type === "speaker").map((speaker) => (
              <motion.div 
                key={speaker.id}
                variants={itemVariants}
                className="bg-black border-2 border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-500 group"
              >
                <div className="h-56 relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/10 transition-all duration-500"></div>
                  <Image 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{speaker.name}</h3>
                  <p className="text-yellow-400 font-medium mb-4">{speaker.role}</p>
                  
                  <p className="text-gray-300 mb-4">{speaker.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {speaker.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-800 text-yellow-400 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <a href={speaker.social.linkedin} className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                      <FaLinkedin />
                    </a>
                    <a href={speaker.social.twitter} className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                      <FaTwitter />
                    </a>
                    <a href={speaker.social.github} className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                      <FaGithub />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Judges Section */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center mr-4">
              <FaGavel className="text-black text-lg" />
            </div>
            <h2 className="text-3xl font-bold text-white">Expert Judges</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {speakers.filter(person => person.type === "judge").map((judge) => (
              <motion.div 
                key={judge.id}
                variants={itemVariants}
                className="bg-black border-2 border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-500 flex flex-col md:flex-row group"
              >
                <div className="md:w-1/3 h-56 md:h-auto relative">
                  <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/10 transition-all duration-500"></div>
                  <Image 
                    src={judge.image} 
                    alt={judge.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-white mb-1">{judge.name}</h3>
                  <p className="text-yellow-400 font-medium mb-3">{judge.role}</p>
                  
                  <p className="text-gray-300 mb-4 text-sm">{judge.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {judge.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-800 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <a href={judge.social.linkedin} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                      <FaLinkedin />
                    </a>
                    <a href={judge.social.twitter} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-r from-gray-900 to-black border-2 border-yellow-500/30 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Want to speak at future events?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for industry experts and thought leaders to share their knowledge with our community.
          </p>
          <button className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-1">
            Apply as Speaker
          </button>
        </motion.section>
      </div>

      {/* Visual elements */}
      <div className="fixed top-1/3 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-1/4 left-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
    </div>
  )
}

export default Speakers