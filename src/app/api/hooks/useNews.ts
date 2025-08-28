import { useState, useEffect } from 'react';

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  summary: string;
  source: string;
  date: string;
}

export interface NewsResponse {
  news: NewsItem[];
}

export function useNews() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching news from API...');
        const res = await fetch('https://zynvo-scrapper.vercel.app/news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Raw API response:', data);
        
        if (data && data.news && Array.isArray(data.news)) {
          setNewsData(data.news);
          console.log('News data set:', data.news);
        } else {
          console.warn('API response structure unexpected:', data);
          setError('Invalid data structure from API');
          setNewsData([]);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(`Failed to load news: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { newsData, loading, error, setNewsData };
}