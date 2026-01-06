
export enum UserRole {
  FISHERMAN = 'FISHERMAN',
  NGO = 'NGO',
  ADMIN = 'ADMIN',
  CORPORATE = 'CORPORATE'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  FIELD_CHECK = 'FIELD_CHECK',
  AI_VERIFIED = 'AI_VERIFIED',
  AI_FAILED = 'AI_FAILED',
  NGO_APPROVED = 'NGO_APPROVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Location {
  lat: number;
  lng: number;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
  note?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  location: Location;
  region: string;
  imageUrl: string;
  type: 'MANGROVE' | 'SEAGRASS';
  status: SubmissionStatus;
  aiScore: number;
  aiReasoning: string;
  detectedFeatures: string[];
  environmentalContext: string;
  googleMapsUrl?: string;
  aiOverridden?: boolean;
  creditsGenerated: number;
  verifierComments?: string;
  blockchainHash?: string;
  auditTrail: AuditLog[];
}

export interface CreditRecord {
  id: string;
  submissionId: string;
  amount: number;
  vintage: string;
  status: 'AVAILABLE' | 'SOLD' | 'FROZEN';
  ownerId?: string;
  purchaseDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  creditsPurchased?: number;
  earnings?: number;
  status?: 'ACTIVE' | 'FROZEN' | 'PENDING_KYC';
  trustScore?: number;
}
