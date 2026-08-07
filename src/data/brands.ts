// brands.ts - Mock data for Brands module

export interface BrandOffer {
  id: string;
  logo: string;
  brandName: string;
  category: string;
  offerBadge: string;
  offerDescription: string;
  expiry: string;
  about: string;
  terms: string;
  eligibility: string;
  website: string;
}

export interface Campaign {
  id: string;
  logo: string;
  campaignName: string;
  brand: string;
  location: string;
  contributionType: string[];
  expectedAudience: string;
  deadline: string;
  description: string;
  cities: string[];
  preferredEvents: string[];
  preferredAudience: string[];
  brandProvides: {
    cash?: boolean;
    merch?: boolean;
    coupons?: boolean;
    mentors?: boolean;
    workshop?: boolean;
    judges?: boolean;
    food?: boolean;
    media?: boolean;
    other?: string;
  };
  brandExpects: {
    logo?: boolean;
    instagramPost?: boolean;
    instagramReel?: boolean;
    booth?: boolean;
    banner?: boolean;
    qrCode?: boolean;
    workshopSlot?: boolean;
    leadCollection?: boolean;
    other?: string;
  };
  about: string;
  website: string;
}

export const BRAND_CATEGORIES = [
  'AI',
  'EdTech',
  'SaaS',
  'Food',
  'Fashion',
  'Finance',
  'Travel',
  'Web3',
  'Gaming',
  'Productivity',
] as const;

export const CAMPAIGN_CATEGORIES = [
  'Technology',
  'Food',
  'Merchandise',
  'Media',
  'Printing',
  'Photography',
  'Travel',
  'Finance',
  'Healthcare',
  'Gaming',
  'Education',
  'Startup',
  'Community',
] as const;

