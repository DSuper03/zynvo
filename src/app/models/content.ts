import { BaseModel } from './base';
import { User, Club,  } from './user';

export interface Post extends BaseModel {
  content: string;
  
  authorId: string;
  author?: User;
  
  clubId?: string;
  club?: Club;
  
  eventId?: string;
  event?: Event;
  
  mediaUrls?: string[];
  
  comments?: Comment[];
}

export interface Comment extends BaseModel {
  content: string;
  
  authorId: string;
  author?: User;
  
  postId: string;
  post?: Post;
}