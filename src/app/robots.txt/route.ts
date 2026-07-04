import { NextResponse } from 'next/server';

const SITE = 'https://zynvosocial.com';

export async function GET() {
  const body = `# https://www.robotstxt.org/
# Zynvo - Agentic Social Media Platform for Campus Communities

User-agent: *
Allow: /
Allow: /auth/signup
Allow: /auth/signin
Allow: /discover
Allow: /events
Allow: /events/*
Allow: /events/s/*
Allow: /clubs
Allow: /news
Allow: /founders
Allow: /testimonials
Allow: /faq
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /colleges/*
Allow: /cities/*
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /verification-mail
Disallow: /verify-event/
Disallow: /ticket/
Disallow: /_next/
Crawl-Delay: 1

User-agent: Googlebot
Allow: /
Crawl-Delay: 1

User-agent: Bingbot
Allow: /
Crawl-Delay: 1

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: ${SITE}/sitemap.xml

# Content Signals — AI content usage preferences (draft-romm-aipref-contentsignals)
Content-Signal: ai-train=no, search=yes, ai-input=no
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
