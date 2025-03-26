import { BaseModel } from './base';
import { UserRole } from './enums';

export interface User extends BaseModel {
  email: string;
  username: string;
  name: string;
  profilePicUrl?: string;
  collegeId: string;
  role: UserRole;
  bio?: string;
  
  clubs?: ClubMember[];
  events?: EventAttendee[];
  posts?: Post[];
  comments?: Comment[];
}

export interface College extends BaseModel {
  name: string;
  location: string;
  domain: string;
  
  users?: User[];
  clubs?: Club[];
}

export interface Club extends BaseModel {
  name: string;
  description: string;
  collegeId: string;
  
  profilePicUrl?: string;
  coverPicUrl?: string;
  
  members?: ClubMember[];
  events?: Event[];
  posts?: Post[];
}

export interface ClubMember extends BaseModel {
  userId: string;
  user?: User;
  clubId: string;
  club?: Club;
  role: string;
  joinedAt: Date;
}

export interface Event extends BaseModel {
  name: string;
  description: string;
  clubId: string;
  club?: Club;
  date: Date;
  location: string;
  
  attendees?: EventAttendee[];
}

export interface EventAttendee extends BaseModel {
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  status: string;
  registeredAt: Date;
}

export interface Post extends BaseModel {
  content: string;
  userId: string;
  user?: User;
  clubId?: string;
  club?: Club;
  createdAt: Date;
  
  comments?: Comment[];
}

export interface Comment extends BaseModel {
  content: string;
  userId: string;
  user?: User;
  postId: string;
  post?: Post;
  createdAt: Date;
}