import { NextRequest, NextResponse } from 'next/server';
import {
  addSessionToSchedule,
  getBearerToken,
  verifyScheduleFounder,
} from '@/lib/schedule-store';

type RouteParams = { params: Promise<{ eventId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ msg: 'Authentication required' }, { status: 401 });
  }

  const isFounder = await verifyScheduleFounder(eventId, token);
  if (!isFounder) {
    return NextResponse.json({ msg: 'Only the event founder can manage the schedule' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ msg: 'Invalid request body' }, { status: 400 });
  }

  const time = String(body.time ?? '').trim();
  const title = String(body.title ?? '').trim();
  const location = String(body.location ?? '').trim();

  if (!time || !title || !location) {
    return NextResponse.json({ msg: 'Time, title, and location are required' }, { status: 400 });
  }

  const day = Number(body.day ?? 1);
  const speakers = Array.isArray(body.speakers)
    ? body.speakers.map(String).filter(Boolean)
    : String(body.speakers ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  try {
    const { session } = await addSessionToSchedule(eventId, {
      day: Number.isFinite(day) && day > 0 ? day : 1,
      time,
      title,
      description: String(body.description ?? '').trim(),
      location,
      speakers,
    });

    return NextResponse.json({ msg: 'Session added successfully', response: session }, { status: 201 });
  } catch (error) {
    console.error('Schedule POST failed:', error);
    return NextResponse.json({ msg: 'Failed to add session' }, { status: 500 });
  }
}
