export type NotificationType = 'update' | 'upcoming' | 'activity';

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
  date: string; // ISO string
  image: string;
  type: NotificationType;
  url?: string;
  read?: boolean;
}

export const sampleNotifications: Notification[] = [
  {
    id: 'adamas-odoo-virtual-round-jun26',
    title: '💻 Odoo x Adamas University Hackathon',
    subtitle: 'Virtual coding round for student teams before the onsite 24-hour final at Adamas University, Kolkata.',
    date: '2026-06-01T03:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=adamasodoo26&backgroundColor=6366f1',
    type: 'upcoming',
    url: 'https://unstop.com/hackathons/odoo-x-adamas-university-hackathon-2026-adamas-university-kolkata-1677914/amp',
  },
  {
    id: 'wbnujs-environment-day-jun26',
    title: '🌱 WBNUJS — World Environment Day Workshop',
    subtitle: 'Hybrid CELCJ panel discussion on climate action and environmental justice for students and researchers.',
    date: '2026-06-05T05:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=wbnujsclimate26&backgroundColor=22c55e',
    type: 'upcoming',
    url: 'https://www.lawctopus.com/workshop-cum-panel-discussion-on-commemorating-world-environment-day-2026-at-wbnujs-kolkata/',
  },
  {
    id: 'kolkata-hiv-global-policy-conf-jun26',
    title: '🧬 Kolkata Research Conference — HIV/AIDS & Policy',
    subtitle: 'Interdisciplinary conference in Kolkata for students and researchers working across public health and policy.',
    date: '2026-06-07T04:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=kolkataresearch26&backgroundColor=14b8a6',
    type: 'upcoming',
    url: 'https://conferencenext.com/event/101017966',
  },
  {
    id: 'jadavpur-vlsi-summer-internship-jun26',
    title: '🔬 Jadavpur University — VLSI Summer Internship',
    subtitle: 'Six-week certified programme on Microelectronics Technology and VLSI Design for engineering and science students.',
    date: '2026-06-15T05:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=juvlsi26&backgroundColor=0ea5e9',
    type: 'upcoming',
    url: 'https://www.collegeadmission.in/notice/university/ju-admission-to-short-term-programme-batch-2-on-microelectronics-technology-and-vlsi-design-2026-15625',
  },
  {
    id: 'adamas-odoo-results-jun26',
    title: '📣 Adamas Hackathon — Shortlist Announcement',
    subtitle: 'Odoo x Adamas University Hackathon teams move from the virtual round toward the Kolkata onsite final.',
    date: '2026-06-18T06:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=adamasshortlist26&backgroundColor=a855f7',
    type: 'upcoming',
    url: 'https://unstop.com/hackathons/odoo-x-adamas-university-hackathon-2026-adamas-university-kolkata-1677914/amp',
  },
  {
    id: 'cu-law-brainstorm-jun26',
    title: '🧠 Calcutta University Law — Brainstorm 2026',
    subtitle: 'Hazra Campus quiz fest with Dr. Pranab Mukherjee Memorial Quiz and Sir Ashutosh Mukherjee Memorial Quiz.',
    date: '2026-06-19T04:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=culawbrainstorm26&backgroundColor=f59e0b',
    type: 'upcoming',
    url: 'https://happeningnext.com/event/brainstorm-2026-eid3a0dnvcrvb',
  },
  {
    id: 'loreto-egovernance-workshop-jun26',
    title: '🏛️ Loreto College — E-Governance Workshop',
    subtitle: 'One-day offline capacity-building workshop on institutional quality and administrative training.',
    date: '2026-06-20T04:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=loretoegov26&backgroundColor=ec4899',
    type: 'upcoming',
    url: 'https://loretocollege.in/workshop_portal/register/w5YszuO8NggAdAkV',
  },
  {
    id: 'icai-ca-students-conference-jun26',
    title: '📚 EIRC ICAI — National CA Students Conference',
    subtitle: 'Two-day student conference at Biswa Bangla Convention Centre, New Town, hosted by EIRC and EICASA.',
    date: '2026-06-20T04:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=icaistudents26&backgroundColor=10b981',
    type: 'upcoming',
    url: 'https://eirc-icai.org/event/national-conference-of-ca-students-2026-20th-21st-june-2026-at-kolkata',
  },
  {
    id: 'raghu-rai-kolkata-photo-contest-jun26',
    title: '📸 Kolkata — Street Photography Contest',
    subtitle: 'Student-friendly photography and cinematography contest focused on visual storytelling across Kolkata.',
    date: '2026-06-20T09:00:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=kolkataphoto26&backgroundColor=ef4444',
    type: 'upcoming',
    url: 'https://happeningnext.com/event/raghu-rai-memory-street-photography-and-cinematography-contest-eid1ar5exbtef',
  },
  {
    id: 'iim-calcutta-research-presentation-jul26',
    title: '📊 IIM Calcutta — Research Summer School Presentation',
    subtitle: 'Online research presentation and feedback session for finance and accounting research participants.',
    date: '2026-07-25T05:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=iimcalrss26&backgroundColor=3b82f6',
    type: 'upcoming',
    url: 'https://www.iimcal.ac.in/events/research-summer-school-2026',
  },
  {
    id: 'adamas-odoo-onsite-final-aug26',
    title: '🚀 Adamas University — 24-Hour Hackathon Final',
    subtitle: 'Final onsite coding marathon in Kolkata for shortlisted Odoo x Adamas University Hackathon teams.',
    date: '2026-08-08T04:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=adamasfinal26&backgroundColor=f97316',
    type: 'upcoming',
    url: 'https://unstop.com/hackathons/odoo-x-adamas-university-hackathon-2026-adamas-university-kolkata-1677914/amp',
  },
  {
    id: 'adamas-odoo-onsite-day-two-aug26',
    title: '🏁 Odoo x Adamas Hackathon — Final Day',
    subtitle: 'Teams complete prototypes and present working solutions during the Kolkata onsite finale.',
    date: '2026-08-09T04:30:00.000Z',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=adamaspitch26&backgroundColor=84cc16',
    type: 'upcoming',
    url: 'https://unstop.com/hackathons/odoo-x-adamas-university-hackathon-2026-adamas-university-kolkata-1677914/amp',
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
