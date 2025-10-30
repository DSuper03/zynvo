'use client';

import { useState } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileForm = {
  bio: string;
  course: string;
  year: string;
  tags: string;
  collegeName: string;
  twitter: string;
  instagram: string;
  linkedin: string;
};

export interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileForm: ProfileForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedPredefinedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector = ({
  selectedTags,
  onTagsChange,
  profileForm,
  handleProfileFormChange,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  profileForm: { tags: string };
  handleProfileFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const predefinedTags = [
    'AI 🤖',
    'Web Dev 🌐',
    'App Dev 📱',
    'Backend 💻',
    'Frontend ✨',
    'Full Stack ⚡',
    'DevOps ⚙️',
    'Cloud ☁️',
    'Docker 🐳',
    'K8s 🚢',
    'Hackathons ⏱️',
    'LeetCode 🧩',
    'CTF 🕵️',
    'Open Source 🌍',
    'Cybersecurity 🔒',
    'Robotics 🤖🔧',
    'Blockchain ⛓️',
    'UI/UX ✏️',
    'Product Design 🎯',
    'Product Management 📊',
    'Data Science 📈',
    'Machine Learning 🧠',
    'GenAI 🪄',
    'AR/VR 🥽',
    '3D/CGI 🧱',
    'Game Dev 🎮',
    'Cyber-psych 🧩',
    'FinTech 💸',
    'EdTech 🎓',
    'HealthTech 🏥',
    'ClimateTech 🌱',
    'NoCode/LowCode 🧩',
    'Automation 🤖✨',
    'APIs 🔗',
    'Databases 🗄️',
    'System Design 🏗️',
    'Competitive Programming 🥇',
    'Mathematics ➕',
    'Physics ⚛️',
    'Electronics 🔬',
    'IOT 🌐🔧',
    'Web3 🪙',
    'Smart Contracts 📜',
    'Photography 📸',
    'Cinematography 🎬',
    'Video Editing ✂️',
    'Digital Art 🖌️',
    'Motion Graphics 🎞️',
    'Content Creator 📣',
    'Podcasting 🎙️',
    'Writing ✍️',
    'Public Speaking 🎤',
    'Debate 🗣️',
    'Marketing 📢',
    'Growth 📈',
    'Entrepreneurship 🚀',
    'Startup Builder 🧪',
    'Sales 💼',
    'Community ⚡',
    'Event Ops 🎪',
    'Volunteering 🤝',
    'Music 🎵',
    'Dance 🕺',
    'Theatre 🎭',
    'Fashion 👗',
    'Design 🎨',
    'Fitness 🏋️',
    'Sports ⚽',
    'Esports 🕹️',
    'Mindfulness 🧘',
    'Reading 📚',
    'Anime 🍥',
    'Manga 📖',
    'K‑Pop 🎧',
    'Memes 😂',
    'Travel ✈️',
    'Foodie 🍜',
    'Coffee ☕',
    'Night Owl 🌙',
    'Early Bird 🌅',
  ];

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(updatedTags);
  };

  const filteredTags = predefinedTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayTags = showAll ? filteredTags : filteredTags.slice(0, 30);

  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-sm font-semibold text-neutral-200 mb-2">
        Skills & Interests
      </label>
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-3 bg-neutral-900/60 border border-neutral-700 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
      />

      <div className="mb-3 text-xs text-neutral-400">Selected: {selectedTags.length} tags</div>

      <div className="max-h-60 overflow-y-auto bg-neutral-950/50 rounded-lg p-3 border border-neutral-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {displayTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-yellow-400 text-gray-900 scale-105'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              {tag}
            </Button>
          ))}
        </div>

        {!showAll && filteredTags.length > 30 && (
          <Button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-3 text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
          >
            Show {filteredTags.length - 30} more tags...
          </Button>
        )}

        {showAll && (
          <Button
            type="button"
            onClick={() => setShowAll(false)}
            className="mt-3 text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
          >
            Show fewer tags
          </Button>
        )}
      </div>

      <div className="mt-3">
        <input
          type="text"
          name="tags"
          value={profileForm.tags}
          onChange={handleProfileFormChange}
          className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
          placeholder="Or add custom tags separated by commas..."
        />
        <p className="text-xs text-neutral-400 mt-1">
          You can also type custom tags separated by commas
        </p>
      </div>
    </div>
  );
};

export default function CompleteProfileModal({
  open,
  onClose,
  profileForm,
  onChange,
  onSubmit,
  selectedPredefinedTags,
  onTagsChange,
}: CompleteProfileModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(250,204,21,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />

        <div className="relative bg-neutral-950/95">
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-yellow-400/80 font-semibold">Profile</p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Complete Your Profile</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Help others discover you faster</p>
            </div>
            <Button onClick={onClose} className="text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800/60 px-2 py-2">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={onSubmit} className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(92vh-72px)]">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={onChange}
                className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-2">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={profileForm.twitter}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://x.com/username or @username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-2">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={profileForm.linkedin}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://linkedin.com/in/username or @username"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-rose-400 mb-2">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={profileForm.instagram}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://instagram.com/username or @username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-yellow-600 mb-2">Course</label>
                <input
                  type="text"
                  name="course"
                  value={profileForm.course}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-600 mb-2">Year</label>
                <input
                  type="text"
                  name="year"
                  value={profileForm.year}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="e.g. 2025"
                />
              </div>
            </div>

            <TagSelector
              selectedTags={selectedPredefinedTags}
              onTagsChange={onTagsChange}
              profileForm={{ tags: profileForm.tags }}
              handleProfileFormChange={onChange as any}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant={'destructive'}
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-red-600/80 transition-colors text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium text-sm"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


