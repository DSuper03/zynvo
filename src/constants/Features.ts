import {
  UsersIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  SparklesIcon,
  MessageCircleIcon,
} from 'lucide-react';

export const features = [
  {
    Icon: UsersIcon,
    name: 'Discover Clubs',
    description:
      'Explore a variety of clubs on your campus—from tech to theater.',
    href: '/clubs',
    cta: 'Browse Clubs',
    background: '/images/features/clubs-bg.png',
    className: 'lg:col-span-1 lg:row-span-2',
    variant: 'primary', // Design variant
    accentColor: 'from-purple-500 to-indigo-600',
    height: 'h-full',
  },
  {
    Icon: CalendarDaysIcon,
    name: 'Event Hub',
    description: 'Stay updated with upcoming events, fests, and meetups.',
    href: '/events',
    cta: 'Check Events',
    background: '/images/features/events-bg.png',
    className: 'lg:col-span-1 lg:row-span-1',
    variant: 'secondary', // Design variant
    accentColor: 'from-yellow-500 to-amber-600',
    height: 'h-auto',
  },
  {
    Icon: MegaphoneIcon,
    name: 'Promote Your Club',
    description: 'Create a profile for your club and showcase your activities.',
    href: '/create-club',
    cta: 'Zync It ',
    background: '/images/features/promote-bg.png',
    className: 'lg:col-span-1 lg:row-span-1',
    variant: 'tertiary', // Design variant
    accentColor: 'from-emerald-500 to-teal-600',
    height: 'h-auto',
  },
  {
    Icon: SparklesIcon,
    name: 'Join & Engage',
    description: 'RSVP to events, comment, and connect with other students.',
    href: '/feed',
    cta: 'View Feed',
    background: '/images/features/engage-bg.png',
    className: 'lg:col-span-1 lg:row-span-1',
    variant: 'highlight', // Design variant
    accentColor: 'from-rose-500 to-pink-600',
    height: 'h-auto',
  },
  {
    Icon: MessageCircleIcon,
    name: 'Direct Messaging',
    description: 'Chat with club members, admins, or your friends instantly.',
    href: '/messages',
    cta: 'Open Chat',
    background: '/images/features/chat-bg.png',
    className: 'lg:col-span-1 lg:row-span-2',
    variant: 'bordered', // Design variant
    accentColor: 'from-cyan-500 to-blue-600',
    height: 'h-full',
  },
];
