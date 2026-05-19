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
    id: 'bethune-code-cafe-may26',
    title: '☕ Bethune College — Code Cafe Meetup',
    subtitle: 'College Street coding circle with beginner-friendly problem solving, GitHub setup, and peer mentoring.',
    date: '2026-05-06T08:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=bethunecodecafe26&backgroundColor=f59e0b',
    type: 'upcoming',
  },
  {
    id: 'rcc-newtown-ai-talk-may26',
    title: '🧠 RCCIIT New Town — AI Builders Talk',
    subtitle: 'Hands-on session on AI tools, prompt workflows, and student project demos near Sector V.',
    date: '2026-05-06T13:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=rcciitai26&backgroundColor=6366f1',
    type: 'upcoming',
  },
  {
    id: 'jadavpur-photowalk-may26',
    title: '📸 JU Lens Club — South Kolkata Photowalk',
    subtitle: 'Golden-hour campus walk covering street frames, portraits, and quick editing tips for reels.',
    date: '2026-05-07T11:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=julenswalk26&backgroundColor=14b8a6',
    type: 'upcoming',
  },
  {
    id: 'tmsl-saltlake-design-may26',
    title: '🎨 Salt Lake Design Jam — TMSL',
    subtitle: 'Techno Main Salt Lake design & product club. Figma sprints, portfolio reviews, Sector V mentors.',
    date: '2026-05-08T10:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=tmsldesign26&backgroundColor=ec4899',
    type: 'upcoming',
  },
  {
    id: 'ashutosh-quiz-evening-may26',
    title: '🏆 Asutosh College — Quiz Evening',
    subtitle: 'Southern Avenue inter-college quiz with pop culture, sports, Kolkata history, and tech rounds.',
    date: '2026-05-09T12:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=asutoshquiz26&backgroundColor=10b981',
    type: 'upcoming',
  },
  {
    id: 'xaviers-parkstreet-music-may26',
    title: '🎵 St. Xavier\'s Calcutta — Spring Fest Night',
    subtitle: 'Park Street campus open-air: bands, acoustic sets, and X-Rhythms club showcase.',
    date: '2026-05-10T17:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=xaviersfest26&backgroundColor=a855f7',
    type: 'upcoming',
  },
  {
    id: 'amity-kolkata-startup-may26',
    title: '💡 Amity Kolkata — Startup Sprint',
    subtitle: 'New Town ideation sprint for student founders: validation, pitch practice, and mentor feedback.',
    date: '2026-05-11T09:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=amitystartup26&backgroundColor=ef4444',
    type: 'upcoming',
  },
  {
    id: 'nsec-garia-cyber-may26',
    title: '🔐 NSEC Garia — Cybersecurity Bootcamp',
    subtitle: 'Intro CTF challenges, web security basics, and blue-team demos hosted by the campus tech society.',
    date: '2026-05-12T07:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=nseccyber26&backgroundColor=0ea5e9',
    type: 'upcoming',
  },
  {
    id: 'presidency-debate-kolkata-may26',
    title: '🎤 Presidency University — College Street Debate',
    subtitle: 'Bangla & English finals hosted by the Literary Society. Cross-city Kolkata colleges invited.',
    date: '2026-05-14T08:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=presidencydebate26&backgroundColor=3b82f6',
    type: 'upcoming',
  },
  {
    id: 'iem-rajarhat-pitch-may26',
    title: '🚀 IEM Kolkata E-Cell — Rajarhat Pitch Day',
    subtitle: 'Student startups from Salt Lake & New Town campuses pitch to local founders and angels.',
    date: '2026-05-17T09:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=iemrajarhat26&backgroundColor=22c55e',
    type: 'upcoming',
  },
  {
    id: 'iiest-shibpur-robotics-may26',
    title: '🤖 IIEST Shibpur Robotics Club — Open Lab Day',
    subtitle: 'Howrah river-side campus: drones, line-followers, and IoT demos. Metro-friendly from Kolkata.',
    date: '2026-05-21T09:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=iiestshibpur26&backgroundColor=06b6d4',
    type: 'upcoming',
  },
  {
    id: 'heritage-cu-alumni-may26',
    title: '🤝 Heritage × CU — Kolkata Alumni Mixer',
    subtitle: 'Heritage College & Calcutta University societies: networking, mock interviews, adda over coffee.',
    date: '2026-05-24T11:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=heritagecu26&backgroundColor=f97316',
    type: 'upcoming',
  },
  {
    id: 'scottish-church-sports-may26',
    title: '⚽ Scottish Church College — Monsoon Sports League',
    subtitle: 'College Row, Kolkata: football & cricket friendlies vs JU, Bethune, and Scottish teams.',
    date: '2026-05-28T06:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=scottishsports26&backgroundColor=84cc16',
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
