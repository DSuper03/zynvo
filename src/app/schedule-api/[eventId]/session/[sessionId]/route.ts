import { NextRequest, NextResponse } from 'next/server';
import {
  deleteSessionFromSchedule,
  getBearerToken,
  verifyScheduleFounder,
} from '@/lib/schedule-store';

type RouteParams = { params: Promise<{ eventId: string; sessionId: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { eventId, sessionId } = await params;
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ msg: 'Authentication required' }, { status: 401 });
  }

  const isFounder = await verifyScheduleFounder(eventId, token);
  if (!isFounder) {
    return NextResponse.json({ msg: 'Only the event founder can manage the schedule' }, { status: 403 });
  }

  try {
    await deleteSessionFromSchedule(eventId, sessionId);
    return NextResponse.json({ msg: 'Session deleted' });
  } catch (error) {
    console.error('Schedule DELETE failed:', error);
    return NextResponse.json({ msg: 'Failed to delete session' }, { status: 500 });
  }
}
