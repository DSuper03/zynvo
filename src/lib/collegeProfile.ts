/** Backend may expose campus under different keys; normalize to one string. */
export function extractCollegeFromUserRecord(u: unknown): string {
  if (!u || typeof u !== "object") return "";
  const o = u as Record<string, unknown>;
  const keys = [
    "collegeName",
    "college",
    "college_name",
    "CollegeName",
    "College",
  ] as const;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

const PLACEHOLDER_COLLEGES = new Set(
  [
    "not joined",
    "not_joined",
    "n/a",
    "na",
    "none",
    "null",
    "undefined",
    "-",
    "—",
  ].map((s) => s.toLowerCase())
);

/** True when we should ask the user to pick a real campus from the list. */
export function shouldPromptForCollege(collegeRaw: string): boolean {
  const raw = collegeRaw.trim().toLowerCase();
  if (!raw) return true;
  if (PLACEHOLDER_COLLEGES.has(raw)) return true;
  return false;
}
