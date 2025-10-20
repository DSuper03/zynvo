'use server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    // Parse ID from query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ msg: 'Missing id' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // ✅ Use NEXT_PUBLIC_BACKEND_URL but log it for debugging
    const backendBase =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.zynvo.social';
    const backendUrl = `${backendBase}/api/v1/events/event-details?id=${encodeURIComponent(id)}`;

    console.log(`[Proxy] Fetching event details from: ${backendUrl}`);

    const incomingAuth = req.headers.get('authorization') || undefined;

    // Setup timeout for fetch (10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let resp: Response;
    try {
      resp = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          ...(incomingAuth ? { authorization: incomingAuth } : {}),
        },
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();

    // 🛑 If backend fails, normalize error into JSON
    if (!resp.ok) {
      console.error(`[Proxy] Upstream error:`, {
        url: backendUrl,
        status: resp.status,
        contentType,
        preview: text.slice(0, 200),
      });

      return new Response(
        JSON.stringify({
          msg: 'Upstream error when fetching event details',
          status: resp.status,
          upstreamContentType: contentType,
          upstreamBodyPreview: text.slice(0, 500),
          upstreamUrl: backendUrl,
        }),
        {
          status: resp.status,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    // ✅ Return successful response (pass through from backend)
    return new Response(text, {
      status: resp.status,
      headers: { 'content-type': contentType || 'application/json' },
    });
  } catch (err: any) {
    console.error('[Proxy] Route failed:', err);
    return new Response(
      JSON.stringify({ msg: err?.message || 'Proxy error' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
