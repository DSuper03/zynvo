import { BaseModel } from './base';
import { EventType, PrivacyLevel } from './enums';
import { Club, User } from './user';
import { Post } from './models';

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
   
  registrationUrl?: string;
  tags?: string[];
  capacity?: number;
  price?: number;
  isFeatured?: boolean;
  
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