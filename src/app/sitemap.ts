import { MetadataRoute } from "next";
import { getAllSeo } from "@/lib/seo/store";
import { collegesWithClubs } from "@/components/colleges/college";

const SITE = "https://zynvo.social";

/**
 * Dynamic sitemap generated at build time (and on-demand via ISR).
 *
 * Includes:
 * 1. Static marketing pages
 * 2. All SEO-indexed event pages (/events/s/[slug])
 * 3. College pages (derived from the college list)
 * 4. State/city pages (derived from college list)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── 1. Static pages ──────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
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
    { url: `${SITE}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/feedback`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // ── 2. Event pages (from SEO store) ──────────────────────────────────
  const seoRecords = getAllSeo();
  const eventPages: MetadataRoute.Sitemap = seoRecords.map((seo) => ({
    url: `${SITE}/events/s/${seo.slug}`,
    lastModified: seo.updatedAt || now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ── 3. College pages ─────────────────────────────────────────────────
  const slugifySimple = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const collegeSlugs = new Set<string>();
  const collegePages: MetadataRoute.Sitemap = [];
  for (const c of collegesWithClubs) {
    const slug = slugifySimple(c.college);
    if (!collegeSlugs.has(slug)) {
      collegeSlugs.add(slug);
      collegePages.push({
        url: `${SITE}/colleges/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  // ── 4. State / city pages ────────────────────────────────────────────
  const stateSet = new Set<string>();
  const statePages: MetadataRoute.Sitemap = [];
  for (const c of collegesWithClubs) {
    const state = (c.State || "").trim();
    if (state && !stateSet.has(state)) {
      stateSet.add(state);
      statePages.push({
        url: `${SITE}/cities/${slugifySimple(state)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      });
    }
  }

  return [...staticPages, ...eventPages, ...collegePages, ...statePages];
}
