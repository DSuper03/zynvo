import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod Validation Schema for Club Registration
const ClubRegistrationSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  collegeId: z.string(),
  adminUserId: z.string(),
  profilePicUrl: z.string().optional(),
  coverPicUrl: z.string().optional()
});

export const registerClub = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = ClubRegistrationSchema.parse(req.body);

    // Check if club already exists in the college
    const existingClub = await prisma.club.findFirst({
      where: { 
        name: validatedData.name,
        collegeId: validatedData.collegeId 
      }
    });

    if (existingClub) {
      return res.status(400).json({ 
        message: "Club with this name already exists in the college" 
      });
    }

    // Create new club
    const newClub = await prisma.club.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        collegeId: validatedData.collegeId,
        profilePicUrl: validatedData.profilePicUrl,
        coverPicUrl: validatedData.coverPicUrl
      }
    });

    // Add club admin as a member
    await prisma.clubMember.create({
      data: {
        userId: validatedData.adminUserId,
        clubId: newClub.id,
        role: 'ADMIN'
      }
    });

    res.status(201).json({
      message: "Club registered successfully",
      club: newClub
    });
  } catch (error) {
    console.error("Club Registration Error:", error);
    res.status(500).json({ 
      message: "Failed to register club", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

// Get clubs for a specific college
export const getCollegeClubs = async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.params;

    const clubs = await prisma.club.findMany({
      where: { collegeId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    res.json({
      clubs: clubs.map(club => ({
        ...club,
        memberCount: club._count.members
      }))
    });
  } catch (error) {
    console.error("Fetch College Clubs Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch college clubs",
      error: error instanceof Error ? error.message : error
    });
  }
};