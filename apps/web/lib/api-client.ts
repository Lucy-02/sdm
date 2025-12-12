import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

console.log('🔧 API Client baseURL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// SWR fetcher
export const fetcher = <T>(url: string): Promise<T> =>
  apiClient.get(url).then(res => res.data);

// Vendor 관련 타입
export interface VendorImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface VendorTag {
  name: string;
  slug: string;
}

export interface VendorCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  location: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  images: VendorImage[];
  tags: VendorTag[];
  category: VendorCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorListResponse {
  data: Vendor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VendorQueryParams {
  category?: string; // slug로 카테고리 필터링
  location?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'reviewCount' | 'priceMin' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
