// User roles and permissions
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  // User permissions
  CREATE_POST = 'create_post',
  EDIT_OWN_POST = 'edit_own_post',
  DELETE_OWN_POST = 'delete_own_post',
  
  // Moderation permissions
  MODERATE_POSTS = 'moderate_posts',
  MODERATE_USERS = 'moderate_users',
  MODERATE_COMMENTS = 'moderate_comments',
  BAN_USERS = 'ban_users',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_MODERATORS = 'manage_moderators',
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  MANAGE_QUESTS = 'manage_quests',
  MANAGE_EVENTS = 'manage_events',
  
  // Super admin permissions
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
  level: number; // Calculated from XP
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
  isLiked?: boolean; // When fetched for a specific user
}

export interface PostWithUser extends Post {
  user: {
    id: number;
    handle: string;
    displayName: string;
    avatar?: string;
    xp: number;
    level: number; // Calculated from XP
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
  level: number; // Calculated from XP
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

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth responses
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

// Social stats
export interface SocialStats {
  followersCount: number;
  followingCount: number;
  friendsCount: number;
}

// XP and Level system
export interface XPGain {
  action: 'post' | 'like_received' | 'follow' | 'quest_completed' | 'event_participation' | 'session_stats';
  amount: number;
  description: string;
}

// Helper functions
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getProgressToNextLevel(xp: number): { currentLevel: number; xpInLevel: number; xpForNext: number; percentage: number } {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const xpInLevel = xp - xpForCurrentLevel;
  const xpForNext = xpForNextLevel - xpForCurrentLevel;
  const percentage = (xpInLevel / xpForNext) * 100;

  return {
    currentLevel,
    xpInLevel,
    xpForNext,
    percentage: Math.min(percentage, 100)
  };
}