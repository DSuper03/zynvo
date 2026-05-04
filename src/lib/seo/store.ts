/**
 * SEO data store — file-backed cache for generated event SEO metadata.
 *
 * Since this project has no in-repo database (Prisma / Postgres), we persist
 * SEO records to a JSON file under `.cache/seo/events.json` and provide
 * O(1) slug → eventId and eventId → SEO lookups via in-memory indices.
 *
 * This layer is designed to be swapped for a real DB when the backend adds
 * SEO columns — just replace the read/write functions.
 */
import fs from "fs";
import path from "path";
import type { StoredEventSeo } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".cache", "seo");
const STORE_PATH = path.join(CACHE_DIR, "events.json");

let memoryStore: Map<string, StoredEventSeo> | null = null;
let slugIndex: Map<string, string> | null = null;

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function loadStore(): Map<string, StoredEventSeo> {
  if (memoryStore) return memoryStore;

  ensureDir();
  if (!fs.existsSync(STORE_PATH)) {
    memoryStore = new Map();
    slugIndex = new Map();
    return memoryStore;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const arr: StoredEventSeo[] = JSON.parse(raw);
    memoryStore = new Map(arr.map((s) => [s.eventId, s]));
    slugIndex = new Map(arr.map((s) => [s.slug, s.eventId]));
  } catch {
    memoryStore = new Map();
    slugIndex = new Map();
  }
  return memoryStore;
}

function buildSlugIndex() {
  const store = loadStore();
  slugIndex = new Map();
  for (const [id, seo] of store.entries()) {
    slugIndex.set(seo.slug, id);
  }
}

function persist() {
  ensureDir();
  const store = loadStore();
  const arr = [...store.values()];
  fs.writeFileSync(STORE_PATH, JSON.stringify(arr, null, 2), "utf-8");
}

// ─── Public API ────────────────────────────────────────────────────────────

export function getSeoByEventId(eventId: string): StoredEventSeo | null {
  return loadStore().get(eventId) ?? null;
}

export function getSeoBySlug(slug: string): StoredEventSeo | null {
  loadStore();
  if (!slugIndex) buildSlugIndex();
  const eventId = slugIndex!.get(slug);
  if (!eventId) return null;
  return memoryStore!.get(eventId) ?? null;
}

export function upsertSeo(record: StoredEventSeo): void {
  const store = loadStore();

  const existing = store.get(record.eventId);
  if (existing && existing.slug !== record.slug) {
    slugIndex?.delete(existing.slug);
  }

  store.set(record.eventId, record);
  if (!slugIndex) buildSlugIndex();
  slugIndex!.set(record.slug, record.eventId);

  persist();
}

export function getAllSeo(): StoredEventSeo[] {
  return [...loadStore().values()];
}

export function getAllSlugs(): string[] {
  loadStore();
  if (!slugIndex) buildSlugIndex();
  return [...slugIndex!.keys()];
}

/** Force-reload from disk (useful after external writes). */
export function invalidateCache(): void {
  memoryStore = null;
  slugIndex = null;
}
