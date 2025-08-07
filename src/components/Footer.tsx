import React from 'react';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Mail,
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';

function Footer() {
  const productLinks = [
    'Features',
    'Pricing',
    'Event Management',
    'Club Directory',
    'Member Portal',
    'Analytics Dashboard',
    'Mobile App'
  ];

  const resourceLinks = [
    'Documentation',
    'Community Forum',
    'Video Tutorials',
    'Best Practices',
    'Success Stories'
  ];
  const localData=localStorage.getItem('userData')
  console.log("localData",localData)
  const socialLinks = [
   
    { icon: <Twitter className="h-5 w-5" />, href: "https://x.com/Zynvonow" },

    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/dsuper03" },
   
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_60%)]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info & Newsletter */}
            <div className="col-span-1 sm:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Zynvo
                </h3>
                <p className="mt-4 text-gray-400 text-base leading-relaxed">
                  Empowering college students to connect, collaborate, and create lasting memories through dynamic club and society experiences.
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-yellow-500" />
                    <span>dsuper03.dev@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    <span>New Delhi</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/70 rounded-xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold text-yellow-400">Stay Updated</h4>
                <p className="mt-2 text-gray-400 text-sm">
                  Get the latest updates on events, clubs, and campus activities.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:border-yellow-500"
                  />
                  <button className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            {/* Product Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
                Product
              </h3>
            
            </div>
            {/* Resources & Social */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
                  Resources
                </h3>
                <ul className="mt-4 space-y-2">
                  {resourceLinks.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-yellow-400 transition"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-medium text-yellow-400 mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-yellow-600 transition"
                      aria-label="social-link"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 bg-gray-900/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2025 Zynvo. All rights reserved.</p>
            <div className="mt-2 sm:mt-0 flex space-x-4">
              <a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 bg-gray-900/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center text-xs text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-2" />
            <span>for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

