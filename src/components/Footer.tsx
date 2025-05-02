"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';

const footerLinks = {
  platform: [
    { name: 'About Us', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'API Docs', href: '/docs' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ],
};

const socialLinks = [
  { icon: <FiTwitter size={18} />, href: 'https://twitter.com/zynvo' },
  { icon: <FiInstagram size={18} />, href: 'https://instagram.com/zynvo' },
  { icon: <FiLinkedin size={18} />, href: 'https://linkedin.com/company/zynvo' },
  { icon: <FiGithub size={18} />, href: 'https://github.com/zynvo' },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">Z</span>
              </div>
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Zynvo
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              The ultimate platform for college campus communities to connect, discover events, and engage with clubs.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, color: '#6971f5' }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 2 }}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 2 }}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 2 }}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Subscribe Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-2xl">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Stay updated with the latest features, tips, and campus trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-grow"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Zynvo. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/contact">
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <FiMail className="mr-1" />
                Contact
              </span>
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Made with ❤️ for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;