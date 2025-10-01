// Core domain types and MongoDB collection names

export type OTTPlatform = 'Netflix' | 'Hotstar' | 'YouTube' | 'Spotify' | 'Zee5' | 'Prime Video' | 'Disney+' | 'SonyLIV' | 'JioCinema';

export interface User {
  _id?: string;
  email: string;
  name?: string;
  phone?: string;
  passwordHash?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pool {
  _id?: string;
  platform: OTTPlatform;
  hostUserId: string; // ref User
  pricePerMember: number; // validated against base minimums
  maxMembers: number; // e.g., 4
  members: string[]; // userIds
  status: 'draft' | 'awaiting_verification' | 'open' | 'filled' | 'active' | 'closed';
  proofUploadUrl?: string; // receipt/proof
  verification: {
    method: 'manual' | 'api';
    verified: boolean;
    verifiedAt?: Date;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalPlan {
  _id?: string;
  platform: OTTPlatform;
  ownerUserId: string; // pooling user setting prices
  days: number; // 1,4,8,30
  price: number; // validated min/max
  status: 'active' | 'expired' | 'cancelled';
  bookings: Array<{
    userId: string;
    startAt: Date;
    endAt: Date;
    status: 'booked' | 'completed' | 'cancelled';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstantGoldPlan {
  _id?: string;
  platform: OTTPlatform;
  priceMonthly: number;
  stock: number; // available seats for instant delivery
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id?: string;
  userId: string;
  kind: 'pool' | 'rental' | 'instant';
  refId: string; // poolId/rentalId/instantId
  amount: number;
  currency: 'INR' | 'USD';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway: 'razorpay' | 'stripe' | 'mock';
  createdAt: Date;
  updatedAt: Date;
}

export const COLLECTIONS = {
  users: 'users',
  pools: 'pools',
  rentals: 'rentals',
  instant: 'instant_plans',
  transactions: 'transactions',
  pricing: 'platform_pricing'
} as const;

export const BASE_MIN_PRICE_INR: Record<OTTPlatform, number> = {
  'Netflix': 0.5, // per day min equivalent
  'Hotstar': 0.3,
  'YouTube': 0.2,
  'Spotify': 0.2,
  'Zee5': 0.2,
  'Prime Video': 0.3,
  'Disney+': 0.3,
  'SonyLIV': 0.2,
  'JioCinema': 0.1
};

export const RENTAL_LIMITS = {
  min: 0.2, // INR per day lower bound
  max: 30 // INR per day upper bound to avoid illogical
};