export const brandOffers: BrandOffer[] = [
  {
    id: 'github-student-pack',
    logo: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    brandName: 'GitHub',
    category: 'AI',
    offerBadge: 'Free',
    offerDescription: 'Developer tools worth $2000+',
    expiry: 'Valid till graduation',
    about: 'GitHub is the world\'s leading software development platform, providing hosting for software development and version control using Git.',
    terms: 'Must be a student with a valid school email address. Benefits include free GitHub Pro, Copilot free tier, and partner credits.',
    eligibility: 'Students aged 13+ with valid student ID or email',
    website: 'https://github.com/student',
  },
  {
    id: 'notion-education',
    logo: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
    brandName: 'Notion',
    category: 'Productivity',
    offerBadge: 'Free Plus Plan',
    offerDescription: 'Students & Teachers',
    expiry: 'Valid while enrolled',
    about: 'Notion is an all-in-one workspace for notes, tasks, wikis, and databases. Popular among students for project management.',
    terms: 'Sign up with your school email address. Includes unlimited blocks and file uploads.',
    eligibility: 'Students and faculty with .edu email address',
    website: 'https://www.notion.so/product/notion-for-education',
  },
  {
    id: 'canva-education',
    logo: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
    brandName: 'Canva',
    category: 'Productivity',
    offerBadge: 'Free',
    offerDescription: 'Canva Pro for Education',
    expiry: 'Valid while enrolled',
    about: 'Canva is a graphic design platform used to create social media graphics, presentations, posters, and other visual content.',
    terms: 'Free access to Pro features for educational purposes. Includes premium templates and AI tools.',
    eligibility: 'K-12 and higher education students and teachers',
    website: 'https://www.canva.com/education/',
  },
  {
    id: 'perplexity-student',
    logo: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128',
    brandName: 'Perplexity',
    category: 'AI',
    offerBadge: 'Student Offer',
    offerDescription: '1 Month Pro',
    expiry: 'Limited time offer',
    about: 'Perplexity AI is an AI-powered search engine that provides direct answers to questions with cited sources.',
    terms: 'One-time free month of Perplexity Pro. After trial, standard rates apply.',
    eligibility: 'Students with valid .edu email',
    website: 'https://www.perplexity.ai/',
  },
  {
    id: 'cursor-student',
    logo: 'https://www.google.com/s2/favicons?domain=cursor.sh&sz=128',
    brandName: 'Cursor',
    category: 'AI',
    offerBadge: '20% OFF',
    offerDescription: 'Student Discount',
    expiry: 'Valid while enrolled',
    about: 'Cursor is an AI-powered code editor designed to help developers write better code faster.',
    terms: '20% discount on Cursor Pro subscription. Must verify student status.',
    eligibility: 'University students with valid student ID',
    website: 'https://cursor.sh/',
  },
  {
    id: 'coding-ninjas',
    logo: 'https://www.google.com/s2/favicons?domain=codingninjas.com&sz=128',
    brandName: 'Coding Ninjas',
    category: 'EdTech',
    offerBadge: '30% OFF',
    offerDescription: 'Coding Courses',
    expiry: 'Valid till Dec 2025',
    about: 'Coding Ninjas is one of India\'s leading coding education platforms, offering courses in programming and development.',
    terms: 'Discount applies to select courses. Cannot be combined with other offers.',
    eligibility: 'College students in India',
    website: 'https://www.codingninjas.com/',
  },
  {
    id: 'algouniversity',
    logo: 'https://www.google.com/s2/favicons?domain=algouniversity.com&sz=128',
    brandName: 'AlgoUniversity',
    category: 'EdTech',
    offerBadge: 'Scholarship',
    offerDescription: 'Scholarship Program',
    expiry: 'Rolling admissions',
    about: 'AlgoUniversity offers intensive programs in DSA and system design with placement assistance.',
    terms: 'Merit-based scholarships available up to 100%. Requires application and interview.',
    eligibility: 'Final year students and recent graduates',
    website: 'https://algouniversity.com/',
  },
  {
    id: 'unstop-discount',
    logo: 'https://www.google.com/s2/favicons?domain=unstop.com&sz=128',
    brandName: 'Unstop',
    category: 'EdTech',
    offerBadge: 'Premium Discount',
    offerDescription: 'Interview Prep & Hackathons',
    expiry: 'Valid till March 2026',
    about: 'Unstop (formerly Dare2Compete) is a platform for students to discover competitions, hackathons, and opportunities.',
    terms: 'Discount on premium membership for unlimited access to practice problems and contests.',
    eligibility: 'Current college students',
    website: 'https://unstop.com/',
  },
  {
    id: 'interviewbuddy',
    logo: 'https://www.google.com/s2/favicons?domain=interviewbuddy.in&sz=128',
    brandName: 'InterviewBuddy',
    category: 'EdTech',
    offerBadge: 'Free',
    offerDescription: 'Free Mock Interview',
    expiry: 'One-time use',
    about: 'InterviewBuddy provides AI-powered mock interviews to help students prepare for job interviews.',
    terms: 'One free mock interview session. Additional sessions require premium subscription.',
    eligibility: 'College students and recent graduates',
    website: 'https://www.interviewbuddy.in/',
  },
  {
    id: 'internshala-resume',
    logo: 'https://www.google.com/s2/favicons?domain=internshala.com&sz=128',
    brandName: 'Internshala',
    category: 'EdTech',
    offerBadge: 'Free',
    offerDescription: 'Resume Review',
    expiry: 'Limited time',
    about: 'Internshala is India\'s largest internship and training platform connecting students with companies.',
    terms: 'Free resume review by experts. Includes feedback and improvement suggestions.',
    eligibility: 'College students seeking internships',
    website: 'https://internshala.com/',
  },
  {
    id: 'figma-education',
    logo: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    brandName: 'Figma',
    category: 'Productivity',
    offerBadge: 'Free',
    offerDescription: 'Education License',
    expiry: 'Valid while enrolled',
    about: 'Figma is a collaborative design tool used for UI/UX design, prototyping, and design systems.',
    terms: 'Free professional features for students and educators. Includes unlimited projects and collaborators.',
    eligibility: 'Students and faculty with .edu email',
    website: 'https://www.figma.com/education/',
  },
  {
    id: 'mongodb-atlas',
    logo: 'https://www.google.com/s2/favicons?domain=mongodb.com&sz=128',
    brandName: 'MongoDB',
    category: 'SaaS',
    offerBadge: 'Free Credits',
    offerDescription: 'Atlas Credits',
    expiry: 'Valid while enrolled',
    about: 'MongoDB is a leading NoSQL database platform with Atlas cloud database service.',
    terms: '$200 in Atlas credits for student projects. Free clusters and cloud credits.',
    eligibility: 'Students with GitHub Student Pack',
    website: 'https://www.mongodb.com/students',
  },
  {
    id: 'digitalocean',
    logo: 'https://www.google.com/s2/favicons?domain=digitalocean.com&sz=128',
    brandName: 'DigitalOcean',
    category: 'SaaS',
    offerBadge: 'Free Credits',
    offerDescription: 'Cloud Credits',
    expiry: 'Valid while enrolled',
    about: 'DigitalOcean is a cloud computing platform offering simple, reliable cloud infrastructure for developers.',
    terms: '$200 in cloud credits for students. Great for hosting projects and learning cloud computing.',
    eligibility: 'Students with GitHub Student Pack',
    website: 'https://www.digitalocean.com/github-students',
  },
  {
    id: 'linear-student',
    logo: 'https://www.google.com/s2/favicons?domain=linear.app&sz=128',
    brandName: 'Linear',
    category: 'Productivity',
    offerBadge: 'Free',
    offerDescription: 'Free Pro Plan',
    expiry: 'Valid while enrolled',
    about: 'Linear is a modern issue tracking tool for software teams, known for its sleek design and speed.',
    terms: 'Free Linear Pro for students. Includes unlimited issues and advanced features.',
    eligibility: 'Students with valid .edu email',
    website: 'https://linear.app/students',
  },
  {
    id: 'vercel-student',
    logo: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
    brandName: 'Vercel',
    category: 'SaaS',
    offerBadge: 'Free',
    offerDescription: 'Pro Plan Upgrade',
    expiry: 'Valid while enrolled',
    about: 'Vercel is a cloud platform for static sites and serverless functions, ideal for Next.js projects.',
    terms: 'Free Vercel Pro for students. Includes unlimited bandwidth and advanced deployments.',
    eligibility: 'Students with GitHub Student Pack',
    website: 'https://vercel.com/students',
  },
];

