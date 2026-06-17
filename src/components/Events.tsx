import React from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const events = [
  {
    title: "AI Hackathon",
    date: "July 22, 2026",
    organizer: "AI & ML Club",
    location: "Techno Main Salt Lake",
    image: "/events/Event1.png",
    attendees: 312,
  },
  {
    title: "Startup Pitch Night",
    date: "August 5, 2026",
    organizer: "Entrepreneurship Cell",
    location: "IIM Bangalore",
    image: "/events/Event2.png",
    attendees: 210,
  },
  {
    title: "Campus Music Fest",
    date: "August 14, 2026",
    organizer: "Music Society",
    location: "BITS Pilani Arena",
    image: "/events/Event3.png",
    attendees: 540,
  },
];

const clubs = [
  {
    name: "Coding Club",
    members: 420,
    image: "/clubs/coding.png",
  },
  {
    name: "Photography Club",
    members: 180,
    image: "/clubs/photo.png",
  },
  {
    name: "Drama Society",
    members: 150,
    image: "/clubs/drama.png",
  },
];

const Events = () => {
  return (
    <section className="relative bg-yellow-300 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            Campus Events & Clubs
          </h2>
          <p className="text-gray-800 mt-3 max-w-xl mx-auto">
            Discover the latest events happening around campus and join the
            communities that make college unforgettable.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group rounded-3xl overflow-hidden bg-yellow-100 border border-yellow-500/30 shadow-sm hover:shadow-xl transition"
            >

              {/* Image */}
              <div className="relative h-52">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                  {event.date}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-black mb-2">
                  {event.title}
                </h3>

                <div className="flex items-center text-sm text-gray-800 mb-2">
                  <FaUsers className="mr-2 text-yellow-600" />
                  {event.organizer}
                </div>

                <div className="text-sm text-gray-700 mb-4">
                  📍 {event.location}
                </div>

                <div className="flex items-center justify-between">

                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-xs">
                    {event.attendees} attending
                  </span>

                  <Link
                    href={`/events/${event.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <Button className="bg-black text-white hover:bg-gray-900">
                      View Event
                    </Button>
                  </Link>

                </div>

              </div>
            </motion.div>
          ))}

        </div>

        {/* Clubs Section */}


      </div>
    </section>
  );
};

export default Events;