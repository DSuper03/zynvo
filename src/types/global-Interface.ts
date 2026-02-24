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
  form?: string; // Registration/Application form URL (Google Forms, Typeform, etc.)
  whatsappLink?: string; // Optional WhatsApp group link for clubhead to share
  isPaidEvent?: boolean; // Flag to indicate if event requires payment
  paymentQRCode?: string; // QR code image URL for payment
  paymentAmount?: number; // Payment amount required for event
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
  Venue?: string;
  university?: string;
  tagline?: string;
  EventMode?: string;
  EventType?: string;
  EventUrl?: string;
  TeamSize?: number;
  clubId?: string;
  prizes?: string;
  startDate?: string;
  endDate?: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  collegeStudentsOnly?: boolean;
  contactEmail?: string;
  contactPhone?: string | null;
  participationFee?: boolean;
  posterUrl?: string;
  link1?: string | null;
  link2?: string | null;
  link3?: string | null;
  whatsappLink?: string;
  isPaid?: boolean;
  Fees?: string;
  qrCodeUrl?: string;
  paymentAmount?: string | number;
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
  requirements?: string;
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
    posterUrl?: string | null;
    prizes: string;
    clubId: string;
    createdAt: Date | string;
    endDate: Date | string | null;
    startDate?: string;
    tagline?: string;
    EventMode?: string;
    EventType?: string;
    EventUrl?: string;
    Venue?: string;
    TeamSize?: number;
    applicationStartDate?: string;
    applicationEndDate?: string;
    university?: string;
    collegeStudentsOnly?: boolean;
    contactEmail?: string;
    contactPhone?: string | null;
    participationFee?: boolean;
    link1?: string | null;
    link2?: string | null;
    link3?: string | null;
    whatsappLink?: string;
    isPaid?: boolean;
    Fees?: string;
    qrCodeUrl?: string;
    paymentAmount?: string | number;
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
  isPaidEvent?: boolean;
  paymentQRCode?: string;
  paymentAmount?: number;
}

export interface respnseUseState {
  EventName: string;
  description: string;
  EventMode: string;
  startDate: any;
  endDate: any;
  prizes?: string;
  contactEmail: string;
  contactPhone: string;
  university: string;
  collegeStudentsOnly: boolean;
  applicationStatus: string;
  posterUrl?: string;
  eventHeader?: string;
  whatsappLink?: string;
  eventWebsite?: string;
  form?: string;
  isPaidEvent?: boolean;
  paymentQRCode?: string;
  paymentAmount?: number;
}
export interface PostData {
 
    title: string;
    description: string;
    collegeName: string;
    clubName: string;
    image: string | null;
    id: string;
    createdAt: Date;
    collegeId: string | null;
    updatedAt: Date;
    published: boolean;
    author: {
        name: string | null;
        profileAvatar: string | null;
    };
    upvotes: {
        id: string;
        createdAt: Date;
        postId: string;
        userId: string;
    }[];
    downvotes: {
        id: string;
        createdAt: Date;
        postId: string;
        userId: string;
    }[];
    authorId: string;
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
    contactPhone: string;
    whatsappLink?: string; // Optional WhatsApp group link
    whatsappGroupLink?: string; // Alternative field name
    eventWebsite?: string; // Optional event website
    form?: string; // Optional registration form
    registrationForm?: string; // Alternative field name for registration form
    isPaidEvent?: boolean; // Flag to indicate if event requires payment
    isPaid?: boolean; // Alternative field name from backend (maps to isPaidEvent)
    paymentQRCode?: string; // QR code image URL for payment
    qrCodeUrl?: string; // Alternative field name from backend (maps to paymentQRCode)
    paymentAmount?: number; // Payment amount required for event
  };
}

// will fix it later
