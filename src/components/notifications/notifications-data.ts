export type NotificationType = 'update' | 'upcoming' | 'activity';

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
  date: string; // ISO string
  image: string;
  type: NotificationType;
  read?: boolean;
}

export const sampleNotifications: Notification[] = [
  {
    id: 'hult-prize-2026',
    title: '🚀 Hult Prize - Registration Open!',
    subtitle: 'One million to change the world! Join the world\'s largest student startup competition. Organized by IIC TMSL.',
    date: '2026-01-03T09:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=hultprize&backgroundColor=ec4899',
    type: 'upcoming',
  },
  {
    id: 'tmcl-2k26',
    title: '🏏 TMCL 2K26 - Cricket Tournament',
    subtitle: 'The ultimate cricket showdown at TMSL! Neon nights, stadium vibes, and intense matches await.',
    date: '2026-01-05T10:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=cricket&backgroundColor=22c55e',
    type: 'upcoming',
  },
  {
    id: 'techfest-2026',
    title: '💻 TMSL TechFest 2026',
    subtitle: 'The biggest tech festival at Techno Main Salt Lake! Hackathons, workshops, and more.',
    date: '2026-01-15T09:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=techfest&backgroundColor=fbbf24',
    type: 'upcoming',
  },
  {
    id: 'aiml-workshop',
    title: '🤖 AI/ML Workshop @ TMSL',
    subtitle: 'Learn Machine Learning fundamentals with hands-on projects. Limited seats!',
    date: '2026-01-10T10:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=aiml&backgroundColor=3b82f6',
    type: 'upcoming',
  },
];

/**
 * Get relative time string from a date
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffMins = Math.round(diffMs / (1000 * 60));

  // For future dates
  if (diffMs > 0) {
    if (diffDays > 30) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays === 1) return 'tomorrow';
    if (diffHours > 1) return `in ${diffHours} hours`;
    if (diffHours === 1) return 'in 1 hour';
    if (diffMins > 1) return `in ${diffMins} mins`;
    return 'just now';
  }

  // For past dates
  if (diffMins > -60) return `${Math.abs(diffMins)} mins ago`;
  if (diffHours > -24) return `${Math.abs(diffHours)} hours ago`;
  if (diffDays === -1) return 'yesterday';
  if (diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  if (diffDays > -30) return `${Math.ceil(Math.abs(diffDays) / 7)} weeks ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
