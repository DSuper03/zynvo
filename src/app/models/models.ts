// Enums
export enum UserRole {
  STUDENT = 'STUDENT',
  CLUB_ADMIN = 'CLUB_ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum EventType {
  WORKSHOP = 'WORKSHOP',
  CONFERENCE = 'CONFERENCE',
  SOCIAL = 'SOCIAL',
  ACADEMIC = 'ACADEMIC',
  CULTURAL = 'CULTURAL'
}

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  COLLEGE_ONLY = 'COLLEGE_ONLY',
  PRIVATE = 'PRIVATE'
}

// Base Interfaces
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// User-related Interfaces
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

// Event-related Interfaces
export interface Event extends BaseModel {
  title: string;
  description: string;
  clubId: string;
  club?: Club;
  
  type: EventType;
  date: Date;
  location?: string;
  
  privacyLevel: PrivacyLevel;
  
  mediaUrls?: string[];
  
  attendees?: EventAttendee[];
  posts?: Post[];
}

export interface EventAttendee extends BaseModel {
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  status: string;
  joinedAt: Date;
}

// Content-related Interfaces
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

// Input Interfaces for API Requests
export interface CreateUserInput {
  email: string;
  username: string;
  name: string;
  collegeId: string;
  password: string;
  role?: UserRole;
}

export interface CreateClubInput {
  name: string;
  description: string;
  collegeId: string;
  profilePicUrl?: string;
  coverPicUrl?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  clubId: string;
  type: EventType;
  date: Date;
  location?: string;
  privacyLevel?: PrivacyLevel;
  mediaUrls?: string[];
}

export interface CreatePostInput {
  content: string;
  authorId: string;
  clubId?: string;
  eventId?: string;
  mediaUrls?: string[];
}