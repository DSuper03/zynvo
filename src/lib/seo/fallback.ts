/**
 * Deterministic (no-AI) SEO fallback — used when Gemini is unavailable or the
 * response is malformed. Produces the same 7 fields + 3 title variants.
 */
import type { EventSeoInput, GeneratedSeo } from "./types";
import { slugify, cityFromCollege } from "./slugify";

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toIso(d?: string): string | undefined {
  if (!d) return undefined;
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? undefined : dt.toISOString();
  } catch {
    return undefined;
  }
}

export function generateFallbackSeo(input: EventSeoInput): GeneratedSeo {
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
    clubName,
    venue,
  } = input;

  const city = input.city || cityFromCollege(collegeName);
  const shortCollege = collegeName.split(",")[0].trim();
  const cleanDesc = stripHtml(description);

  const seoTitle = truncate(`${eventName} at ${shortCollege} — Register on Zynvo`, 60);

  const datePart = startDate
    ? ` on ${new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : "";
  const cityPart = city ? ` in ${city}` : "";
  const metaDescription = truncate(
    `Join ${eventName}${datePart} at ${shortCollege}${cityPart}. Register now on Zynvo!` +
      (cleanDesc ? ` ${cleanDesc}` : ""),
    155
  );

  const kwSet = new Set<string>();
  const add = (s: string) => { if (s.trim()) kwSet.add(s.trim().toLowerCase()); };
  add(eventName);
  add(shortCollege);
  if (city) add(city);
  if (eventMode) add(eventMode.toLowerCase());
  add("college event");
  add("campus event");
  add("student event");
  add(`${shortCollege} events`);
  if (city) add(`${city} college events`);
  add("zynvo");
  add("register event");
  add("college fest");
  if (eventMode) add(eventMode.toLowerCase() + " event");
  if (prizes) add("prizes");
  if (clubName) add(clubName.toLowerCase());
  const keywords = [...kwSet].slice(0, 15);

  const ogTitle = truncate(`${eventName} at ${shortCollege} — Zynvo`, 90);
  const ogDescription = truncate(
    cleanDesc || `${eventName} at ${collegeName}${datePart}. Discover and register on Zynvo.`,
    200
  );

  const slug = slugify(eventName, shortCollege, city);

  const locationObj: Record<string, unknown> =
    eventMode?.toLowerCase() === "online"
      ? { "@type": "VirtualLocation", url: eventUrl || "https://zynvo.social" }
      : {
          "@type": "Place",
          name: venue || collegeName,
          address: {
            "@type": "PostalAddress",
            name: collegeName,
            ...(city ? { addressLocality: city } : {}),
            addressCountry: "IN",
          },
        };

  const attendanceMode =
    eventMode?.toLowerCase() === "online"
      ? "https://schema.org/OnlineEventAttendanceMode"
      : eventMode?.toLowerCase() === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode";

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: truncate(cleanDesc || `${eventName} at ${collegeName}`, 300),
    ...(toIso(startDate) ? { startDate: toIso(startDate) } : {}),
    ...(toIso(endDate) ? { endDate: toIso(endDate) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: attendanceMode,
    location: locationObj,
    ...(posterUrl ? { image: posterUrl } : {}),
    organizer: {
      "@type": "Organization",
      name: clubName || shortCollege,
      url: "https://zynvo.social",
    },
    ...(contactEmail
      ? { performer: { "@type": "Organization", name: shortCollege, email: contactEmail } }
      : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      url: eventUrl || "https://zynvo.social",
      availability: "https://schema.org/InStock",
    },
  };

  const seoTitleVariants = [
    truncate(`Don't Miss ${eventName} at ${shortCollege}`, 60),
    truncate(`${eventName} — ${shortCollege}${cityPart} | Zynvo`, 60),
    truncate(`Register for ${eventName}${cityPart} | Zynvo`, 60),
  ];

  return {
    seoTitle,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    slug,
    structuredData,
    seoTitleVariants,
  };
}
