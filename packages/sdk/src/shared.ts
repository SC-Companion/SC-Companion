// Types copiés du package shared pour éviter les problèmes de workspace
import { z } from 'zod';

// User roles and permissions
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  CREATE_POST = 'create_post',
  EDIT_OWN_POST = 'edit_own_post',
  DELETE_OWN_POST = 'delete_own_post',
  MODERATE_POSTS = 'moderate_posts',
  MODERATE_USERS = 'moderate_users',
  MODERATE_COMMENTS = 'moderate_comments',
  BAN_USERS = 'ban_users',
  MANAGE_USERS = 'manage_users',
  MANAGE_MODERATORS = 'manage_moderators',
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  MANAGE_QUESTS = 'manage_quests',
  MANAGE_EVENTS = 'manage_events',
  MANAGE_ADMINS = 'manage_admins',
  SYSTEM_CONFIG = 'system_config',
  DATABASE_ACCESS = 'database_access'
}

// API Response types
export interface User {
  id: number;
  handle: string;
  displayName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  rsi_handle?: string;
  rsi_geid?: string;
  role: UserRole;
  xp: number;
  level: number;
  isActive: boolean;
  isPremium: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  isModerated: boolean;
  moderatedAt?: string;
  moderatedBy?: number;
  moderationReason?: string;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
}

export interface PostWithUser extends Post {
  user: {
    id: number;
    handle: string;
    displayName: string;
    avatar?: string;
    xp: number;
    level: number;
    isPremium: boolean;
    role: UserRole;
    rsi_handle?: string;
  };
}

export interface UserProfile {
  id: number;
  handle: string;
  displayName: string;
  bio?: string;
  location?: string;
  avatar?: string;
  rsi_handle?: string;
  role: UserRole;
  xp: number;
  level: number;
  isActive: boolean;
  isPremium: boolean;
  isBanned: boolean;
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  isFriend?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasNext: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface SocialStats {
  followersCount: number;
  followingCount: number;
  friendsCount: number;
}

// Schemas
export const CreateUserSchema = z.object({
  handle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  rsi_handle: z.string().min(1).max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const CreatePostSchema = z.object({
  content: z.string().min(1).max(2000),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
});

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});

// Types
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = Partial<CreateUserInput>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type LinkRSIAccountInput = { rsi_handle: string };
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = { content?: string };
export type FollowInput = { targetUserId: number };
export type FriendRequestInput = { targetUserId: number };
export type FriendRequestResponseInput = { action: 'accept' | 'decline' };
export type PaginationInput = z.infer<typeof PaginationSchema>;

// Constants
export const API_ENDPOINTS = {
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  REFRESH_TOKEN: '/api/users/refresh-token',
  ME: '/api/users/me',
  LINK_RSI: '/api/users/link-rsi',
  UPDATE_RSI_GEID: '/api/users/rsi-geid',
  USER_PROFILE: (userId: number) => `/api/users/${userId}`,
  UPDATE_PROFILE: '/api/users/profile',
  SEARCH_USERS: '/api/users/search',
  LEADERBOARD: '/api/users/leaderboard',
  DEACTIVATE_ACCOUNT: '/api/users/deactivate',
  CREATE_POST: '/api/posts',
  GET_POST: (postId: number) => `/api/posts/${postId}`,
  UPDATE_POST: (postId: number) => `/api/posts/${postId}`,
  DELETE_POST: (postId: number) => `/api/posts/${postId}`,
  FEED: '/api/posts/feed',
  USER_POSTS: (userId: number) => `/api/posts/user/${userId}`,
  LIKE_POST: (postId: number) => `/api/posts/${postId}/like`,
  UNLIKE_POST: (postId: number) => `/api/posts/${postId}/like`,
  FOLLOW_USER: '/api/follows',
  UNFOLLOW_USER: (userId: number) => `/api/follows/${userId}`,
  GET_FOLLOWERS: (userId: number) => `/api/follows/${userId}/followers`,
  GET_FOLLOWING: (userId: number) => `/api/follows/${userId}/following`,
  SEND_FRIEND_REQUEST: '/api/friends/request',
  RESPOND_FRIEND_REQUEST: (requestId: number) => `/api/friends/request/${requestId}`,
  GET_PENDING_REQUESTS: '/api/friends/requests',
  REMOVE_FRIEND: (userId: number) => `/api/friends/${userId}`,
  GET_FRIENDS: (userId: number) => `/api/friends/${userId}/friends`,
  GET_SOCIAL_STATS: (userId: number) => `/api/friends/${userId}/stats`,
} as const;