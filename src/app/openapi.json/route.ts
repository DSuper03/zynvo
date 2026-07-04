import { NextResponse } from 'next/server';

const SITE = 'https://zynvosocial.com';

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Zynvo Public API',
    version: '1.0.0',
    description:
      'Public-facing API surface for discovery, SEO generation, uploads, and telemetry in the Zynvo web application.',
  },
  servers: [{ url: SITE }],
  paths: {
    '/api/health': {
      get: {
        summary: 'API health check',
        operationId: 'getApiHealth',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    service: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                  required: ['ok', 'service', 'timestamp'],
                },
              },
            },
          },
        },
      },
    },
    '/api/discover/posts': {
      get: {
        summary: 'Fetch discover posts',
        operationId: 'getDiscoverPosts',
        responses: {
          '200': {
            description: 'Discover posts payload',
          },
        },
      },
    },
    '/api/public/top-clubs': {
      get: {
        summary: 'Fetch top clubs',
        operationId: 'getTopClubs',
        responses: {
          '200': {
            description: 'Top clubs payload',
          },
        },
      },
    },
    '/api/seo/generate': {
      post: {
        summary: 'Generate SEO metadata',
        operationId: 'generateSeoMetadata',
        responses: {
          '200': {
            description: 'Generated SEO metadata',
          },
        },
      },
    },
    '/api/seo/bulk': {
      get: {
        summary: 'Fetch cached SEO records',
        operationId: 'getSeoBulk',
        responses: {
          '200': {
            description: 'Cached SEO records',
          },
        },
      },
    },
    '/api/imagekit-signature': {
      get: {
        summary: 'Create ImageKit upload signature',
        operationId: 'getImagekitSignature',
        responses: {
          '200': {
            description: 'Upload signature details',
          },
        },
      },
    },
    '/api/upload/image': {
      post: {
        summary: 'Upload an image',
        operationId: 'uploadImage',
        responses: {
          '200': {
            description: 'Upload result',
          },
        },
      },
    },
    '/api/telemetry/client-error': {
      post: {
        summary: 'Submit client error telemetry',
        operationId: 'postClientErrorTelemetry',
        responses: {
          '200': {
            description: 'Telemetry accepted',
          },
        },
      },
    },
  },
};

export const runtime = 'nodejs';

export async function GET() {
  return new NextResponse(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.oai.openapi+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
