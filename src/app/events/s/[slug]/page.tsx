import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoBySlug } from "@/lib/seo/store";

const SITE_URL = "https://zynvo.social";

/** SEO-friendly public URL: /events/s/{slug} (avoids conflict with /events/[id]) */
const SEO_PATH_PREFIX = "/events/s";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic metadata — fully server-rendered, pulled from the SEO store.
 * Google / social crawlers see real meta tags in the initial HTML.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = getSeoBySlug(slug);

  if (!seo) {
    return {
      title: "Event Not Found — Zynvo",
      description: "This event page could not be found on Zynvo.",
    };
  }

  const canonical = `${SITE_URL}${SEO_PATH_PREFIX}/${seo.slug}`;
  const posterImage = (seo.structuredData as Record<string, unknown>)?.image as
    | string
    | undefined;

  return {
    title: seo.seoTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: { canonical },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: canonical,
      siteName: "Zynvo",
      type: "website",
      ...(posterImage
        ? { images: [{ url: posterImage, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      ...(posterImage ? { images: [posterImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

/**
 * Server-rendered event page — crawlers see metadata + JSON-LD in HTML.
 * Human visitors see event info + a client-side redirect to the full
 * interactive /events/[id] page.
 */
export default async function EventSlugPage({ params }: Props) {
  const { slug } = await params;
  const seo = getSeoBySlug(slug);
  if (!seo) notFound();

  const jsonLd = seo.structuredData;
  const eventUrl = `/events/${seo.eventId}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-2xl font-bold mb-2 text-center">{seo.eventName}</h1>
        <p className="text-gray-400 mb-1">{seo.collegeName}</p>
        <p className="text-gray-500 text-sm mb-6">{seo.metaDescription}</p>
        <a
          href={eventUrl}
          className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          View Full Event Details →
        </a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("${eventUrl}");`,
        }}
      />
    </>
  );
}
