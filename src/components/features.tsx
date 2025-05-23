import React from 'react';
import { Users, Calendar, BookOpen, Sparkles, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

const ZynvoDashboard = () => {
  const heroref = React.useRef(null);
  return (
   <section 
         ref={heroref} 
         className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
       >
         {/* Background Image - Fixed Correctly */}
         <div className="absolute inset-0 z-0">
           <Image
             src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-14.jpg?updatedAt=1748011606544"
             alt="Hero Background"
             fill
             priority
             className="object-cover"
             sizes="100vw"
           />
           {/* Overlay to improve text readability */}
           <div className="absolute inset-0 bg-black/50"></div>
         </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Main Hero Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2  rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-90">Zynvo</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Your Campus
                <br />
                Connection Hub
              </h1>
              
              <p className="text-purple-100 mb-6">
                Connect with clubs, discover events, and build your campus network
              </p>
              
              {/* Animated orb */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-32 h-32 rounded-full">
                   <img src='/logozynvo.jpg' className='rounded-full'>
                   </img>
                </div>
                <div className="absolute inset-0 w-32 h-32 rounded-full  animate-spin-slow opacity-60"></div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
            </div>
          </div>

          {/* Trial Card */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-2">Effortless</h3>
            <h4 className="text-white font-bold mb-4">Campus Discovery</h4>
            
            <div className="space-y-2 mb-4">
              <div className="text-2xl font-bold text-orange-400">30 days trial</div>
              <div className="text-sm text-slate-400">then - Free forever</div>
            </div>
          </div>

          {/* Stats Card - Active Students */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-orange-400">8.5K</div>
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="text-white font-medium mb-2">active students</div>
            
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-slate-800"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-slate-800"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-slate-800"></div>
              <div className="w-8 h-8 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <span className="text-xs text-white">+</span>
              </div>
            </div>
          </div>

          {/* Events Created */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="text-5xl font-bold text-purple-400 mb-2">142</div>
            <div className="text-white font-medium mb-1">events created</div>
            <div className="text-slate-400 text-sm">this month</div>
          </div>

          {/* Generate Button */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 group">
              <Calendar className="w-5 h-5" />
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Club Discovery */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-white font-bold mb-2">Club discovery</h3>
            <p className="text-slate-400 text-sm mb-4">
              Find and join clubs that match your interests and goals.
            </p>
          </div>

          {/* Network Builder */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-white font-bold mb-2">Network builder</h3>
            <p className="text-slate-400 text-sm mb-4">
              Connect with like-minded students and expand your campus network.
            </p>
          </div>

          {/* Feature Templates */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-2">Campus templates</h3>
            <p className="text-slate-400 text-sm mb-4">
              Use pre-made templates to jumpstart club activities.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-lg">
                30 days trial
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
            <div className="text-white font-medium mb-1">student satisfaction</div>
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ZynvoDashboard;
