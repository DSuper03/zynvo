'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import LandingHeader from './landingHeader';
import { BackgroundElements } from './TeamSection';

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What is Zynvo?',
    answer:
      'Zynvo is a platform that connects college students with campus events, clubs, competitions, and workshops. We make it easy to discover and participate in campus activities that match your interests.',
  },
  {
    category: 'General',
    question: 'Is Zynvo free to use?',
    answer:
      'Yes, Zynvo is completely free for students to use. You can browse events, join clubs, and participate in activities without any cost.',
  },
  {
    category: 'Events',
    question: 'How do I find events near me?',
    answer:
      "Once you sign up, you can browse events in the 'Discover' section. Events are organized by category and you can filter them based on your interests, date, and location.",
  },
  {
    category: 'Clubs',
    question: 'Can I create my own club?',
    answer:
      "Yes! Any registered student can create a club. Simply navigate to the Clubs section and click on 'Create New Club'. You'll need to provide basic information about your club and its activities.",
  },
  {
    category: 'Competitions',
    question: 'How do I participate in competitions?',
    answer:
      "Browse available competitions in the 'Contests' section. Each competition listing includes registration details, rules, and prize information. Click 'Register' to join a competition.",
  },
  {
    category: 'Account',
    question: 'How do I create an account?',
    answer:
      "Click the 'Sign Up' button in the top navigation bar. You'll need to provide your student email address and create a password. We'll send you a verification email to confirm your account.",
  },
  {
    category: 'Account',
    question: "Can I use Zynvo if I'm not a student?",
    answer:
      'Currently, Zynvo is designed specifically for college students. You need a valid student email address to create an account.',
  },
  {
    category: 'Technical',
    question: 'What browsers are supported?',
    answer:
      'Zynvo works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version.',
  },
];

const FAQItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      className="border border-yellow-500/20 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm"
      initial={false}
    >
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center"
        onClick={onToggle}
      >
        <span className="font-medium text-white">{item.question}</span>
        <motion.span
          className="text-yellow-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 text-gray-300 border-t border-yellow-500/20">
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...new Set(faqs.map((faq) => faq.category))];

  const toggleItem = (index: number) => {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  };

  const filteredFaqs =
    activeCategory === 'All'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen  pt-24">
      <LandingHeader />
      <BackgroundElements />
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get quick answers to common questions about Zynvo and how it works
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-yellow-500 text-black'
                  : 'bg-black/50 text-gray-300 hover:bg-yellow-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              isOpen={openItems.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
