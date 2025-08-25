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
    title: 'Revolutionary AI Breakthrough Changes How We Learn',
    description: 'Scientists develop new AI technology that personalizes education for millions of students worldwide, promising to revolutionize the learning experience with adaptive algorithms.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop&auto=format',
    publishedAt: '2024-01-08T12:15:00Z',
    category: 'technology',
    source: 'Tech Innovation Weekly',
    url: '#',
    readTime: 5
  }
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
