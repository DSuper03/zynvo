import { NextResponse } from "next/server";
import { generateEventSeoWithAI } from "@/lib/seo/generateSEO";
import { upsertSeo, getSeoByEventId } from "@/lib/seo/store";
import type { EventSeoInput, StoredEventSeo } from "@/lib/seo/types";

/**
 * POST /api/seo/generate
 *
 * Accepts event details, generates AI-powered SEO metadata via Gemini,
 * persists to the local store, and returns the full SEO record.
 *
 * Body: EventSeoInput (JSON)
 * Query: ?force=true to regenerate even if cached
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EventSeoInput;

    if (!body.eventName || !body.collegeName) {
      return NextResponse.json(
        { error: "eventName and collegeName are required" },
        { status: 400 }
      );
    }

    if (!body.eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";

    if (!force) {
      const existing = getSeoByEventId(body.eventId);
      if (existing) {
        return NextResponse.json({ seo: existing, cached: true });
      }
    }

    const generated = await generateEventSeoWithAI(body);

    const now = new Date().toISOString();
    const record: StoredEventSeo = {
      ...generated,
      eventId: body.eventId,
      eventName: body.eventName,
      collegeName: body.collegeName,
      createdAt: now,
      updatedAt: now,
    };

    upsertSeo(record);

    return NextResponse.json({ seo: record, cached: false });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "SEO generation failed";
    console.error("[/api/seo/generate]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/seo/generate?eventId=xxx  or  ?slug=xxx
 *
 * Look up previously generated SEO for an event.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");
  const slug = url.searchParams.get("slug");

  if (!eventId && !slug) {
    return NextResponse.json(
      { error: "Provide eventId or slug query param" },
      { status: 400 }
    );
  }

  const { getSeoBySlug } = await import("@/lib/seo/store");

  const record = eventId
    ? getSeoByEventId(eventId)
    : getSeoBySlug(slug!);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ seo: record });
}
