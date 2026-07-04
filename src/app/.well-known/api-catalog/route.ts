import { NextResponse } from 'next/server';

const SITE = 'https://zynvosocial.com';
const API_CATALOG_PATH = '/.well-known/api-catalog';
const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

const payload = {
  linkset: [
    {
      anchor: `${SITE}/api`,
      'service-desc': [
        {
          href: `${SITE}/openapi.json`,
          type: 'application/vnd.oai.openapi+json',
          title: 'Zynvo public API OpenAPI description',
        },
      ],
      'service-doc': [
        {
          href: `${SITE}/api-docs`,
          type: 'text/html',
          title: 'Zynvo API documentation',
        },
      ],
      status: [
        {
          href: `${SITE}/api/health`,
          type: 'application/json',
          title: 'Zynvo API health status',
        },
      ],
    },
  ],
};

function buildHeaders() {
  return {
    'Content-Type': API_CATALOG_CONTENT_TYPE,
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    Link: `<${API_CATALOG_PATH}>; rel="api-catalog"`,
  };
}

export const runtime = 'nodejs';

export async function GET() {
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: buildHeaders(),
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: buildHeaders(),
  });
}
