// Re-export all types from local shared
export * from './shared';

// SDK specific types
export interface SDKError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface ClientOptions {
  retries?: number;
  retryDelay?: number;
  onTokenExpired?: () => void;
  onError?: (error: SDKError) => void;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

// Event types for real-time features (future)
export interface EventData {
  type: string;
  data: any;
  timestamp: number;
}

export interface NotificationData {
  id: string;
  type: 'like' | 'follow' | 'friend_request' | 'mention' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}