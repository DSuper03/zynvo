import { NextRequest, NextResponse } from 'next/server';

import { getMcpResponseHeaders } from '@/lib/mcp-server-card';

export const runtime = 'nodejs';

const responseBody = {
  jsonrpc: '2.0',
  error: {
    code: -32000,
    message:
      'Zynvo MCP transport is not enabled for public use yet. Discoverability is published at /.well-known/mcp/server-card.json.',
  },
  id: null,
};

export async function GET() {
  return NextResponse.json(responseBody, {
    status: 501,
    headers: getMcpResponseHeaders('GET, POST, OPTIONS'),
  });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json(responseBody, {
    status: 501,
    headers: getMcpResponseHeaders('GET, POST, OPTIONS'),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getMcpResponseHeaders('GET, POST, OPTIONS'),
  });
}
