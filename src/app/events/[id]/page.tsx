import React from 'react';

const Eventid = () => {
  return (
    <div className="min-h-screen bg-black text-white py-8 px-2 md:px-6">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side content */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-2xl overflow-hidden bg-gray-900/80 border border-yellow-500/20 shadow-lg flex flex-col min-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
                MoodX Event 2025
              </h1>
              <p className="text-black/80 mt-2 font-medium">
                The Ultimate Student Developer Experience
              </p>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                About This Event
              </h2>
              <div className="mb-6">
                <p className="text-gray-200 bg-black/60 p-4 rounded-lg text-justify">
                  We’re three passionate devs who believe in the power of
                  community and code. MoodX is our mission to energize and
                  connect student minds through creativity, collaboration, and
                  chaos (the good kind). Built by students, for students — this
                  isn’t just an event, it’s a movement.
                  <br />
                  <br />
                  Our goal? Empower the next generation of thinkers and builders
                  with the tools, challenges, and vibes that define Gen-Z.
                  Whether you're into AI, art, activism or all of the above —
                  you’ll find your tribe here. We’re building a space that’s
                  less formal, more phenomenal. So bring your ideas, your code,
                  and your chaos.
                </p>
              </div>
              <div className="mt-auto">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition duration-300 shadow-lg w-full md:w-auto">
                  Register Now 🚀
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Event Poster */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full max-w-md aspect-[3/4] rounded-2xl bg-gradient-to-br from-yellow-500/80 to-yellow-700/90 border-4 border-yellow-400 shadow-2xl flex items-center justify-center overflow-hidden relative">
            {/* Placeholder for event poster image */}
            <span className="absolute inset-0 flex flex-col items-center justify-center text-black/60">
              <svg
                className="w-24 h-24 mb-4 opacity-30"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 48 48"
              >
                <rect
                  x="8"
                  y="8"
                  width="32"
                  height="32"
                  rx="6"
                  stroke="currentColor"
                />
                <circle cx="24" cy="20" r="6" stroke="currentColor" />
                <path d="M8 36l8-8 8 8 8-8 8 8" stroke="currentColor" />
              </svg>
              <span className="text-lg font-semibold opacity-60">
                Event Poster
              </span>
            </span>
            {/* 
              To use a real image, replace the above <span> with:
              <Image src="/your-poster.jpg" alt="Event Poster" fill className="object-cover" />
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventid;
