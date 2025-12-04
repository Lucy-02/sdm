// Common types shared between frontend and backend

// ============================================
// User & Auth
// ============================================

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ============================================
// Simulation
// ============================================

export enum SimulationStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface SimulationResult {
  id: string;
  userId: string;
  groomImageUrl: string;
  brideImageUrl: string;
  outputImageUrl?: string;
  status: SimulationStatus;
  concept?: string;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

// ============================================
// Vendor
// ============================================

export interface VendorCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  categoryId: string;
  category?: VendorCategory;
  ownerId?: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  location: string;
  lat?: number;
  lng?: number;
  priceRange?: string;
  priceMin?: number;
  priceMax?: number;
  businessHours?: Record<string, string>;
  metadata?: Record<string, unknown>;
  rating?: number;
  reviewCount: number;
  bookingCount: number;
  favoriteCount: number;
  viewCount: number;
  isVerified: boolean;
  isActive: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum VendorImageType {
  PORTFOLIO = 'PORTFOLIO',
  THUMBNAIL = 'THUMBNAIL',
  LOGO = 'LOGO',
  INTERIOR = 'INTERIOR',
  MENU = 'MENU',
}

export interface VendorImage {
  id: string;
  vendorId: string;
  url: string;
  type: VendorImageType;
  displayOrder: number;
  altText?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  usageCount: number;
  createdAt: Date;
}

// ============================================
// Review
// ============================================

export interface Review {
  id: string;
  vendorId: string;
  userId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Booking
// ============================================

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export interface Booking {
  id: string;
  vendorId: string;
  userId: string;
  status: BookingStatus;
  eventDate?: Date;
  guestCount?: number;
  budget?: number;
  message: string;
  vendorResponse?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

// ============================================
// API DTOs
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================================
// WebSocket Events
// ============================================

export enum WebSocketEvent {
  SIMULATION_STARTED = 'simulation:started',
  SIMULATION_PROGRESS = 'simulation:progress',
  SIMULATION_COMPLETED = 'simulation:completed',
  SIMULATION_FAILED = 'simulation:failed',
}

export interface SimulationProgressPayload {
  resultId: string;
  progress: number; // 0-100
  status: SimulationStatus;
  message?: string;
}

export interface SimulationCompletedPayload {
  resultId: string;
  outputImageUrl: string;
}

export interface SimulationFailedPayload {
  resultId: string;
  errorMessage: string;
}