export const campaigns: Campaign[] = [
  {
    id: 'swiggy-freshers',
    logo: 'https://www.google.com/s2/favicons?domain=swiggy.com&sz=128',
    campaignName: 'Freshers Food Partnership',
    brand: 'Swiggy',
    location: 'Pan India',
    contributionType: ['Food Coupons', 'Winner Meals', 'Discount Codes'],
    expectedAudience: 'Freshers',
    deadline: '2025-09-15',
    description: 'Swiggy is looking to partner with college freshers events to provide food coupons and meals for winners.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    preferredEvents: ['Freshers Party', 'Cultural Fest', 'Orientation'],
    preferredAudience: ['First year students', 'Engineering', 'MBA'],
    brandProvides: {
      coupons: true,
      food: true,
    },
    brandExpects: {
      logo: true,
      instagramPost: true,
      instagramReel: true,
    },
    about: 'Swiggy is India\'s largest food delivery platform, connecting millions of customers with their favorite restaurants.',
    website: 'https://www.swiggy.com/',
  },
  {
    id: 'giftkart-hamper',
    logo: 'https://www.google.com/s2/favicons?domain=giftkart.com&sz=128',
    campaignName: 'Winner Hamper Campaign',
    brand: 'GiftKart',
    location: 'Tier 1 Cities',
    contributionType: ['Gift Hampers'],
    expectedAudience: 'Event Winners',
    deadline: '2025-10-01',
    description: 'GiftKart is providing 150 premium gift hampers for college events as winner prizes.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'],
    preferredEvents: ['Cultural Fest', 'Tech Fest', 'Sports Day'],
    preferredAudience: ['All students', 'Event participants'],
    brandProvides: {
      merch: true,
    },
    brandExpects: {
      logo: true,
      instagramReel: true,
    },
    about: 'GiftKart is a premium gifting platform offering curated gift hampers for all occasions.',
    website: 'https://www.giftkart.com/',
  },
  {
    id: 'coding-ninjas-workshop',
    logo: 'https://www.google.com/s2/favicons?domain=codingninjas.com&sz=128',
    campaignName: 'Campus Workshop Tour',
    brand: 'Coding Ninjas',
    location: 'Pan India',
    contributionType: ['Mentors', 'Speaker', 'Scholarship'],
    expectedAudience: 'Coding Students',
    deadline: '2025-12-31',
    description: 'Coding Ninjas is conducting a campus workshop tour with expert mentors and scholarship opportunities.',
    cities: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'],
    preferredEvents: ['Workshop', 'Tech Fest', 'Coding Competition'],
    preferredAudience: ['CS/IT students', 'Developers'],
    brandProvides: {
      mentors: true,
      workshop: true,
    },
    brandExpects: {
      workshopSlot: true,
      instagramPost: true,
    },
    about: 'Coding Ninjas is India\'s leading coding education platform with expert instructors and placement support.',
    website: 'https://www.codingninjas.com/',
  },
  {
    id: 'redbull-energy',
    logo: 'https://www.google.com/s2/favicons?domain=redbull.com&sz=128',
    campaignName: 'Energy Partner',
    brand: 'Red Bull',
    location: 'Pan India',
    contributionType: ['Drinks'],
    expectedAudience: 'Event Attendees',
    deadline: '2025-11-30',
    description: 'Red Bull is looking to be the energy drink partner for college fests and events.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'],
    preferredEvents: ['Cultural Fest', 'Tech Fest', 'Sports Events', 'Hackathons'],
    preferredAudience: ['All students'],
    brandProvides: {
      food: true,
    },
    brandExpects: {
      booth: true,
      banner: true,
    },
    about: 'Red Bull is an energy drink brand known for supporting extreme sports and youth events.',
    website: 'https://www.redbull.com/',
  },
  {
    id: 'boat-merch',
    logo: 'https://www.google.com/s2/favicons?domain=boat-lifestyle.com&sz=128',
    campaignName: 'Merchandise Campaign',
    brand: 'Boat',
    location: 'Metro Cities',
    contributionType: ['Headphones', 'Gifts'],
    expectedAudience: 'Tech Enthusiasts',
    deadline: '2025-10-15',
    description: 'Boat is providing headphones and merchandise as prizes for tech fests and cultural events.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    preferredEvents: ['Tech Fest', 'Cultural Fest', 'Music Events'],
    preferredAudience: ['Music lovers', 'Tech students'],
    brandProvides: {
      merch: true,
    },
    brandExpects: {
      logo: true,
      instagramPost: true,
    },
    about: 'Boat is India\'s leading consumer electronics brand known for audio products and smart wearables.',
    website: 'https://www.boat-lifestyle.com/',
  },
  {
    id: 'zomato-coupons',
    logo: 'https://www.google.com/s2/favicons?domain=zomato.com&sz=128',
    campaignName: 'Food Coupons',
    brand: 'Zomato',
    location: 'Tier 1 & 2 Cities',
    contributionType: ['Food Coupons'],
    expectedAudience: 'Event Participants',
    deadline: '2025-09-30',
    description: 'Zomato is offering food coupons for college events and competitions.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'],
    preferredEvents: ['All College Events'],
    preferredAudience: ['All students'],
    brandProvides: {
      coupons: true,
    },
    brandExpects: {
      logo: true,
      qrCode: true,
    },
    about: 'Zomato is India\'s leading food delivery and restaurant discovery platform.',
    website: 'https://www.zomato.com/',
  },
  {
    id: 'devfolio-hackathon',
    logo: 'https://www.google.com/s2/favicons?domain=devfolio.co&sz=128',
    campaignName: 'Hackathon Partner',
    brand: 'Devfolio',
    location: 'Pan India',
    contributionType: ['Grants', 'Mentors'],
    expectedAudience: 'Hackers',
    deadline: '2025-12-31',
    description: 'Devfolio is partnering with college hackathons to provide grants and mentorship.',
    cities: ['All major cities'],
    preferredEvents: ['Hackathons', 'Dev Sprints'],
    preferredAudience: ['Developers', 'CS/IT students'],
    brandProvides: {
      cash: true,
      mentors: true,
    },
    brandExpects: {
      logo: true,
      leadCollection: true,
    },
    about: 'Devfolio is a platform for hackathon organizers and participants, connecting developers with opportunities.',
    website: 'https://devfolio.co/',
  },
  {
    id: 'polygon-web3',
    logo: 'https://www.google.com/s2/favicons?domain=polygon.technology&sz=128',
    campaignName: 'Web3 Sponsorship',
    brand: 'Polygon',
    location: 'Global',
    contributionType: ['Prize Pool', 'Credits', 'Judges'],
    expectedAudience: 'Web3 Developers',
    deadline: '2025-11-15',
    description: 'Polygon is sponsoring Web3 and blockchain events with prize pools and technical judges.',
    cities: ['Global Remote'],
    preferredEvents: ['Web3 Hackathons', 'Blockchain Workshops', 'Crypto Conferences'],
    preferredAudience: ['Blockchain developers', 'Web3 enthusiasts'],
    brandProvides: {
      cash: true,
      judges: true,
    },
    brandExpects: {
      logo: true,
      workshopSlot: true,
      banner: true,
    },
    about: 'Polygon is a leading blockchain platform for Ethereum scaling and infrastructure development.',
    website: 'https://polygon.technology/',
  },
  {
    id: 'mastra-ai-workshop',
    logo: 'https://www.google.com/s2/favicons?domain=mastra.ai&sz=128',
    campaignName: 'AI Workshop Series',
    brand: 'Mastra AI',
    location: 'Bangalore, Delhi',
    contributionType: ['Credits', 'Speakers'],
    expectedAudience: 'AI Enthusiasts',
    deadline: '2025-10-30',
    description: 'Mastra AI is conducting AI workshops with expert speakers and cloud credits.',
    cities: ['Bangalore', 'Delhi NCR'],
    preferredEvents: ['AI Workshops', 'Tech Fests', 'ML Conferences'],
    preferredAudience: ['AI/ML students', 'Data science enthusiasts'],
    brandProvides: {
      mentors: true,
      workshop: true,
    },
    brandExpects: {
      workshopSlot: true,
      instagramReel: true,
    },
    about: 'Mastra AI is an artificial intelligence company focused on building practical AI solutions for businesses.',
    website: 'https://mastra.ai/',
  },
  {
    id: 'algorand-web3',
    logo: 'https://www.google.com/s2/favicons?domain=algorand.com&sz=128',
    campaignName: 'Web3 University Tour',
    brand: 'Algorand',
    location: 'Pan India',
    contributionType: ['Cash Sponsorship', 'Mentors', 'Prize Pool'],
    expectedAudience: 'Blockchain Students',
    deadline: '2026-01-31',
    description: 'Algorand is conducting a university tour to educate students about blockchain technology.',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'],
    preferredEvents: ['Tech Fests', 'Blockchain Workshops', 'Dev Sprints'],
    preferredAudience: ['CS/IT students', 'Finance students'],
    brandProvides: {
      cash: true,
      mentors: true,
    },
    brandExpects: {
      booth: true,
      banner: true,
      leadCollection: true,
    },
    about: 'Algorand is a blockchain platform focused on building a borderless economy through decentralized technology.',
    website: 'https://algorand.com/',
  },
];