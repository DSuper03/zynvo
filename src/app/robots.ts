import { MetadataRoute } from "next";

const SITE = "https://zynvo.social";

/**
 * Programmatic robots.txt — replaces the static public/robots.txt.
 * Next.js App Router serves this at /robots.txt automatically.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/auth/signup",
          "/auth/signin",
          "/discover",
          "/events",
          "/events/*",
          "/events/s/*",
          "/clubs",
          "/news",
          "/founders",
          "/testimonials",
          "/faq",
          "/contact",
          "/privacy",
          "/terms",
          "/colleges/*",
          "/cities/*",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/verification-mail",
          "/verify-event/",
          "/ticket/",
          "/_next/",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
