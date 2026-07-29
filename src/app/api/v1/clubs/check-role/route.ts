import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/server/env';
import { getProxyAuth } from '@/lib/server/auth';
import { unauthorized } from '@/lib/server/errors';
import { generateRequestId } from '@/lib/server/request';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const clubName = request.nextUrl.searchParams.get('clubName');

  if (!clubName) {
    return NextResponse.json(
      { authorized: false, role: null, error: 'clubName query param is required' },
      { status: 400 },
    );
  }

  const auth = await getProxyAuth();
  if (!auth) {
    return unauthorized(requestId);
  }

  const backendBase = getServerEnv().BACKEND_BASE_URL.replace(/\/$/, '');

  try {
    const userRes = await fetch(`${backendBase}/api/v1/user/getUser`, {
      headers: { authorization: `Bearer ${auth.token}` },
    });
    if (!userRes.ok) {
      return NextResponse.json(
        { authorized: false, role: null, error: 'Failed to fetch user' },
        { status: 502 },
      );
    }

    const userData = await userRes.json();
    const userEmail = userData?.user?.email;
    const userClubId = userData?.user?.clubId;

    if (!userEmail) {
      return NextResponse.json(
        { authorized: false, role: null, error: 'User email not found' },
        { status: 400 },
      );
    }

    let clubId = userClubId;

    if (!clubId) {
      const clubsRes = await fetch(
        `${backendBase}/api/v1/clubs/getAll?limit=500`,
        {
          headers: { authorization: `Bearer ${auth.token}` },
        },
      );
      if (clubsRes.ok) {
        const clubsData = await clubsRes.json();
        const clubs: { id: string; name: string }[] =
          clubsData?.clubs ?? clubsData ?? [];
        const matched = clubs.find(
          (c: { id: string; name: string }) =>
            c.name?.toLowerCase() === clubName.toLowerCase(),
        );
        if (matched) clubId = matched.id;
      }
    }

    if (!clubId) {
      return NextResponse.json(
        { authorized: false, role: null, error: 'Club not found' },
        { status: 404 },
      );
    }

    const clubRes = await fetch(`${backendBase}/api/v1/clubs/${clubId}`, {
      headers: { authorization: `Bearer ${auth.token}` },
    });
    if (!clubRes.ok) {
      return NextResponse.json(
        { authorized: false, role: null, error: 'Failed to fetch club details' },
        { status: 502 },
      );
    }

    const clubData = await clubRes.json();
    const club = clubData?.club ?? clubData;

    if (
      club.founderEmail?.toLowerCase() === userEmail.toLowerCase()
    ) {
      return NextResponse.json({ authorized: true, role: 'founder' });
    }

    const member = club.members?.find(
      (m: { email?: string; role?: string }) =>
        m.email?.toLowerCase() === userEmail.toLowerCase(),
    );
    if (member?.role === 'admin') {
      return NextResponse.json({ authorized: true, role: 'admin' });
    }

    return NextResponse.json({
      authorized: false,
      role: member?.role ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        authorized: false,
        role: null,
        error: err instanceof Error ? err.message : 'Internal error',
      },
      { status: 500 },
    );
  }
}
