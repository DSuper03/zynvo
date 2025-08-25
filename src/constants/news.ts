/**
 * News constants and mock data for the news page
 * This file centralizes news-related data and configurations
 */

/**
 * Interface for news article data structure
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

/**
 * News categories for filtering
 */
export const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News', icon: '📰' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '📈' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '🎓' },
] as const;

/**
 * Category styles mapping for consistent UI theming
 */
export const CATEGORY_STYLES: Record<string, string> = {
  technology: 'bg-blue-900/30 text-blue-300',
  business: 'bg-green-900/30 text-green-300',
  sports: 'bg-orange-900/30 text-orange-300',
  science: 'bg-purple-900/30 text-purple-300',
  entertainment: 'bg-pink-900/30 text-pink-300',
  education: 'bg-amber-900/30 text-amber-300',
  default: 'bg-gray-900/30 text-gray-300',
};

/**
 * Mock news data for development and testing
 * In production, this would be replaced with API calls
 */
export const MOCK_NEWS_DATA: NewsArticle[] = [
  {
    id: '1',
    title: 'Revolutionary AI Breakthrough Changes How We Learn',
    description: 'Scientists develop new AI technology that personalizes education for millions of students worldwide, promising to revolutionize the learning experience with adaptive algorithms.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    publishedAt: '2024-01-15T10:30:00Z',
    category: 'technology',
    source: 'TechNews Today',
    url: '#',
    readTime: 5
  },
  {
    id: '2',
    title: 'Global Climate Summit Yields Promising Results',
    description: 'World leaders commit to ambitious new environmental goals during the annual climate summit, with concrete plans for sustainable development and carbon neutrality.',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb5894c9?w=800&h=450&fit=crop',
    publishedAt: '2024-01-14T15:45:00Z',
    category: 'science',
    source: 'Global News Network',
    url: '#',
    readTime: 7
  },
  {
    id: '3',
    title: 'Startup Revolutionizes Remote Education Platform',
    description: 'New platform connects students globally, offering immersive learning experiences through virtual reality and AI-powered tutoring systems for enhanced engagement.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop',
    publishedAt: '2024-01-13T09:20:00Z',
    category: 'education',
    source: 'Education Weekly',
    url: '#',
    readTime: 4
  },
  {
    id: '4',
    title: 'Major Sports Championship Breaks Viewership Records',
    description: 'Historic championship game attracts over 100 million viewers worldwide, setting new records for digital streaming platforms and traditional broadcast media.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    publishedAt: '2024-01-12T20:15:00Z',
    category: 'sports',
    source: 'Sports Central',
    url: '#',
    readTime: 3
  },
  {
    id: '5',
    title: 'Entertainment Industry Embraces New Technologies',
    description: 'Film studios and streaming platforms invest heavily in virtual production techniques and immersive storytelling experiences, transforming how content is created.',
    imageUrl: 'https://images.unsplash.com/photo-1489599160327-b77d5b4ba5be?w=800&h=450&fit=crop',
    publishedAt: '2024-01-11T14:30:00Z',
    category: 'entertainment',
    source: 'Entertainment Today',
    url: '#',
    readTime: 6
  },
  {
    id: '6',
    title: 'Business Innovation Drives Economic Growth',
    description: 'Quarterly reports show significant growth in the tech sector, with emerging companies leading the charge in sustainable business practices and digital transformation.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
    publishedAt: '2024-01-10T11:00:00Z',
    category: 'business',
    source: 'Business Journal',
    url: '#',
    readTime: 8
  },
  {
    id: '7',
    title: 'Breakthrough in Renewable Energy Storage',
    description: 'Scientists announce major advancement in battery technology that could store renewable energy for weeks, revolutionizing the green energy landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=450&fit=crop',
    publishedAt: '2024-01-09T16:20:00Z',
    category: 'science',
    source: 'Science Today',
    url: '#',
    readTime: 6
  },
  {
    id: '8',
    title: 'Tech Giants Collaborate on Open Source Initiative',
    description: 'Major technology companies announce unprecedented collaboration on open source projects, aiming to accelerate innovation and improve global accessibility.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop',
    publishedAt: '2024-01-08T12:15:00Z',
    category: 'technology',
    source: 'Tech Innovation Weekly',
    url: '#',
    readTime: 5
  }
];

/**
 * Sort options for news articles
 */
export const SORT_OPTIONS = [
  { id: 'latest', name: 'Latest', icon: 'Calendar' },
  { id: 'trending', name: 'Trending', icon: 'TrendingUp' },
  { id: 'popular', name: 'Popular', icon: 'Star' },
] as const;

/**
 * Default pagination settings
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;
