import { MetadataRoute } from 'next';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

async function getClubs() {
  // Implement your club fetching logic here
  return []; // Return array of club IDs/slugs
}

async function getEvents() {
  // Implement your event fetching logic here
  return []; // Return array of event IDs/slugs
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zynvo.social';

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 1,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/clubs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/createPost`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFreq,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/clubs/createclub`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFreq,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/clubs/joinclub`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.7,
    },
  ];

  // Dynamic routes
  const clubs = await getClubs();
  const clubRoutes = clubs.map((clubId) => ({
    url: `${baseUrl}/clubs/${clubId}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFreq,
    priority: 0.7,
  }));

  const events = await getEvents();
  const eventRoutes = events.map((eventId) => ({
    url: `${baseUrl}/events/${eventId}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFreq,
    priority: 0.7,
  }));

  return [...staticRoutes, ...clubRoutes, ...eventRoutes];
} 