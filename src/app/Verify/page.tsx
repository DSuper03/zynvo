"use client"

import React from 'react';

export default function ZynvoLanding() {

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Diagonal moving lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-20 animate-pulse transform -rotate-45"
               style={{
                 left: '10%',
                 animationDuration: '3s',
                 animationDelay: '0s'
               }}></div>
          <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-yellow-300 to-transparent opacity-30 animate-pulse transform -rotate-45"
               style={{
                 left: '25%',
                 animationDuration: '4s',
                 animationDelay: '1s'
               }}></div>
          <div className="absolute w-3 h-full bg-gradient-to-b from-transparent via-yellow-500 to-transparent opacity-15 animate-pulse transform -rotate-45"
               style={{
                 left: '40%',
                 animationDuration: '5s',
                 animationDelay: '2s'
               }}></div>
          <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-25 animate-pulse transform -rotate-45"
               style={{
                 left: '60%',
                 animationDuration: '3.5s',
                 animationDelay: '0.5s'
               }}></div>
          <div className="absolute w-2 h-full bg-gradient-to-b from-transparent via-yellow-300 to-transparent opacity-20 animate-pulse transform -rotate-45"
               style={{
                 left: '80%',
                 animationDuration: '4.5s',
                 animationDelay: '1.5s'
               }}></div>
        </div>
        
        {/* Floating hexagons */}
        <div className="absolute w-20 h-20 opacity-10 animate-bounce transform rotate-12"
             style={{
               top: '15%',
               left: '15%',
               animationDuration: '6s',
               animationDelay: '0s',
               clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
               backgroundColor: '#fbbf24'
             }}></div>
        <div className="absolute w-16 h-16 opacity-15 animate-bounce transform -rotate-12"
             style={{
               top: '70%',
               right: '20%',
               animationDuration: '8s',
               animationDelay: '2s',
               clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
               backgroundColor: '#fcd34d'
             }}></div>
        <div className="absolute w-12 h-12 opacity-20 animate-bounce transform rotate-45"
             style={{
               bottom: '25%',
               left: '25%',
               animationDuration: '7s',
               animationDelay: '1s',
               clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
               backgroundColor: '#f59e0b'
             }}></div>
        
        {/* Orbiting dots */}
        <div className="absolute w-4 h-4 bg-yellow-400 rounded-full opacity-30"
             style={{
               top: '20%',
               right: '30%',
               animation: 'spin 10s linear infinite'
             }}>
          <div className="absolute w-2 h-2 bg-yellow-300 rounded-full"
               style={{
                 top: '-20px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 animation: 'spin 10s linear infinite reverse'
               }}></div>
        </div>
        <div className="absolute w-3 h-3 bg-yellow-500 rounded-full opacity-25"
             style={{
               bottom: '30%',
               right: '15%',
               animation: 'spin 15s linear infinite reverse'
             }}>
          <div className="absolute w-1 h-1 bg-yellow-400 rounded-full"
               style={{
                 top: '-15px',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 animation: 'spin 15s linear infinite'
               }}></div>
        </div>
        
        {/* Pulsing triangles */}
        <div className="absolute w-0 h-0 opacity-15 animate-pulse"
             style={{
               top: '40%',
               left: '10%',
               borderLeft: '15px solid transparent',
               borderRight: '15px solid transparent',
               borderBottom: '25px solid #fbbf24',
               animationDuration: '4s'
             }}></div>
        <div className="absolute w-0 h-0 opacity-20 animate-pulse"
             style={{
               top: '60%',
               right: '40%',
               borderLeft: '12px solid transparent',
               borderRight: '12px solid transparent',
               borderTop: '20px solid #fcd34d',
               animationDuration: '5s',
               animationDelay: '1s'
             }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Main Heading */}
        <h1 className="text-8xl md:text-9xl font-black text-yellow-400 mb-4 tracking-tight">
          Zynvo.
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-16 opacity-90 animate-pulse">
          Just Zynvo It
        </h2>

        {/* Verification Section */}
        <div className="flex items-center justify-center space-x-6">
          {/* Check Circle */}
          
          
          {/* Verification Text */}
          <div className='flex flex-col'>
            <div className='flex text-center items-center justify-center gap-4'>
                <div className="w-16 h-16 bg-black rounded-full border-4 border-yellow-400 flex items-center justify-center animate-pulse">
            <svg 
              className="w-8 h-8 text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-yellow-400">
            Get yourself verified
          </div>
            </div>
          
          <div className='text-xl text-yellow-400 mt-3 font-semibold'>
            You have recieved a verification mail from Dsuper03 on your registered email id. Check the spam folder as well. It may take some time.The Link is valid for 24 Hours only.
          </div>
          </div>
         
        </div>
      </div>

      {/* Additional animated elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}