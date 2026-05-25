import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';

type BackendTopClub = {
  id?: string;
  name?: string;
  clubName?: string;
  collegeName?: string | null;
  description?: string | null;
  profilePicUrl?: string | null;
  profilePic?: string | null;
  image?: string | null;
  logo?: string | null;
};

type BackendTopClubsResponse = {
  resp?: BackendTopClub[];
};

const backendBaseUrl = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://zynvosocial-be-274792984950.asia-south1.run.app'
).replace(/\/$/, '');

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function createServiceJwt(secret: string) {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: 'public-top-clubs-service',
    email: 'public-top-clubs@zynvo.local',
    name: 'Public Top Clubs Service',
    iat: now,
    exp: now + 60 * 15,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${signature}`;
}

export async function GET(request: NextRequest) {
  try {
    const incomingAuthorization = request.headers.get('authorization');
    const jwtSecret = process.env.JWT_SECRET;
    const serviceToken = jwtSecret ? createServiceJwt(jwtSecret) : null;
    const authorization = incomingAuthorization || (serviceToken ? `Bearer ${serviceToken}` : null);

    if (!authorization) {
      return NextResponse.json(
        { msg: 'No authorization token available', resp: [] },
        { status: 401 },
      );
    }

    const response = await fetch(`${backendBaseUrl}/api/v1/clubs/getAll?page=1`, {
      headers: {
        accept: 'application/json',
        authorization,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { msg: 'Failed to fetch top clubs', resp: [] },
        { status: response.status },
      );
    }

    const data = (await response.json()) as BackendTopClubsResponse;
    return NextResponse.json({
      msg: 'Top clubs fetched',
      resp: Array.isArray(data?.resp) ? data.resp.slice(0, 8) : [],
    });
  } catch (error) {
    console.error('Failed to proxy top clubs:', error);
    return NextResponse.json(
      { msg: 'Failed to fetch top clubs', resp: [] },
      { status: 502 },
    );
  }
}
