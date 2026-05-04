/**
 * SEO metadata generator for Zynvo event pages.
 *
 * Produces title, meta description, keywords, Open Graph fields,
 * a URL slug, and schema.org Event JSON-LD — all optimized for
 * Google CTR, discoverability, and student-friendly language.
 */

export interface EventSeoInput {
  eventName: string;
  collegeName: string;
  city?: string;
  eventType?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  eventMode?: string;
  posterUrl?: string;
  eventUrl?: string;
  prizes?: string;
  contactEmail?: string;
}

export interface EventSeoOutput {
  title: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  slug: string;
  jsonLd: Record<string, unknown>;
}

function cityFromCollege(college: string): string {
  if (!college) return "";
  const parts = college.split(",").map((s) => s.trim());
  if (parts.length >= 2) return parts[parts.length - 1];
  return "";
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toIso(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
  } catch {
    return undefined;
  }
}

const CTA_WORDS = [
  "Join", "Register for", "Don't Miss", "Discover", "Attend",
  "Be Part of", "Experience",
];

function pickCta(eventName: string): string {
  const hash = [...eventName].reduce((a, c) => a + c.charCodeAt(0), 0);
  return CTA_WORDS[hash % CTA_WORDS.length];
}

export function generateEventSeo(input: EventSeoInput): EventSeoOutput {
  const {
    eventName,
    collegeName,
    description = "",
    startDate,
    endDate,
    eventMode,
    posterUrl,
    eventUrl,
    prizes,
    contactEmail,
  } = input;

  const city = input.city || cityFromCollege(collegeName);
  const eventType = input.eventType || eventMode || "";
  const cleanDesc = stripHtml(description);
  const cta = pickCta(eventName);
  const shortCollege = collegeName.split(",")[0].trim();

  // --- Title (max 60 chars) ---
  let title = `${cta} ${eventName} at ${shortCollege}`;
  if (title.length > 60) title = `${eventName} — ${shortCollege}`;
  if (title.length > 60) title = `${eventName} | Zynvo`;
  title = truncate(title, 60);

  // --- Meta description (max 155 chars) ---
  const datePart = startDate
    ? ` on ${new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : "";
  const cityPart = city ? ` in ${city}` : "";
  const typePart = eventType ? ` ${eventType}` : "";
  let metaDescription = `${cta} ${eventName}${datePart} at ${shortCollege}${cityPart}. ${typePart ? typePart + " event." : ""} Register now on Zynvo!`;
  if (cleanDesc && metaDescription.length < 100) {
    metaDescription = `${metaDescription} ${cleanDesc}`;
  }
  metaDescription = truncate(metaDescription.replace(/\s+/g, " ").trim(), 155);

  // --- Keywords ---
  const kwSet = new Set<string>();
  const addKw = (s: string) => { if (s.trim()) kwSet.add(s.trim().toLowerCase()); };
  addKw(eventName);
  addKw(shortCollege);
  if (city) addKw(city);
  if (eventType) addKw(eventType);
  addKw("college event");
  addKw("campus event");
  addKw("student event");
  addKw(`${shortCollege} events`);
  if (city) addKw(`${city} college events`);
  addKw("zynvo");
  addKw("register event");
  addKw("college fest");
  if (eventMode) addKw(eventMode.toLowerCase() + " event");
  if (prizes) addKw("prizes");
  const keywords = [...kwSet].slice(0, 15).join(", ");

  // --- Open Graph ---
  const ogTitle = truncate(`${eventName} at ${shortCollege} — Zynvo`, 90);
  const ogDescription = truncate(
    cleanDesc ||
      `${eventName} at ${collegeName}${datePart}. Discover, register, and join campus events on Zynvo.`,
    200
  );

  // --- Slug ---
  const slugParts = [eventName, shortCollege];
  if (city) slugParts.push(city);
  const slug = slugify(slugParts.join(" "));

  // --- JSON-LD (schema.org Event) ---
  const locationObj: Record<string, unknown> = eventMode?.toLowerCase() === "online"
    ? {
        "@type": "VirtualLocation",
        url: eventUrl || "https://zynvo.in",
      }
    : {
        "@type": "Place",
        name: collegeName,
        address: {
          "@type": "PostalAddress",
          name: collegeName,
          ...(city ? { addressLocality: city } : {}),
          addressCountry: "IN",
        },
      };

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: truncate(cleanDesc || `${eventName} at ${collegeName}`, 300),
    ...(toIso(startDate) ? { startDate: toIso(startDate) } : {}),
    ...(toIso(endDate) ? { endDate: toIso(endDate) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      eventMode?.toLowerCase() === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : eventMode?.toLowerCase() === "hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location: locationObj,
    ...(posterUrl ? { image: posterUrl } : {}),
    organizer: {
      "@type": "Organization",
      name: shortCollege,
      url: "https://zynvo.in",
    },
    ...(contactEmail ? { performer: { "@type": "Organization", name: shortCollege, email: contactEmail } } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      url: eventUrl || "https://zynvo.in",
      availability: "https://schema.org/InStock",
    },
  };

  return {
    title,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    slug,
    jsonLd,
  };
}
