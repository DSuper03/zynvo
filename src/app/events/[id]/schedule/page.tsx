'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const SchedulePage = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Toggle session details
  const toggleSession = (sessionId: number) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  // Event data
  const eventInfo = {
    name: 'MoodX Event 2025',
    startDate: 'May 10, 2025',
    endDate: 'May 12, 2025',
    location: 'Virtual & San Francisco, CA',
    timeZone: 'Pacific Time (PT)',
  };

  // Schedule data by day
  const schedule = [
    {
      day: 1,
      date: 'May 10, 2025',
      name: 'Day 1: Opening & Kickoff',
      sessions: [
        {
          id: 1,
          time: '9:00 AM - 10:30 AM',
          title: 'Registration & Networking Breakfast',
          description:
            'Check in, grab your welcome kit, enjoy breakfast and meet fellow participants.',
          location: 'Main Hall',
          speakers: [],
        },
        {
          id: 2,
          time: '10:30 AM - 11:30 AM',
          title: 'Opening Ceremony',
          description:
            'Welcome address, introduction to the event structure, and announcements of key information.',
          location: 'Auditorium A',
          speakers: ['Anirban Ghosh'],
        },
        {
          id: 3,
          time: '11:30 AM - 12:30 PM',
          title: 'Keynote: The Future of Campus Innovation',
          description:
            'An inspiring talk on how student innovations are shaping the future of technology and society.',
          location: 'Auditorium A',
          speakers: ['Swarnendu Ghosh'],
        },
        {
          id: 4,
          time: '12:30 PM - 2:00 PM',
          title: 'Lunch & Team Formation',
          description:
            'Enjoy lunch while forming teams and brainstorming initial ideas.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 5,
          time: '2:00 PM - 4:00 PM',
          title: 'Workshop: Rapid Prototyping Techniques',
          description:
            'Learn practical techniques to quickly validate your ideas and create functional prototypes.',
          location: 'Workshop Room B',
          speakers: ['Mohak Chakraborty'],
        },
        {
          id: 6,
          time: '4:00 PM - 6:00 PM',
          title: 'Hackathon Begins: Initial Setup',
          description:
            'Teams set up their workspaces and begin developing their projects with mentor support available.',
          location: 'Hacking Area',
          speakers: [],
        },
        {
          id: 7,
          time: '6:00 PM - 8:00 PM',
          title: 'Dinner & Networking',
          description:
            'Refuel with dinner and continue networking with peers and industry professionals.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 8,
          time: '8:00 PM - 11:00 PM',
          title: 'Evening Hacking Session',
          description:
            'Continue working on your projects with support from mentors. Snacks and refreshments available.',
          location: 'Hacking Area',
          speakers: [],
        },
      ],
    },
    {
      day: 2,
      date: 'May 11, 2025',
      name: 'Day 2: Development & Workshops',
      sessions: [
        {
          id: 9,
          time: '8:00 AM - 9:00 AM',
          title: 'Breakfast',
          description:
            'Start your day with breakfast and informal discussions.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 10,
          time: '9:00 AM - 10:00 AM',
          title: 'Daily Stand-up & Progress Check',
          description:
            'Teams share their progress and challenges in a quick stand-up format.',
          location: 'Main Stage',
          speakers: ['Anirban Ghosh'],
        },
        {
          id: 11,
          time: '10:00 AM - 12:00 PM',
          title: 'Workshop: Advanced UX Design for Gen-Z',
          description:
            'Learn how to design intuitive interfaces that resonate with the next generation of users.',
          location: 'Design Lab',
          speakers: ['Swarnendu Ghosh'],
        },
        {
          id: 12,
          time: '12:00 PM - 1:30 PM',
          title: 'Lunch',
          description: 'Take a break and enjoy lunch with fellow participants.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 13,
          time: '1:30 PM - 3:30 PM',
          title: 'Workshop: AI Integration for Projects',
          description:
            'Practical session on how to leverage AI capabilities in your hackathon projects.',
          location: 'Tech Lab C',
          speakers: ['Mohak Chakraborty'],
        },
        {
          id: 14,
          time: '3:30 PM - 7:00 PM',
          title: 'Hackathon Continuation',
          description:
            'Teams continue developing their projects with ongoing mentor support.',
          location: 'Hacking Area',
          speakers: [],
        },
        {
          id: 15,
          time: '7:00 PM - 8:30 PM',
          title: 'Dinner & Lightning Talks',
          description:
            'Dinner served alongside quick 5-minute presentations on interesting tech topics.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 16,
          time: '8:30 PM - 11:00 PM',
          title: 'Evening Hacking Session',
          description: 'Final evening session for project development.',
          location: 'Hacking Area',
          speakers: [],
        },
      ],
    },
    {
      day: 3,
      date: 'May 12, 2025',
      name: 'Day 3: Presentations & Awards',
      sessions: [
        {
          id: 17,
          time: '8:00 AM - 9:00 AM',
          title: 'Breakfast',
          description: 'Final day breakfast to energize for presentations.',
          location: 'Dining Hall',
          speakers: [],
        },
        {
          id: 18,
          time: '9:00 AM - 11:00 AM',
          title: 'Project Finalization',
          description:
            'Last opportunity to finalize projects and prepare presentations.',
          location: 'Hacking Area',
          speakers: [],
        },
        {
          id: 19,
          time: '11:00 AM - 12:00 PM',
          title: 'Submission Deadline & Lunch',
          description:
            'Final submissions due. Lunch provided as judges begin initial review.',
          location: 'Main Hall',
          speakers: [],
        },
        {
          id: 20,
          time: '12:00 PM - 3:00 PM',
          title: 'Project Presentations',
          description:
            'Teams present their projects to judges and attendees (10 minutes per team).',
          location: 'Auditorium A',
          speakers: [],
        },
        {
          id: 21,
          time: '3:00 PM - 4:00 PM',
          title: 'Judges Deliberation & Networking Break',
          description:
            'Refreshments provided while judges make final decisions.',
          location: 'Lounge Area',
          speakers: [],
        },
        {
          id: 22,
          time: '4:00 PM - 5:30 PM',
          title: 'Award Ceremony & Closing Remarks',
          description:
            'Announcement of winners, prize distribution, and closing thoughts.',
          location: 'Main Stage',
          speakers: ['Anirban Ghosh', 'Swarnendu Ghosh', 'Mohak Chakraborty'],
        },
        {
          id: 23,
          time: '5:30 PM - 7:00 PM',
          title: 'Celebration Reception',
          description:
            'Celebrate the conclusion of MoodX with refreshments and networking.',
          location: 'Reception Hall',
          speakers: [],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Event Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black border-2 border-yellow-500/30 rounded-xl overflow-hidden mb-12"
        >
          <div className="bg-yellow-400 p-4 flex items-center">
            <FaCalendarAlt className="text-black text-xl mr-3" />
            <h1 className="text-2xl font-bold text-black">Event Schedule</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {eventInfo.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-300">
                  <span className="flex items-center mb-2 sm:mb-0">
                    <FaCalendarAlt className="text-yellow-400 mr-2" />
                    {eventInfo.startDate} - {eventInfo.endDate}
                  </span>
                  <span className="sm:mx-4 hidden sm:block text-yellow-400">
                    •
                  </span>
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="text-yellow-400 mr-2" />
                    {eventInfo.location}
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-0 bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center">
                <FaClock className="text-yellow-400 mr-2" />
                All times in {eventInfo.timeZone}
              </div>
            </div>

            <p className="text-gray-300 border-l-4 border-yellow-400 pl-4 py-2 bg-gray-800/50 rounded-r-md">
              Join us for three days of innovation, collaboration, and
              inspiration. From workshops to hackathon sessions, and from
              networking opportunities to the final presentations - immerse
              yourself in this transformative experience.
            </p>
          </div>
        </motion.div>

        {/* Day Selection Tabs */}
        <div className="flex overflow-x-auto mb-8 sticky top-0 z-10 bg-gray-900 py-2">
          {schedule.map((day) => (
            <Button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg mr-2 font-medium transition-all ${
                activeDay === day.day
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="block text-xs mb-1">{day.date}</span>
              <span className="block font-bold">Day {day.day}</span>
            </Button>
          ))}
        </div>

        {/* Day Schedule */}
        {schedule.map(
          (day) =>
            day.day === activeDay && (
              <motion.div
                key={day.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">{day.name}</h2>
                  <p className="text-yellow-400">{day.date}</p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4 mb-12"
                >
                  {day.sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      variants={itemVariants}
                      className={`border-l-4 ${
                        expandedSession === session.id
                          ? 'border-yellow-400 bg-black'
                          : 'border-gray-700 bg-gray-800/50 hover:border-yellow-400/60'
                      } rounded-r-lg overflow-hidden transition-all duration-300`}
                    >
                      <div
                        className="p-4 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSession(session.id)}
                      >
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                            <span className="font-mono text-yellow-400 text-sm">
                              {session.time}
                            </span>
                            <span className="hidden sm:block mx-3 text-gray-500">
                              |
                            </span>
                            <span className="text-gray-400 text-sm flex items-center">
                              <FaMapMarkerAlt className="mr-1 text-xs" />
                              {session.location}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-lg">
                            {session.title}
                          </h3>
                        </div>
                        <div
                          className={`text-gray-400 p-1 transform transition-transform ${
                            expandedSession === session.id ? 'rotate-180' : ''
                          }`}
                        >
                          <FaChevronDown />
                        </div>
                      </div>

                      {expandedSession === session.id && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-300 mb-3">
                            {session.description}
                          </p>

                          {session.speakers.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-yellow-500 mb-2">
                                Featuring:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {session.speakers.map((speaker, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs flex items-center"
                                  >
                                    {speaker}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )
        )}

        {/* Download Schedule CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Need the schedule on the go?
          </h3>
          <p className="text-gray-300 mb-6">
            Download the complete event schedule to your calendar or as a PDF.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
              Add to Calendar
            </Button>
            <Button className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
              Download PDF
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Visual elements */}
      <div className="fixed top-1/4 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-1/3 left-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default SchedulePage;
