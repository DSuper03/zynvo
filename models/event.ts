export interface UserEvent {
  userId: string;
  eventId: string;
  joinedAt: string;
  user: User;
  event: Event;
}
export interface Event {
  id: string;
  eventHeaderImage?: string;
  EventName: string;
  description: string;
  prizes?: string;
  clubName: string;
  clubId: string;
  createdAt: string;
  endDate?: string;
  club: Club;
  speakers: Speaker[];
  attendees: UserEvent[];
}
export interface Speaker {
  id: number;
  profilePic?: string;
  name: string;
  email: string;
  eventId: string;
  event: Event;
}
export interface CreatePost {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  collegeId: string;
  club: Club;
  authorId: string;
  author: User;
}
export type ClubType = "Technology" | "Cultural" | "Business" | "Social" | "Literature" | "Design" | "General";

export interface Club {
  response?: string;
  id: string;
  name: string;
  founderEmail: string;
  facultyEmail: string;
  collegeName: string;
  collegeId: string;
  type: ClubType;
  description: string;
  requirements?: string;
  profilePicUrl?: string;
  clubContact: string;
  posts: CreatePost[];
  members: User[];
  events: Event[];
}
export interface User {
  id: string;
  email: string;
  collegeName: string;
  name?: string;
  profileAvatar?: string;
  password: string;
  createdAt: string;
  vToken?: string;
  expiryToken: number;
  ValidFor: number;
  isVerified?: boolean;
  clubName?: string;
  clubId?: string;
  eventAttended: UserEvent[];
  club?: Club;
  CreatePost: CreatePost[];
}
