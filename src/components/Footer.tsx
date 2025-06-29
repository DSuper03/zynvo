import React from 'react';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4">
                  Zynvo
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  Empowering college students to connect, collaborate, and create lasting memories through dynamic club and society experiences across campuses.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="h-5 w-5 text-yellow-500" />
                    <span>dsuper03.dev@gmail.com</span>
                  </div>
                
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    <span>New Delhi</span>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold text-yellow-400 mb-3">
                  Stay Updated
                </h4>
                <p className="text-gray-400 mb-4">
                  Get the latest updates on events, clubs, and campus activities.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center space-x-2">
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
                Product
              </h3>
              <ul className="space-y-3">
                {[
                  'Features',
                  'Pricing',
                  'Event Management',
                  'Club Directory',
                  'Member Portal',
                  'Analytics Dashboard',
                  'Mobile App'
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Support */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  'Documentation',
                
                  
                  'Community Forum',
                  'Video Tutorials',
                  'Best Practices',
                  'Success Stories'
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div className="pt-4">
                <h4 className="text-lg font-medium text-yellow-400 mb-4">
                  Connect With Us
                </h4>
                <div className="flex space-x-3">
                  {[
                    { icon: <Facebook className="h-5 w-5" />, href: "#" },
                    { icon: <Twitter className="h-5 w-5" />, href: "#" },
                    { icon: <Instagram className="h-5 w-5" />, href: "#" },
                    { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                    { icon: <Github className="h-5 w-5" />, href: "#" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-gray-400">Active Clubs</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">10K+</div>
                <div className="text-gray-400">Students Connected</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-400">50+</div>
                <div className="text-gray-400">Universities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 bg-gray-900/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-gray-400">
                  © 2025 Zynvo. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>for students everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

