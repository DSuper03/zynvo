export type CollegeClubCategory =
  | "tech"
  | "culture"
  | "business"
  | "social"
  | "media"
  | "sports";

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
  latitude: 22.5726,
  longitude: 88.3639,
};

export const CLUB_DISCOVERY_RADIUS_METERS = 10000;

export const kolkataCollegeClubs: KolkataCollegeClub[] = [
  {
    id: "jadavpur-university-cultural-club",
    clubName: "Jadavpur University Cultural Club",
    collegeName: "Jadavpur University",
    area: "Jadavpur",
    address: "188, Raja S. C. Mallick Road, Jadavpur, Kolkata",
    latitude: 22.4969,
    longitude: 88.3716,
    category: "culture",
    tags: ["music", "theatre", "debate", "fest"],
    intensity: 10,
    description: "A major student activity hub around Jadavpur's arts, tech, music, and campus fest culture.",
  },
  {
    id: "st-xaviers-college-student-council",
    clubName: "St. Xavier's College Student Council",
    collegeName: "St. Xavier's College, Kolkata",
    area: "Park Street",
    address: "30, Mother Teresa Sarani, Kolkata",
    latitude: 22.5486,
    longitude: 88.3568,
    category: "culture",
    tags: ["management", "culture", "social", "fest"],
    intensity: 9,
    description: "Central Kolkata student body connected with cultural, commerce, finance, and social initiatives.",
  },
  {
    id: "presidency-university-students-clubs",
    clubName: "Presidency University Student Clubs",
    collegeName: "Presidency University",
    area: "College Street",
    address: "86/1, College Street, Kolkata",
    latitude: 22.5761,
    longitude: 88.3617,
    category: "culture",
    tags: ["literature", "research", "debate", "arts"],
    intensity: 8,
    description: "Historic College Street campus with strong academic, literature, debate, and culture circles.",
  },
  {
    id: "techno-main-salt-lake-campus-clubs",
    clubName: "Techno Main Salt Lake Campus Clubs",
    collegeName: "Techno Main Salt Lake",
    area: "Sector V, Salt Lake",
    address: "EM-4/1, Sector V, Salt Lake, Kolkata",
    latitude: 22.58,
    longitude: 88.438,
    category: "tech",
    tags: ["technology", "coding", "robotics", "fest"],
    intensity: 9,
    description: "Engineering campus cluster for technology, coding, entrepreneurship, and cultural events.",
  },
  {
    id: "heritage-institute-technology-clubs",
    clubName: "Heritage Institute Student Clubs",
    collegeName: "Heritage Institute of Technology",
    area: "Anandapur",
    address: "994, Madurdaha, Chowbaga Road, Anandapur, Kolkata",
    latitude: 22.5185,
    longitude: 88.4153,
    category: "tech",
    tags: ["engineering", "culture", "sports", "innovation"],
    intensity: 8,
    description: "Large private engineering campus with active technical, cultural, and sports communities.",
  },
  {
    id: "iem-salt-lake-student-clubs",
    clubName: "IEM Salt Lake Student Clubs",
    collegeName: "Institute of Engineering & Management",
    area: "Sector V, Salt Lake",
    address: "Y-12, Block EP, Sector V, Salt Lake, Kolkata",
    latitude: 22.5744,
    longitude: 88.4335,
    category: "tech",
    tags: ["coding", "startup", "engineering", "hackathon"],
    intensity: 8,
    description: "Salt Lake engineering club cluster known for technical events, startup activity, and competitions.",
  },
  {
    id: "scottish-church-college-clubs",
    clubName: "Scottish Church College Societies",
    collegeName: "Scottish Church College",
    area: "Hedua",
    address: "1 & 3, Urquhart Square, Kolkata",
    latitude: 22.588,
    longitude: 88.3676,
    category: "culture",
    tags: ["literature", "music", "heritage", "debate"],
    intensity: 7,
    description: "North Kolkata heritage college with student societies across culture, academics, and service.",
  },
  {
    id: "bethune-college-student-clubs",
    clubName: "Bethune College Student Clubs",
    collegeName: "Bethune College",
    area: "Hedua",
    address: "181, Bidhan Sarani, Kolkata",
    latitude: 22.5849,
    longitude: 88.3683,
    category: "social",
    tags: ["women-led", "culture", "literature", "social"],
    intensity: 7,
    description: "Historic women-led campus with active academic, cultural, and social student groups.",
  },
  {
    id: "loreto-college-clubs",
    clubName: "Loreto College Student Societies",
    collegeName: "Loreto College",
    area: "Middleton Row",
    address: "7, Sir William Jones Sarani, Kolkata",
    latitude: 22.5459,
    longitude: 88.3549,
    category: "social",
    tags: ["social work", "culture", "education", "arts"],
    intensity: 7,
    description: "Central Kolkata campus known for humanities, education, social outreach, and cultural societies.",
  },
  {
    id: "maulana-azad-college-clubs",
    clubName: "Maulana Azad College Clubs",
    collegeName: "Maulana Azad College",
    area: "Taltala",
    address: "8, Rafi Ahmed Kidwai Road, Kolkata",
    latitude: 22.5556,
    longitude: 88.3562,
    category: "culture",
    tags: ["science", "commerce", "literary", "culture"],
    intensity: 6,
    description: "Central Kolkata public college with academic and cultural student activity near Esplanade.",
  },
  {
    id: "asutosh-college-clubs",
    clubName: "Asutosh College Student Clubs",
    collegeName: "Asutosh College",
    area: "Bhowanipore",
    address: "92, Shyamaprasad Mukherjee Road, Kolkata",
    latitude: 22.5175,
    longitude: 88.3473,
    category: "culture",
    tags: ["arts", "science", "commerce", "fest"],
    intensity: 7,
    description: "South Kolkata student hub with cultural, academic, and event communities.",
  },
  {
    id: "goenka-college-clubs",
    clubName: "Goenka College Commerce Clubs",
    collegeName: "Goenka College of Commerce and Business Administration",
    area: "College Street",
    address: "210, Bepin Behari Ganguly Street, Kolkata",
    latitude: 22.5737,
    longitude: 88.3601,
    category: "business",
    tags: ["commerce", "finance", "business", "case-study"],
    intensity: 6,
    description: "Commerce-focused college community near College Street for finance and business students.",
  },
];
