export type CollegeClubCategory =
  | 'tech'
  | 'culture'
  | 'business'
  | 'social'
  | 'media'
  | 'sports';

export interface KolkataCollegeClub {
  id: string;
  clubName: string;
  collegeName: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  category: CollegeClubCategory;
  tags: string[];
  intensity: number;
  description: string;
}

export const KOLKATA_CENTER = {
  latitude: 23.6,
  longitude: 87.4,
};

export const CLUB_DISCOVERY_RADIUS_METERS = 250000;

export const kolkataCollegeClubs: KolkataCollegeClub[] = [
  {
    id: 'kgec-robotic-society',
    clubName: 'KGEC Robotic Society',
    collegeName: 'Kalyani Government Engineering College',
    area: 'Kalyani',
    address: 'Kalyani Government Engineering College, Kalyani, West Bengal',
    latitude: 22.9756,
    longitude: 88.4346,
    category: 'tech',
    tags: ['robotics', 'engineering', 'innovation', 'automation'],
    intensity: 9,
    description:
      'Robotics-focused student community at Kalyani Government Engineering College.',
  },
  {
    id: 'code-nest-nshm-durgapur',
    clubName: 'Code Nest',
    collegeName: 'NSHM Knowledge Campus Durgapur',
    area: 'Durgapur',
    address: 'NSHM Knowledge Campus Durgapur, West Bengal',
    latitude: 23.5204,
    longitude: 87.3119,
    category: 'tech',
    tags: ['coding', 'development', 'programming', 'hackathon'],
    intensity: 9,
    description:
      'Coding and developer community at NSHM Knowledge Campus Durgapur.',
  },
  {
    id: 'optimist-tmsl',
    clubName: 'Optimist',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'social',
    tags: ['community', 'student', 'campus', 'leadership'],
    intensity: 8,
    description: 'Student community based at Techno Main Salt Lake.',
  },
  {
    id: 'eclectica-tmsl',
    clubName: 'Eclectica (TMSL)',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['culture', 'fest', 'events', 'campus'],
    intensity: 9,
    description: 'Campus cultural community at Techno Main Salt Lake.',
  },
  {
    id: 'gdg-on-campus-tmsl',
    clubName: 'GDG On Campus, TMSL',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'tech',
    tags: ['google developers', 'technology', 'coding', 'community'],
    intensity: 10,
    description:
      'Google Developer Groups on Campus chapter at Techno Main Salt Lake.',
  },
  {
    id: 'iet-student-chapter-cac',
    clubName: 'IET Student Chapter, CAC',
    collegeName: 'Academy of Technology',
    area: 'Adisaptagram',
    address: 'Academy of Technology, Adisaptagram, West Bengal',
    latitude: 22.7412,
    longitude: 88.3468,
    category: 'tech',
    tags: ['iet', 'engineering', 'technology', 'student chapter'],
    intensity: 8,
    description: 'IET student chapter community at Academy of Technology.',
  },
  {
    id: 'ieee-jadavpur-university-student-branch',
    clubName: 'IEEE Jadavpur University Student Branch',
    collegeName: 'Jadavpur University',
    area: 'Jadavpur',
    address: 'Jadavpur University, Kolkata, West Bengal',
    latitude: 22.499,
    longitude: 88.3702,
    category: 'tech',
    tags: ['ieee', 'engineering', 'research', 'technology'],
    intensity: 10,
    description: 'IEEE student branch at Jadavpur University.',
  },
  {
    id: 'asbtc-delhi-technical-campus',
    clubName: 'ASBTC',
    collegeName: 'Delhi Technical Campus',
    area: 'Greater Noida',
    address: 'Delhi Technical Campus, Greater Noida, Uttar Pradesh',
    latitude: 28.4748,
    longitude: 77.5032,
    category: 'business',
    tags: ['business', 'technology', 'student community', 'campus'],
    intensity: 7,
    description: 'Student community at Delhi Technical Campus.',
  },
  {
    id: 'moksha-eclectica-tmsl',
    clubName: 'Moksha Eclectica',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['culture', 'events', 'fest', 'campus'],
    intensity: 8,
    description: 'Cultural and event community at Techno Main Salt Lake.',
  },
];
