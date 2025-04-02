import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../src/server';
import { Post } from '@/app/models/user';

const router = express.Router();

// Get all posts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Create a post
router.post('/', async (req: Request<{}, {}, PostInput>, res: Response, next: NextFunction) => {
  try {
    const { content, authorId, clubId, eventId, mediaUrls } = req.body;
    
    if (!content || !authorId) {
      return res.status(400).json({ message: 'Content and authorId are required' });
    }
    
    const post = await prisma.post.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        ...(clubId && { club: { connect: { id: clubId } } }),
        ...(eventId && { event: { connect: { id: eventId } } }),
        mediaUrls: mediaUrls || [],
      },
    });
    
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

// Get post by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    next(error);
  }
});

export default router;