import { ReactNode } from 'react';

// event page types----------------------------------------------------------------------------------------------

export type EventMode = 'online' | 'offline' | 'hybrid';

export type Eventtype =
  | 'hackathon'
  | 'workshop'
  | 'conference'
  | 'competition'
  | 'cultural'
  | 'sports'
  | 'technical'
  | 'others'

export interface EventFormData {
  eventMode: EventMode | '';
  eventName: string;
  university: string;
  tagline: string;
  description: string;
  eventType: Eventtype | '';
  maxTeamSize: number;
  collegeStudentsOnly: boolean;
  noParticipationFee: boolean;
  eventWebsite: string;
  coreTeamOnly: boolean; // kis lie hai ye ????
  eventStartDate: string;
  eventEndDate: string;
  // application Status to be updated as open and closed , no duration required for now.
  applicationStartDate: string;
  applicationEndDate: string;
  venue: string;
  prizes: string;
  contactEmail: string;
  contactPhone: string;
  // image: string;
}

// this is used in clubs/id/page.tsx where events of colleges are listed
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

// axios post data interface ( register event button )
export interface UserEvent {
  userId: string;
  eventId: string;
}

//registered user response
export interface UserEvenResponse {
  uniquePassId: string;
}

//response
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
  // event: Event;
}

// post types---------------------------------------------------------------------------------------
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

// club types ----------------------------------------------------------------------
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

// dashboard and user info ------------------------------------------------------------------------------------------
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
  clubId: string;
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
    collegeId?: string;
    type: clubType;
    requirements: string | null;
    profilePicUrl: string | null;
    clubContact: string;
    members?: {
      id: string;
      name: string;
      email: string;
      profileAvatar: string;
    }[];
  }[];
  totalPages: number;
}
export interface ClubPageProps {
  params: {
    id: string;
  };
}

// used in clubs/id
export interface Response {
  msg: string;
  response: {
    id: string;
    name: string;
    collegeName: string;
    description: string;
    founderEmail: string;
    facultyEmail: string;
    members: any[];
    profilePicUrl?: string;
  };
}

// used in clubs/id
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
  members?: any[];
  profileAvatar?: string;
  founderEmail: string;
  facultyEmail: string;
  isPopular?: boolean;
  isNew?: boolean;
  category?: string;
  type?: string;
  profilePicUrl?: string;
  clubContact?: string;
  requirements?: string;
  wings?: string;
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
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface UserEvents {
  name: string | null;
}

export interface Attendee {
  user: UserEvents | null;
}

// all-events response ,  saare venets show krne wala page
export interface eventData {
  attendees: Attendee[];
  description: string;
  id: string;
  clubName: string;
  clubId: string;
  createdAt: Date;
  eventHeaderImage: string | null;
  EventName: string;
  prizes: string;
  endDate: Date | null;
  posterUrl?: string;
  univerisity : string;
}

export interface respnseUseState {
  EventName: string;
  description: string;
  EventMode: string;
  startDate: any;
  endDate: any;
  contactEmail: string;
  contactPhone: number;
  university: string;
  applicationStatus: string;
  posterUrl?: string;
  eventHeader?: string;
}
export interface PostData {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  collegeId: string | null;
  authorId: string;
  collegeName: string;
  clubName: string;
  author: {
    profileAvatar: string | null;
    name: string | null;
  };
}
export interface EventByIdResponse {
  msg: string;
  response: {
    id: string;
    posterUrl?: string;
    EventMode: 'Online' | 'Offline' | 'Hybrid';
    EventType: string; // Consider creating a union type with specific event types
    eventHeaderImage?: string;
    EventName: string;
    description: string;
    prizes: string;
    TeamSize: number;
    Venue: string;
    EventUrl?: string;
    applicationStatus: 'open' | 'closed';
    clubName: string;
    clubId: string;
    university: string;
    createdAt: Date;
    startDate: string;
    endDate?: string;
    collegeStudentsOnly: boolean;
    participationFee: boolean;
    contactEmail: string;
    contactPhone: number;
  };
}

// will fix it later
