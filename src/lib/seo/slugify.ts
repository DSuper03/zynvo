/** Deterministic slug from text segments — always produces a valid URL path. */
export function slugify(...parts: (string | undefined | null)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** City extraction from a college string like "IIT Madras, Tamil Nadu" → "Tamil Nadu". */
export function cityFromCollege(college: string): string {
  if (!college) return "";
  const parts = college.split(",").map((s) => s.trim());
  if (parts.length >= 2) return parts[parts.length - 1];
  return "";
}
