import { NextResponse } from "next/server";
import { getAllSeo } from "@/lib/seo/store";

/**
 * GET /api/seo/bulk
 *
 * Returns all cached SEO records. Useful for sitemap generation,
 * admin dashboards, and bulk export.
 */
export async function GET() {
  const all = getAllSeo();
  return NextResponse.json({ records: all, total: all.length });
}
