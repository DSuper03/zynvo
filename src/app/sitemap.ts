import { MetadataRoute } from "next";
import { getAllSeo } from "@/lib/seo/store";

const SITE = "https://zynvosocial.com";

/**
 * Dynamic sitemap generated at build time (and on-demand via ISR).
 *
 * Includes:
 * 1. Static marketing + audience landing pages
 * 2. All SEO-indexed event pages (/events/s/[slug])
 *
 * College/city programmatic pages are omitted until routes ship with real data
 * (avoids soft-404 sitemap orphans).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/for-students`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/for-clubs`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/for-colleges`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/club-management-software`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/campus-event-app`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/student-engagement-platform`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/auth/signup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/auth/signin`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/discover`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/clubs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/zyncers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE}/ai`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE}/founders`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/founders/story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/feedback`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const seoRecords = getAllSeo();
  const eventPages: MetadataRoute.Sitemap = seoRecords.map((seo) => ({
    url: `${SITE}/events/s/${seo.slug}`,
    lastModified: seo.updatedAt || now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...eventPages];
}
