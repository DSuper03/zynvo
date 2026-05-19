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
    clubName: 'KGEC Robotics Society',
    collegeName: 'Kalyani Government Engineering College, Kalyani',
    area: 'Kalyani',
    address:
      'Kalyani Government Engineering College, Kalyani, Nadia, West Bengal',
    latitude: 22.9756,
    longitude: 88.4346,
    category: 'tech',
    tags: ['robotics', 'engineering', 'automation', 'innovation'],
    intensity: 9,
    description:
      'Official robotics club at KGEC — builders and tech enthusiasts designing intelligent systems and automation for real-world problems.',
  },
  {
    id: 'code-nest-nshm-durgapur',
    clubName: 'CodeNEST',
    collegeName: 'NSHM Knowledge Campus, Durgapur, West Bengal',
    area: 'Durgapur',
    address: 'NSHM Knowledge Campus, Durgapur, West Bengal',
    latitude: 23.5204,
    longitude: 87.3119,
    category: 'tech',
    tags: ['coding', 'development', 'community', 'campus'],
    intensity: 9,
    description:
      'Student tech community at NSHM Knowledge Campus Durgapur — 400+ members learning, building, and collaborating.',
  },
  {
    id: 'opinionists-eclectica-tmsl',
    clubName: 'Opinionists-Eclectica',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['debate', 'public speaking', 'eclectica', 'disputatio'],
    intensity: 9,
    description:
      'Official debate club of Eclectica at TMSL — argumentation, critical thinking, and competitive debating; organizes Disputatio and competes nationally.',
  },
  {
    id: 'eclectica-tmsl',
    clubName: 'Eclectica',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['literary', 'seminars', 'workshops', 'campus'],
    intensity: 10,
    description:
      'Literary committee of Techno Main Salt Lake — seminars, webinars, competitions, and workshops for expression, debating, drama, and quizzing, plus an official student blog.',
  },
  {
    id: 'gdg-on-campus-tmsl',
    clubName: 'GDG on Campus TMSL',
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
    id: 'moksha-eclectica-tmsl',
    clubName: 'Moksha-Eclectica',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['drama', 'theatre', 'eclectica', 'campus'],
    intensity: 8,
    description:
      'Official drama society of Eclectica at Techno Main Salt Lake — theatre, scripting, and stage craft.',
  },
  {
    id: 'qzone-eclectica-tmsl',
    clubName: 'Qzone-Eclectica',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['quiz', 'eclectica', 'competition', 'campus'],
    intensity: 9,
    description:
      'Official quizzing society of TMSL and child society of Eclectica — college, open, pop culture, and technical quizzes.',
  },
  {
    id: 'taste-buds-society-tmsl',
    clubName: 'Taste Buds Society',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'culture',
    tags: ['food', 'culinary', 'campus', 'literary'],
    intensity: 7,
    description:
      'Campus food and culinary-interest society at Techno Main Salt Lake.',
  },
  {
    id: 'zynvo-tmsl',
    clubName: 'Zynvo',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'social',
    tags: ['community', 'campus', 'official'],
    intensity: 8,
    description: 'Official Zynvo campus club at Techno Main Salt Lake.',
  },
  {
    id: 'zynvo-social-tech-club-tmsl',
    clubName: 'Zynvo-Social Tech club',
    collegeName: 'Techno Main Salt Lake',
    area: 'Salt Lake',
    address: 'Techno Main Salt Lake, Kolkata, West Bengal',
    latitude: 22.5766,
    longitude: 88.4277,
    category: 'tech',
    tags: ['technology', 'social', 'campus', 'community'],
    intensity: 8,
    description:
      'Social tech club at Techno Main Salt Lake connecting builders and campus peers.',
  },
  {
    id: 'iei-students-chapter-cse-aot',
    clubName: "IEI Students' Chapter CSE",
    collegeName: 'Academy of Technology',
    area: 'Adisaptagram',
    address:
      'Academy of Technology, Adisaptagram, Hooghly, West Bengal 712502',
    latitude: 22.7412,
    longitude: 88.3468,
    category: 'tech',
    tags: ['iei', 'cse', 'engineering', 'student chapter'],
    intensity: 8,
    description:
      'IEI Students\' Chapter CSE at Academy of Technology — tech community, events, and outreach.',
  },
  {
    id: 'pandemonium-rkm-vidyamandira-belur',
    clubName: 'PANDEMONIUM',
    collegeName: 'Ramakrishna Mission Vidyamandira',
    area: 'Belur Math',
    address: 'Ramakrishna Mission Vidyamandira, Belur Math, Howrah, West Bengal',
    latitude: 22.6324,
    longitude: 88.3564,
    category: 'tech',
    tags: ['events', 'campus', 'technology'],
    intensity: 8,
    description:
      'Campus tech and events collective at Ramakrishna Mission Vidyamandira, Belur.',
  },
  {
    id: 'enactus-iit-delhi',
    clubName: 'Enactus',
    collegeName: 'Indian Institute of Technology Delhi',
    area: 'Hauz Khas',
    address: 'IIT Delhi, Hauz Khas, New Delhi 110016',
    latitude: 28.5449,
    longitude: 77.1925,
    category: 'business',
    tags: ['social entrepreneurship', 'community', 'impact', 'student'],
    intensity: 9,
    description:
      'Working toward positive social change through community projects and advocacy.',
  },
  {
    id: 'the-ace-dtc-greater-noida',
    clubName: 'THE ACE DTC',
    collegeName: 'Delhi Technical Campus',
    area: 'Greater Noida',
    address:
      'Delhi Technical Campus, Knowledge Park III, Greater Noida, Uttar Pradesh 201306',
    latitude: 28.4746766,
    longitude: 77.4764806,
    category: 'tech',
    tags: ['ar/vr', 'blockchain', 'ai', 'student chapter'],
    intensity: 9,
    description:
      'ACE DTC Student Chapter — workshops and projects on emerging tech including AI, AR/VR, and blockchain.',
  },
];
