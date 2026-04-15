'use client';

import { useEffect, useRef } from 'react';
import { generateEventSeo, type EventSeoInput } from '@/lib/eventSeo';

/**
 * Dynamically injects SEO <head> tags and JSON-LD for a client-rendered event page.
 *
 * On mount / input change it:
 *  1. Sets `document.title`
 *  2. Upserts <meta name="description">, <meta name="keywords">
 *  3. Upserts Open Graph tags (og:title, og:description, og:image, og:type, og:url)
 *  4. Injects a <script type="application/ld+json"> with schema.org Event data
 *
 * On unmount it restores the previous title and removes injected tags.
 */
export default function EventSeoHead(props: EventSeoInput & { pageUrl?: string }) {
  const prevTitle = useRef<string | null>(null);
  const ownedTagIds = useRef<string[]>([]);

  useEffect(() => {
    if (!props.eventName) return;

    const seo = generateEventSeo(props);

    // --- title ---
    if (prevTitle.current === null) prevTitle.current = document.title;
    document.title = seo.title;

    const upsert = (selector: string, create: () => HTMLElement, id: string) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      el.setAttribute('data-event-seo', id);
      ownedTagIds.current.push(id);
      return el;
    };

    const metaTag = (name: string, content: string) => {
      const sel = `meta[name="${name}"]`;
      const el = upsert(sel, () => {
        const m = document.createElement('meta');
        m.setAttribute('name', name);
        return m;
      }, `meta-${name}`) as HTMLMetaElement;
      el.content = content;
    };

    const ogTag = (property: string, content: string) => {
      const sel = `meta[property="${property}"]`;
      const el = upsert(sel, () => {
        const m = document.createElement('meta');
        m.setAttribute('property', property);
        return m;
      }, `og-${property}`) as HTMLMetaElement;
      el.content = content;
    };

    metaTag('description', seo.metaDescription);
    metaTag('keywords', seo.keywords);

    ogTag('og:title', seo.ogTitle);
    ogTag('og:description', seo.ogDescription);
    ogTag('og:type', 'website');
    if (props.pageUrl) ogTag('og:url', props.pageUrl);
    if (props.posterUrl) ogTag('og:image', props.posterUrl);

    // Twitter card
    metaTag('twitter:card', 'summary_large_image');
    metaTag('twitter:title', seo.ogTitle);
    metaTag('twitter:description', seo.ogDescription);
    if (props.posterUrl) metaTag('twitter:image', props.posterUrl);

    // --- JSON-LD ---
    const JSONLD_ID = 'event-jsonld';
    let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = JSONLD_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(seo.jsonLd);

    return () => {
      if (prevTitle.current !== null) {
        document.title = prevTitle.current;
        prevTitle.current = null;
      }
      document.querySelectorAll('[data-event-seo]').forEach((el) => el.remove());
      const jsonScript = document.getElementById(JSONLD_ID);
      if (jsonScript) jsonScript.remove();
      ownedTagIds.current = [];
    };
  }, [
    props.eventName,
    props.collegeName,
    props.city,
    props.eventType,
    props.description,
    props.startDate,
    props.endDate,
    props.eventMode,
    props.posterUrl,
    props.eventUrl,
    props.pageUrl,
    props.prizes,
    props.contactEmail,
  ]);

  return null;
}
