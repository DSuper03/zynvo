"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { features } from '@/constants/Features';

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  // Different card designs based on variant
  const renderCard = () => {
    switch (feature.variant) {
      case 'primary':
        return (
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.accentColor} ${feature.height} flex flex-col`}>
            {/* Background image with overlay */}
            <div className="absolute inset-0 opacity-20">
              <Image
                src={feature.background}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6 flex flex-col h-full z-10 relative">
              {/* Icon */}
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-4">
                <feature.Icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{feature.name}</h3>
              <p className="text-white/80 mb-6 flex-grow">{feature.description}</p>
              
              <Link href={feature.href} className="mt-auto">
                <span className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-colors inline-block">
                  {feature.cta}
                </span>
              </Link>
            </div>
          </div>
        );
        
      case 'secondary':
        return (
          <div className={`relative overflow-hidden rounded-2xl ${feature.height} border border-yellow-500/30 bg-black/50 backdrop-blur-sm`}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{feature.name}</h3>
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-2 rounded-lg">
                  <feature.Icon className="h-5 w-5 text-black" />
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-4">{feature.description}</p>
              
              <Link href={feature.href} className="text-yellow-400 flex items-center text-sm font-medium hover:text-yellow-300 transition-colors mt-auto">
                {feature.cta}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        );
        
      case 'tertiary':
        return (
          <div className={`relative overflow-hidden rounded-2xl ${feature.height} bg-gradient-to-br ${feature.accentColor}`}>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
              <Image
                src={feature.background}
                alt=""
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            
            <div className="p-6 flex flex-col h-full">
              <feature.Icon className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-white/80 text-sm mb-4">{feature.description}</p>
              
              <Link href={feature.href} className="mt-auto">
                <span className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm hover:bg-black/40 transition-colors inline-block">
                  {feature.cta}
                </span>
              </Link>
            </div>
          </div>
        );
        
      case 'highlight':
        return (
          <div className={`relative overflow-hidden rounded-2xl ${feature.height} border-2 border-dashed border-rose-500/50 bg-gray-900`}>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-30">
              <Image
                src={feature.background}
                alt=""
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="bg-rose-500/20 p-2 rounded-lg mr-3">
                  <feature.Icon className="h-5 w-5 text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.name}</h3>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
              
              <Link href={feature.href} className="mt-auto">
                <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition-opacity inline-block">
                  {feature.cta}
                </span>
              </Link>
            </div>
          </div>
        );
        
      case 'bordered':
        return (
          <div className={`relative overflow-hidden rounded-2xl ${feature.height} bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            
            <div className="p-6 flex flex-col h-full">
              <feature.Icon className="h-6 w-6 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              
              <div className="mt-auto">
                <Link href={feature.href}>
                  <span className="inline-block border border-cyan-500/50 text-cyan-400 px-5 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm font-medium">
                    {feature.cta}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className={`relative overflow-hidden rounded-2xl bg-gray-800 ${feature.height}`}>
            <div className="p-6">
              <feature.Icon className="h-6 w-6 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <Link href={feature.href} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                {feature.cta}
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={feature.className}
    >
      {renderCard()}
    </motion.div>
  );
};

export default function FeatureGrid() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-white mb-12">Discover What Zynvo Offers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
        {features.map((feature, index) => (
          <FeatureCard key={feature.name} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
}