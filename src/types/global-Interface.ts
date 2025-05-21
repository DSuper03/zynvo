import { ReactNode } from 'react';

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
export type ClubType =
  | 'Technology'
  | 'Cultural'
  | 'Business'
  | 'Social'
  | 'Literature'
  | 'Design'
  | 'General';

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

export interface signinRes {
  msg: string;
  token: string;
}

export interface signupRes {
  msg: string;
  token: string;
}
export interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface JoinClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  clubImage: string;
}
export enum clubType {
  Technology,
  Cultural,
  Business,
  Social,
  Literature,
  Design,
  General,
}

export interface response {
  resp: {
    name: string;
    id: string;
    collegeName: string;
    description: string;
    founderEmail: string;
    facultyEmail: string;
    collegeId: string;
    type: clubType;
    requirements: string | null;
    profilePicUrl: string | null;
    clubContact: string;
  }[];
}
export interface ClubPageProps {
  params: {
    id: string;
  };
}

export interface Response {
  msg: string;
  response: {
    id: string;
    name: string;
    collegeName: string;
    description: string;
  };
}

export interface EventResponse {
  event: {
    id: string;
    EventName: string;
    clubName: string;
    description: string;
    eventHeaderImage: string | null;
    prizes: string;
    clubId: string;
    createdAt: Date;
    endDate: Date | null;
  }[];
}

export interface ClubTypeProps {
  id: string;
  name: string;
  collegeName: string;
  description: string;
  image?: string;
  members?: number;
  isPopular?: boolean;
  isNew?: boolean;
  category?: string;
}

export interface EventType {
  id: string;
  EventName: string;
  clubName: string;
  description: string;
  createdAt: Date;
  image?: string;
  time?: string;
  title?: string;
}

export interface Event {
  EventName: string;
  id: string;
}

export interface UserData {
  name: string | null;
  email: string;
  clubName: string | null;
  isVerified: boolean | null;
  events: Event[];
}

export interface ApiResponse {
  user: {
    isVerified: boolean | null;
    name: string | null;
    email: string;
    clubName: string | null;
    eventAttended: {
      event: {
        id: string;
        EventName: string;
      };
    }[];
  };
}
export interface DashboardLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export interface EventLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
}

export type NavItem = {
  name: string;
  path: string;
};

export interface HeaderProps {
  navItems?: NavItem[];
  logoText?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  href: string;
}

export interface TablistProps {
  tabs?: TabItem[];
  baseUrl?: string;
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'secondary';
}
export interface Plane {
  id: number;
  x: number;
  y: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  angle: number;
  type: 'cannonball' | 'bomb';
}
