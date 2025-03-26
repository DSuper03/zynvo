import { UserRole, EventType, PrivacyLevel } from './enums';

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