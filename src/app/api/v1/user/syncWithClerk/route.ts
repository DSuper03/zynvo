import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_BASE_URL ||
  'https://zynvo-backend-worker.anirbanghosh060.workers.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const upstream = await fetch(`${BACKEND_URL}/api/v1/user/syncWithClerk`, {
      method: 'POST',
      headers: {
        'content-type': request.headers.get('content-type') || 'application/json',
        accept: 'application/json',
      },
      body,
    });

    const data = await upstream.text();

    return new NextResponse(data, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    console.error('[syncWithClerk] Backend unreachable:', error);
    return NextResponse.json(
      { success: false, message: 'Backend unreachable. Is the backend server running?' },
      { status: 502 },
    );
  }
}
