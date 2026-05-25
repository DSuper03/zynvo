import { NextRequest, NextResponse } from 'next/server';
import { getScheduleForEvent } from '@/lib/schedule-store';

type RouteParams = { params: Promise<{ eventId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const schedule = await getScheduleForEvent(eventId);
    return NextResponse.json({ response: schedule });
  } catch (error) {
    console.error('Schedule GET failed:', error);
    return NextResponse.json({ response: [] });
  }
}
