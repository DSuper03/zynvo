
import React from 'react'

const Eventid = () => {
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="container mx-auto grid grid-cols-12 gap-4 py-8">
        {/* Left side content */}
        <div className="col-span-12 lg:col-span-7">
          
            <div className="rounded-lg overflow-hidden bg-black flex flex-col min-h-[80vh]">
              {/* Header */}
              <div className="bg-red-500 p-4">
                <h1 className="text-3xl font-bold text-black">MoodX Event 2025</h1>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold text-red-400 mb-4">About This Event</h2>

                <div className="mb-6">
                  <p className="text-gray-200  bg-gray-900 p-4 text-justify">
                    We’re three passionate devs who believe in the power of community and code. MoodX is our mission to energize 
                    and connect student minds through creativity, collaboration, and chaos (the good kind). Built by students, for students — this isn’t just an event, it’s a movement.
                    <br /><br />
                    Our goal? Empower the next generation of thinkers and builders with the tools, challenges, and vibes that define Gen-Z. Whether you're into AI, art, activism or all of the above — you’ll find your tribe here. We’re building a space that’s less formal, more phenomenal. So bring your ideas, your code, and your chaos.
                  </p>
                </div>

                <div className="mt-auto">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded transition duration-300 shadow-md">
                    Register Now 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side (intentionally left for spacing or future content) */}
        <div className="col-span-12 lg:col-span-5" />
      </div>
  );
};

export default Eventid;
