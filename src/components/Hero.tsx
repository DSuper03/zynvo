import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import WrapButton from './ui/wrap-button'
import Link from 'next/link'
import HeroVideoDialog from './magicui/hero-video-dialog'
import Image from 'next/image'

const Hero = () => {
  const heroRef = useRef(null)
  
  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
    >
      {/* Background Image - Fixed Correctly */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing page.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Hero Title - Adding this since it seems to be missing */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
        >
          Connect With Campus Life
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-300"
        >
          Zynvo bridges the gap between college clubs and societies,
          creating a vibrant network for students across institutions.
        </motion.p>
        
        <Link
          href="/auth/signup"
          className="flex justify-center gap-4 mb-10"
        >
          <WrapButton className="bg-yellow-500 text-black font-medium transition duration-300 transform hover:-translate-y-1">
            Get Started
          </WrapButton>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-2xl p-2">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.example.com/dummy-video"
              thumbnailSrc="https://www.example.com/dummy-thumbnail.png"
              thumbnailAlt="Dummy Video Thumbnail"
            />
          </div>

          {/* Decorative Elements - Enhanced brightness */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/40 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500/40 rounded-full blur-xl"></div>
          <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
