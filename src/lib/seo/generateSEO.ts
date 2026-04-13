/**
 * AI-powered SEO generation for Zynvo event pages.
 *
 * Uses Google Gemini to produce high-converting, search-optimized metadata.
 * Falls back to deterministic generation when the AI is unavailable or returns
 * malformed data. Retries once on parse failure.
 */
import { GoogleGenAI } from "@google/genai";
import type { EventSeoInput, GeneratedSeo } from "./types";
import { generateFallbackSeo } from "./fallback";
import { slugify, cityFromCollege } from "./slugify";

const MODEL = process.env.GOOGLE_AI_MODEL || process.env.NEXT_PUBLIC_GOOGLE_AI_MODEL || "gemini-2.5-flash";

const SEO_SYSTEM_PROMPT = `You are an expert SEO strategist for Zynvo, an agentic social media platform where college students discover campus events in India.

Generate high-converting, search-optimized metadata for the given event.

RULES:
- Prioritize high-intent keywords: event name + college + city
- Make titles emotionally engaging and curiosity-driven
- Optimize for Google CTR and discoverability
- Use student-friendly, action-oriented language (Join, Register, Don't Miss, Discover)
- Naturally include location (city + college)
- Clearly reflect event type / mode
- Output ONLY valid JSON — no markdown fences, no explanation

OUTPUT SCHEMA (strict JSON):
{
  "seoTitle": "max 60 characters",
  "metaDescription": "max 155 characters",
  "keywords": ["10 to 15 comma-separated keywords"],
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "slug": "seo-friendly-lowercase-hyphenated-url-slug",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "...",
    "startDate": "ISO 8601",
    "location": { ... },
    "description": "..."
  },
  "seoTitleVariants": ["alt title 1", "alt title 2", "alt title 3"]
}`;

function buildUserPrompt(input: EventSeoInput): string {
  const city = input.city || cityFromCollege(input.collegeName);
  return JSON.stringify(
    {
      event_name: input.eventName,
      college_name: input.collegeName,
      city: city || undefined,
      event_type: input.eventType || input.eventMode || undefined,
      event_mode: input.eventMode || undefined,
      short_description: (input.description || "").slice(0, 500),
      start_date: input.startDate || undefined,
      end_date: input.endDate || undefined,
      club_name: input.clubName || undefined,
      venue: input.venue || undefined,
      has_prizes: !!input.prizes,
    },
    null,
    2
  );
}

function parseAiResponse(raw: string): GeneratedSeo | null {
  try {
    let text = raw.trim();
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch) text = fenceMatch[1].trim();

    const parsed = JSON.parse(text);

    if (
      typeof parsed.seoTitle !== "string" ||
      typeof parsed.metaDescription !== "string" ||
      !Array.isArray(parsed.keywords) ||
      typeof parsed.ogTitle !== "string" ||
      typeof parsed.slug !== "string"
    ) {
      return null;
    }

    return {
      seoTitle: parsed.seoTitle.slice(0, 60),
      metaDescription: parsed.metaDescription.slice(0, 160),
      keywords: parsed.keywords.map(String).slice(0, 15),
      ogTitle: parsed.ogTitle,
      ogDescription: parsed.ogDescription || parsed.metaDescription,
      slug: parsed.slug,
      structuredData: parsed.structuredData || {},
      seoTitleVariants: Array.isArray(parsed.seoTitleVariants)
        ? parsed.seoTitleVariants.map(String).slice(0, 3)
        : [],
    };
  } catch {
    return null;
  }
}

/**
 * Generate SEO metadata for an event.
 *
 * 1. Tries Google Gemini with structured prompt
 * 2. Retries once if JSON is malformed
 * 3. Falls back to deterministic generation
 */
export async function generateEventSeoWithAI(
  input: EventSeoInput
): Promise<GeneratedSeo> {
  const apiKey = (process.env.GOOGLE_AI_API_KEY || "").trim();
  if (!apiKey) {
    console.warn("[SEO] GOOGLE_AI_API_KEY missing — using deterministic fallback");
    return generateFallbackSeo(input);
  }

  const ai = new GoogleGenAI({ apiKey } as any);
  const userPrompt = buildUserPrompt(input);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${SEO_SYSTEM_PROMPT}\n\nEvent details:\n${userPrompt}`,
      });

      const text = (response as any)?.text ?? "";
      const parsed = parseAiResponse(text);
      if (parsed) {
        if (!parsed.slug) {
          parsed.slug = slugify(input.eventName, input.collegeName.split(",")[0]);
        }
        return parsed;
      }

      console.warn(`[SEO] Gemini returned unparseable JSON (attempt ${attempt + 1})`);
    } catch (err) {
      console.error(`[SEO] Gemini API error (attempt ${attempt + 1}):`, err);
    }
  }

  console.warn("[SEO] AI failed after retries — using deterministic fallback");
  return generateFallbackSeo(input);
}
