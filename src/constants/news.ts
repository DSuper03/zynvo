/**

 @author SwarnenduG07,
 @description: this is the cont file fo the neww page from here we are exporting the dummy news data and the categories and the styles for the news page
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  source: string;
  url: string;
  readTime?: number;
}

export const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News', icon: '📰' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '📈' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '🎓' },
] as const;

export const CATEGORY_STYLES: Record<string, string> = {
  technology: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  business: 'bg-yellow-600/20 text-yellow-200 border border-yellow-600/30',
  sports: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  science: 'bg-yellow-400/20 text-yellow-100 border border-yellow-400/30',
  entertainment: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  education: 'bg-yellow-300/20 text-yellow-100 border border-yellow-300/30',
  default: 'bg-gray-700/30 text-gray-300 border border-gray-600/30',
};

export const MOCK_NEWS_DATA: NewsArticle[] = [
  {
    id: '1',
    title: 'IIT Bombay Launches New AI Research Center',
    description:
      'IIT Bombay inaugurates a state-of-the-art Artificial Intelligence research center, aiming to foster innovation and collaboration among students and faculty.',
    imageUrl:
      'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-15T10:30:00Z',
    category: 'technology',
    source: 'Campus Chronicle',
    url: '#',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Delhi University Students Win National Debate Championship',
    description:
      'A team from Delhi University clinched the top spot at the National Debate Championship, showcasing exceptional talent and critical thinking.',
    imageUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-14T15:45:00Z',
    category: 'education',
    source: 'DU Times',
    url: '#',
    readTime: 4,
  },
  {
    id: '3',
    title: 'IIM Ahmedabad Hosts Annual Business Summit',
    description:
      'IIM Ahmedabad’s annual business summit attracts top industry leaders and students for discussions on entrepreneurship and innovation.',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-13T09:20:00Z',
    category: 'business',
    source: 'Business Journal',
    url: '#',
    readTime: 6,
  },
  {
    id: '4',
    title: 'NIT Trichy Students Develop Solar-Powered Vehicle',
    description:
      'Engineering students at NIT Trichy unveil a solar-powered vehicle prototype, aiming to promote sustainable transportation on campus.',
    imageUrl:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-12T20:15:00Z',
    category: 'science',
    source: 'Science Today',
    url: '#',
    readTime: 5,
  },
  {
    id: '5',
    title: 'SRCC Organizes Inter-College Sports Meet',
    description:
      'Shri Ram College of Commerce (SRCC), Delhi, hosts an inter-college sports meet with participation from over 30 colleges across India.',
    imageUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-11T14:30:00Z',
    category: 'sports',
    source: 'Sports Central',
    url: '#',
    readTime: 3,
  },
  {
    id: '6',
    title: 'Film Festival Showcases Student Creativity',
    description:
      'The annual student film festival features innovative short films and documentaries, highlighting the creative talents of students from various disciplines.',
    imageUrl:
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-10T11:00:00Z',
    category: 'entertainment',
    source: 'Campus Buzz',
    url: '#',
    readTime: 6,
  },
  {
    id: '7',
    title: 'Tech Symposium Explores Future of AI',
    description:
      'Experts and industry leaders gather at the Tech Symposium to discuss the future of AI, its ethical implications, and potential impact on society.',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-09T16:20:00Z',
    category: 'technology',
    source: 'Tech Today',
    url: '#',
    readTime: 5,
  },
  {
    id: '8',
    title: 'University Research Grants Open for Applications',
    description:
      'The university invites applications for research grants aimed at supporting innovative projects and initiatives by students and faculty.',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-08T12:15:00Z',
    category: 'education',
    source: 'Research Weekly',
    url: '#',
    readTime: 4,
  },
];

export const SORT_OPTIONS = [
  { id: 'latest', name: 'Latest', icon: 'Calendar' },
  { id: 'trending', name: 'Trending', icon: 'TrendingUp' },
  { id: 'popular', name: 'Popular', icon: 'Star' },
] as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;
