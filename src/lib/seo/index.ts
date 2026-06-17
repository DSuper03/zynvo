export { generateEventSeoWithAI } from "./generateSEO";
export { generateFallbackSeo } from "./fallback";
export { slugify, cityFromCollege } from "./slugify";
export {
  getSeoByEventId,
  getSeoBySlug,
  upsertSeo,
  getAllSeo,
  getAllSlugs,
  invalidateCache,
} from "./store";
export type { EventSeoInput, GeneratedSeo, StoredEventSeo } from "./types";
