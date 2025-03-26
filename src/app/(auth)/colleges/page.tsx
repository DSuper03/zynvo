import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, location, domain } = await request.json();

    // Validate inputs
    if (!name || !location || !domain) {
      return NextResponse.json(
        { message: 'Name, location, and domain are required' },
        { status: 400 }
      );
    }

    // Check if college with same name or domain already exists
    const existingCollege = await prisma.college.findFirst({
      where: {
        OR: [
          { name },
          { domain }
        ]
      }
    });

    if (existingCollege) {
      return NextResponse.json(
        { message: 'A college with this name or domain already exists' },
        { status: 409 }
      );
    }

    // Create the college
    const college = await prisma.college.create({
      data: {
        name,
        location,
        domain
      }
    });

    return NextResponse.json({ college }, { status: 201 });
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json(
      { message: 'Error creating college' },
      { status: 500 }
    );
  }
}