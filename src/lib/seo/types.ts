/**
 * Core SEO types for the Zynvo event SEO system.
 */

export interface EventSeoInput {
  eventId: string;
  eventName: string;
  collegeName: string;
  city?: string;
  eventType?: string;
  eventMode?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  posterUrl?: string;
  eventUrl?: string;
  prizes?: string;
  contactEmail?: string;
  clubName?: string;
  venue?: string;
}

export interface GeneratedSeo {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  slug: string;
  structuredData: Record<string, unknown>;
  seoTitleVariants: string[];
}

export interface StoredEventSeo extends GeneratedSeo {
  eventId: string;
  eventName: string;
  collegeName: string;
  createdAt: string;
  updatedAt: string;
}
