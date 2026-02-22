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
    // Additional personality & lifestyle tags
    'Gym Rat 🏋️',
    'Bookie 📚',
    'Cinephile 🎬',
    'Wanderlust 🌍',
    'Minimalist 🤍',
    'Maximalist 🌈',
    'Thrifter 🛍️',
    'Vintage Soul 🎞️',
    'Plant Parent 🪴',
    'Dog Person 🐶',
    'Cat Person 🐱',
    'Aquarium Keeper 🐠',
    'Bird Watcher 🦜',
    'Hiker ⛰️',
    'Trail Runner 🏃',
    'Rock Climber 🧗',
    'Swimmer 🏊',
    'Cyclist 🚴',
    'Skater 🛹',
    'Surfer 🏄',
    'Snowboarder 🏂',
    'Skiier ⛷️',
    'Martial Artist 🥋',
    'Boxer 🥊',
    'Yogi 🧘',
    'Pilates Girl 🩰',
    'Calisthenics 💪',
    'Crossfitter 🔥',
    'Runner 🏃',
    'Marathon Chaser 🏅',
    'Footballer ⚽',
    'Basketball Head 🏀',
    'Cricket Nerd 🏏',
    'Tennis Serve 🎾',
    'Badminton Smash 🏸',
    'Volleyball Spike 🏐',
    'Table Tennis Pro 🏓',
    'Chess Player ♟️',
    'Poker Face 🃏',
    'Board Gamer 🎲',
    'Rubik\'s Solver 🧩',
    'Sudoku Addict 🔢',
    'Crossword King 📰',
    'Quiz Master 🧠',
    'Trivia Nerd 🎯',
    'Debater 🗣️',
    'Public Speaker 🎤',
    'Storyteller 📖',
    'Poet ✍️',
    'Novelist 📝',
    'Journaler 🗒️',
    'Blogger ✏️',
    'Lyricist 🎶',
    'Songwriter 🎸',
    'Guitarist 🎸',
    'Pianist 🎹',
    'Drummer 🥁',
    'Bassist 🎵',
    'Violinist 🎻',
    'Vocalist 🎤',
    'DJ 🎧',
    'Producer 🎚️',
    'Classical Head 🎼',
    'Jazz Lover 🎷',
    'Hip Hop Head 🎤',
    'Indie Kid 🎵',
    'Metalhead 🤘',
    'Emo Revival 🖤',
    'Pop Girlie 💿',
    'K-Pop Stan 🇰🇷',
    'Bollywood Fan 🎬',
    'Theatre Kid 🎭',
    'Film Buff 🎞️',
    'Anime Otaku ⛩️',
    'Manga Reader 📕',
    'Comic Collector 🦸',
    'Cosplayer 🎭',
    'Gamer 🎮',
    'Speedrunner ⏱️',
    'Retro Gamer 👾',
    'Dungeon Master 🐉',
    'Lego Builder 🧱',
    'Model Maker 🛠️',
    'Sneakerhead 👟',
    'Streetwear Fiend 🧢',
    'Thrift Flipper 👕',
    'Fashion Forward 👗',
    'Cottagecore 🌿',
    'Dark Academia 🕯️',
    'Y2K Revivalist 💿',
    'Boho Soul 🌸',
    'Old Money Aesthetic 🏛️',
    'Hypebeast 🔥',
    'Jewellery Maker 💍',
    'Candle Maker 🕯️',
    'Soap Crafter 🧼',
    'Knitter 🧶',
    'Crocheter 🪡',
    'Embroiderer 🧵',
    'Painter 🎨',
    'Sketcher ✏️',
    'Watercolourist 🖌️',
    'Digital Artist 🖥️',
    'Sculptor 🗿',
    'Ceramicist 🏺',
    'Glassblower 🫧',
    'Photographer 📷',
    'Film Photographer 🎞️',
    'Portrait Shooter 🤳',
    'Street Photographer 🏙️',
    'Landscape Chaser 🌄',
    'Astrophotographer 🔭',
    'Videographer 🎥',
    'Short Filmmaker 🎬',
    'Documentary Maker 📽️',
    'Content Creator 📸',
    'Podcast Listener 🎙️',
    'True Crime Addict 🔍',
    'History Buff 📜',
    'Mythology Nerd 🏛️',
    'Philosophy Bro 💭',
    'Psychology Geek 🧠',
    'Sociology Thinker 🌍',
    'Economist 📈',
    'Politics Watcher 🗳️',
    'Environmentalist 🌱',
    'Minimalist Chef 🍳',
    'Home Cook 🥘',
    'Baker 🍞',
    'Pastry Artist 🧁',
    'Barista ☕',
    'Tea Ceremonialist 🍵',
    'Wine Taster 🍷',
    'Craft Beer Explorer 🍺',
    'Mixologist 🍹',
    'Street Food Hunter 🌮',
    'Ramen Obsessed 🍜',
    'Sushi Connoisseur 🍣',
    'Vegan Advocate 🥦',
    'Nutrition Tracker 🥗',
    'Meal Prepper 🍱',
    'Spice Collector 🌶️',
    'Gardener 🌻',
    'Urban Farmer 🥬',
    'Beekeeper 🐝',
    'Forager 🍄',
    'Astrology Girlie ♈',
    'Tarot Reader 🔮',
    'Manifestor ✨',
    'Crystal Collector 💎',
    'Moon Chaser 🌙',
    'Numerology Nerd 🔢',
    'Lucid Dreamer 🌀',
    'Meditator 🧘',
    'Breathwork Explorer 🌬️',
    'Gratitude Practitioner 🙏',
    'Therapymaxxing 🛋️',
    'Self Help Reader 📗',
    'Motivational Junkie 💬',
    'Vintage Collector 🏺',
    'Antique Hunter 🔍',
    'Stamp Collector 📮',
    'Coin Collector 🪙',
    'Card Collector 🃏',
    'Record Collector 🎵',
    'Book Hoarder 📚',
    'Library Rat 🏛️',
    'Stationery Addict 🖊️',
    'Planner Freak 📅',
    'Bullet Journaler 🔵',
    'Language Learner 🌐',
    'Polyglot 🗣️',
    'Culture Hopper ✈️',
    'Solo Traveller 🎒',
    'Budget Backpacker 🏕️',
    'Luxury Traveller 🛫',
    'Road Tripper 🚗',
    'Train Traveller 🚂',
    'Cruise Lover 🚢',
    'Camping Addict 🏕️',
    'Stargazer 🔭',
    'Sunset Chaser 🌅',
    'Sunrise Catcher 🌄',
    'Beach Bum 🏖️',
    'Mountain Person ⛰️',
    'Forest Bather 🌲',
    'Cave Explorer 🕳️',
    'Scuba Diver 🤿',
    'Paraglider 🪂',
    'Bungee Jumper 🔗',
    'Motorsport Fan 🏎️',
    'Aviation Geek ✈️',
    'Space Nerd 🚀',
    'Marine Biology Fan 🐋',
    'Wildlife Enthusiast 🦁',
    'Fossil Hunter 🦕',
    'Storm Chaser ⛈️',
    'Volunteer Heart ❤️',
    'Community Builder 🤝',
    'Activist 🌍',
    'Fundraiser 💛',
    'Mentor 🎓',
    'Leader 👑',
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
                  ? 'bg-yellow-400 text-gray-100 scale-105'
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(250,204,21,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />

        {/* Header - Fixed at top */}
        <div className="relative shrink-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-yellow-400/80 font-semibold">Profile</p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Help others discover you faster</p>
          </div>
          <Button onClick={onClose} className="text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800/60 px-2 py-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="relative flex-1 overflow-y-auto min-h-0 bg-neutral-950/50">
          <form id="complete-profile-form" onSubmit={onSubmit} className="px-5 sm:px-6 py-5 space-y-5">
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
            
            {/* Spacer to ensure content isn't cut off */}
            <div className="h-2"></div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="relative shrink-0 px-5 sm:px-6 py-4 border-t border-white/10 bg-neutral-950/80 backdrop-blur-xl z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant={'ghost'}
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-900/50 border border-white/5 text-neutral-400 rounded-xl hover:bg-white/5 hover:text-white hover:border-white/10 transition-all duration-200 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="complete-profile-form"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl hover:from-yellow-500 hover:to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-bold text-sm"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


