'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import LandingHeader from './landingHeader';
import { BackgroundElements } from './TeamSection';
import { Button } from './ui/button';
import { aeoFaqs, type AeoFaq } from '@/lib/seo/aeoFaqs';

const FAQItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: AeoFaq;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-yellow-500/20 bg-black/50 backdrop-blur-sm"
      initial={false}
    >
      <button
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        onClick={onToggle}
        type="button"
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
        <div className="border-t border-yellow-500/20 px-6 py-4 text-gray-300">
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...new Set(aeoFaqs.map((faq) => faq.category))];

  const toggleItem = (index: number) => {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  };

  const filteredFaqs =
    activeCategory === 'All'
      ? aeoFaqs
      : aeoFaqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen pt-24">
      <LandingHeader />
      <BackgroundElements />
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Quick, citable answers for students, club heads, and college admins
          </p>
        </motion.div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 transition-colors ${
                activeCategory === category
                  ? 'bg-yellow-500 text-black'
                  : 'bg-black/50 text-gray-300 hover:bg-yellow-500/20'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {filteredFaqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
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
