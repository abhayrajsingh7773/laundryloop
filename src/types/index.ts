export type LaundryStatus = 
  | 'received'
  | 'sorting'
  | 'washing'
  | 'drying'
  | 'ready_for_pickup'
  | 'collected';

export interface ItemBreakdown {
  shirts: number;
  trousers: number;
  tshirts: number;
  undergarments: number;
  bedding: number;
  others: number;
}

export interface TimelineStep {
  status: LaundryStatus;
  label: string;
  description: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
  isDone: boolean;
  isCurrent: boolean;
}

export interface LaundryOrder {
  id: string; // e.g., LD-1001
  studentName: string;
  studentId: string;
  hostel: string;
  roomNo: string;
  phone: string;
  totalItems: number;
  itemBreakdown: ItemBreakdown;
  specialCare?: string;
  notes?: string;
  status: LaundryStatus;
  submissionDate: string; // formatted e.g., "23 Oct 2026, 09:30 AM"
  expectedCollectionDate: string; // e.g., "25 Oct 2026, 05:00 PM"
  isDelayed?: boolean;
  delayReason?: string;
  revisedExpectedDate?: string;
  collectionPin: string; // 4-digit verification PIN, e.g. "3914"
  isCollected: boolean;
  collectedAt?: string;
  timeline: TimelineStep[];
  lastUpdated: string;
}

export type ComplaintCategory =
  | 'missing_clothes'
  | 'wrong_clothes'
  | 'damaged_clothes'
  | 'laundry_delay'
  | 'incorrect_item_count'
  | 'other';

export type ComplaintStatus = 'submitted' | 'under_review' | 'resolved';

export interface Complaint {
  id: string; // e.g., CMP-801
  orderId: string;
  studentName: string;
  studentId: string;
  hostel: string;
  roomNo: string;
  category: ComplaintCategory;
  description: string;
  preferredResolution: string;
  status: ComplaintStatus;
  submittedAt: string;
  wardenNote?: string;
  resolvedAt?: string;
}

export type UserRole = 'student' | 'staff' | 'warden';

export interface StudentProfile {
  name: string;
  studentId: string;
  hostel: string;
  roomNo: string;
  phone: string;
  email: string;
  program: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  orderId?: string;
}
