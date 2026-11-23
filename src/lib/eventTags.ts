/**
 * Event tags: short labels organisers add to an event ("hackathon", "ai/ml").
 * These rules mirror the backend's (src/worker/eventTags.ts there), so what you
 * see in the form is what gets saved.
 */

export const MAX_EVENT_TAGS = 5;
export const MAX_TAG_LENGTH = 24;

/** Lowercase; keep letters, combining marks, numbers and a few symbols. */
export function normalizeTag(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N} +#&.\/\-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[-.]+|[-.]+$/g, '')
    .trim();
}

export interface AddTagsResult {
  tags: string[];
  /** Why part of the input was not added (the rest still is). */
  error?: string;
}

/**
 * Add what was typed or pasted (one tag, or several separated by commas) to the
 * list. Blanks and duplicates are skipped silently; going over the limits
 * keeps what fits and reports why.
 */
export function addTags(current: string[], raw: string): AddTagsResult {
  const tags = [...current];
  let error: string | undefined;

  for (const piece of raw.split(',')) {
    const tag = normalizeTag(piece);
    if (!tag || tags.includes(tag)) continue;
    if (tag.length > MAX_TAG_LENGTH) {
      error = `Tags can be up to ${MAX_TAG_LENGTH} characters.`;
      continue;
    }
    if (tags.length >= MAX_EVENT_TAGS) {
      error = `You can add up to ${MAX_EVENT_TAGS} tags.`;
      break;
    }
    tags.push(tag);
  }
  return { tags, error };
}

/** Clean a list coming from the server (older events have none). */
export function readTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is string => typeof t === 'string')
    .map(normalizeTag)
    .filter(Boolean)
    .slice(0, MAX_EVENT_TAGS);
}

/** Link to the events list filtered by this tag. */
export const tagHref = (tag: string) => `/events?tag=${encodeURIComponent(tag)}`;
