import { NextResponse } from 'next/server';
import { EventModelShow } from '@/app/models/EventModel';
// Mock data for demonstration purposes
export const events: EventModelShow[] = [
  {
    id: 1,
    title: 'Annual Tech Hackathon',
    description: 'Join us for a 24-hour coding marathon!',
    date: '2025-04-30',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Cultural Festival',
    description: 'Experience the vibrant culture of our campus.',
    date: '2025-05-05',
    img: 'https://plus.unsplash.com/premium_photo-1661306543132-93937b4c242e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwY29sbGVnZSUyMGZlc3RzfGVufDB8fDB8fHww',
  },
  {
    id: 3,
    title: 'Career Fair 2025',
    description: 'Meet potential employers and explore career opportunities.',
    date: '2025-05-15',
    img: '/images/career_fair.jpg',
  },
];

export async function GET() {
  return NextResponse.json(events);
}