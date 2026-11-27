export type EventCategory = 'Akan Datang' | 'Terlaksana' | 'Program Kerja';
export type FeedbackType = 'Saran' | 'Kritik' | 'Aspirasi';
export type FeedbackCategory =
  | 'Kegiatan OSIS'
  | 'Fasilitas Sekolah'
  | 'Ekstrakurikuler'
  | 'Lainnya';
export type FeedbackStatus = 'Baru' | 'Diproses' | 'Selesai';

export interface Batch {
  id: string;
  year: string;
  title: string;
  theme: string;
  isActive: boolean;
  createdAt?: Date | null;
  isFallback?: boolean;
}

export interface Memory {
  id: string;
  batchId: string;
  batchYear: string;
  authorUid: string;
  studentName: string;
  className: string;
  message: string;
  quote: string;
  isPublic: boolean;
  createdAt?: Date | null;
  isFallback?: boolean;
}

export interface FeedbackItem {
  id: string;
  authorUid: string;
  senderName: string;
  className: string;
  feedbackType: FeedbackType;
  category: FeedbackCategory;
  message: string;
  isPublic: boolean;
  status: FeedbackStatus;
  adminReply: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isFallback?: boolean;
}

export interface OsisEvent {
  id: string;
  title: string;
  category: EventCategory;
  dateLabel: string;
  location: string;
  organizer: string;
  summary: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isFallback?: boolean;
}

export interface SocialSettings {
  schoolInstagramHandle: string;
  schoolInstagramUrl: string;
  osisInstagramHandle: string;
  osisInstagramUrl: string;
  schoolTiktokHandle: string;
  schoolTiktokUrl: string;
  osisTiktokHandle: string;
  osisTiktokUrl: string;
}

// Verbatim validation constants synchronized with firebase-blueprint.json & firestore.rules
export const VALIDATION_LIMITS = {
  idPattern: /^[a-zA-Z0-9_-]+$/,
  yearPattern: /^[0-9]{4}$/,
  batch: {
    titleMin: 3,
    titleMax: 100,
    themeMin: 3,
    themeMax: 160,
  },
  memory: {
    studentNameMin: 2,
    studentNameMax: 80,
    classNameMin: 2,
    classNameMax: 50,
    messageMin: 5,
    messageMax: 600,
    quoteMax: 160,
  },
  feedback: {
    senderNameMin: 2,
    senderNameMax: 80,
    classNameMax: 50,
    messageMin: 10,
    messageMax: 800,
    adminReplyMax: 500,
  },
  event: {
    titleMin: 3,
    titleMax: 120,
    dateLabelMin: 3,
    dateLabelMax: 60,
    locationMin: 2,
    locationMax: 100,
    organizerMin: 2,
    organizerMax: 80,
    summaryMin: 10,
    summaryMax: 240,
    descriptionMin: 10,
    descriptionMax: 1500,
    imageUrlMax: 300,
  },
  social: {
    handleMin: 2,
    handleMax: 60,
    urlMin: 10,
    urlMax: 200,
  },
} as const;

export const ADMIN_EMAIL = 'oskagapacitan@gmail.com';
