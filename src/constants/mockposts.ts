export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface PostComment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: Date;
  mentions?: string[];
  reactions?: {
    type: 'like' | 'love' | 'laugh' | 'wow' | 'sad';
    count: number;
  }[];
}

export const users: User[] = [
  {
    id: '1',
    name: 'Anirban Ghosh',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '2',
    name: 'Swarnendu Ghosh',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '3',
    name: 'Mohak Chakraborty',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: '4',
    name: 'Priya Singh',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '5',
    name: 'Arjun Kumar',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content:
      'Just finished presenting at MoodX Hackathon 2025! Incredible energy from all the student teams. Innovation is alive and well on campus! 🚀',
    images: [
      'https://images.unsplash.com/photo-1540304453527-62f9ff98e488?q=80&w=1000',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000',
    ],
    likes: 89,
    comments: 12,
    timestamp: new Date(2025, 4, 1, 14, 30),
    mentions: ['2', '3'],
    reactions: [
      { type: 'like', count: 65 },
      { type: 'love', count: 24 },
      { type: 'wow', count: 13 },
    ],
  },
  {
    id: '2',
    userId: '3',
    content:
      "Working on something exciting for the upcoming campus tech fest. Who's planning to participate this year? Drop a comment if you want to collaborate! 💻",
    likes: 52,
    comments: 8,
    timestamp: new Date(2025, 4, 1, 10, 15),
    reactions: [{ type: 'like', count: 52 }],
  },
  {
    id: '3',
    userId: '2',
    content:
      "Just registered for the AI workshop next week. They're going to cover some cutting-edge applications in machine learning. Anyone else joining? Let's connect and share notes! 📝",
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000',
    ],
    likes: 76,
    comments: 15,
    timestamp: new Date(2025, 4, 1, 9, 45),
    reactions: [
      { type: 'like', count: 45 },
      { type: 'love', count: 31 },
    ],
  },
  {
    id: '4',
    userId: '4',
    content:
      'Our team just won the campus innovation challenge! 🏆 Thanks to everyone who supported us. Special shoutout to the amazing mentors who guided us through the process.',
    images: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
    ],
    likes: 124,
    comments: 23,
    timestamp: new Date(2025, 3, 30, 18, 20),
    reactions: [
      { type: 'like', count: 55 },
      { type: 'love', count: 42 },
      { type: 'wow', count: 27 },
    ],
  },
  {
    id: '5',
    userId: '5',
    content:
      "Looking for team members for the upcoming hackathon! Need a frontend developer and UX designer. DM if interested. Let's build something amazing together! ⚡",
    likes: 37,
    comments: 19,
    timestamp: new Date(2025, 3, 30, 16, 10),
    reactions: [{ type: 'like', count: 37 }],
  },
];

export const suggestedUsers: User[] = [
  {
    id: '6',
    name: 'Rahul Dey',
    avatar: 'https://i.pravatar.cc/150?img=19',
  },
  {
    id: '7',
    name: 'Aarav Patel',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: '8',
    name: 'Zara Khan',
    avatar: 'https://i.pravatar.cc/150?img=25',
  },
];

export const interestCategories = [
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - timestamp.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}
