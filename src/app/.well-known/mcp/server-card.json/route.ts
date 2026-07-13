import { NextResponse } from 'next/server';

import { getMcpResponseHeaders, getMcpServerCard } from '@/lib/mcp-server-card';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getMcpServerCard(), {
    status: 200,
    headers: getMcpResponseHeaders(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getMcpResponseHeaders(),
  });
}
