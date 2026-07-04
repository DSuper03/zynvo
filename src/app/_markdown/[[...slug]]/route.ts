import { NextRequest, NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { parseHTML } from 'linkedom';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

const skipSelectors = [
  'nav', 'header', 'footer', 'script', 'style', 'noscript',
  '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
].join(',');
turndown.remove((node) => {
  const el = node as HTMLElement;
  return typeof el.matches === 'function' && el.matches(skipSelectors);
});

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const originalPath = slug ? `/${slug.join('/')}` : '/';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zynvosocial.com';
  const targetUrl = `${siteUrl}${originalPath}${request.nextUrl.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Zynvo-Markdown-Agent/1.0',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new NextResponse(
        `# Error\n\nFailed to fetch ${originalPath} (HTTP ${response.status})`,
        {
          status: response.status,
          headers: { 'Content-Type': 'text/markdown' },
        },
      );
    }

    const html = await response.text();
    const { document } = parseHTML(html);

    const selectors = [
      'main',
      '[role="main"]',
      'article',
      '#content',
      '.content',
      '.main-content',
    ];

    let content: Element | null = null;
    for (const sel of selectors) {
      content = document.querySelector(sel);
      if (content) break;
    }

    const body = document.querySelector('body');
    const source = content || body || document;

    const markdown = turndown.turndown(source as unknown as HTMLElement);

    const tokenCount = markdown.split(/\s+/).filter(Boolean).length;

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'x-markdown-tokens': String(tokenCount),
        'x-markdown-source': originalPath,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(
      `# Error\n\nFailed to convert page to markdown: ${message}`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/markdown' },
      },
    );
  }
}
