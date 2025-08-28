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

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.CREATE_POST,
    Permission.EDIT_OWN_POST,
    Permission.DELETE_OWN_POST
  ],
  [UserRole.MODERATOR]: [
    Permission.CREATE_POST,
    Permission.EDIT_OWN_POST,
    Permission.DELETE_OWN_POST,
    Permission.MODERATE_POSTS,
    Permission.MODERATE_USERS,
    Permission.MODERATE_COMMENTS,
    Permission.BAN_USERS
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE_POST,
    Permission.EDIT_OWN_POST,
    Permission.DELETE_OWN_POST,
    Permission.MODERATE_POSTS,
    Permission.MODERATE_USERS,
    Permission.MODERATE_COMMENTS,
    Permission.BAN_USERS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_MODERATORS,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.MANAGE_QUESTS,
    Permission.MANAGE_EVENTS
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission)
};

// Database entity types
export interface User {
  id: number;
  // SC Companion internal data
  handle: string;
  displayName: string;
  email: string;
  passwordHash: string;
  bio?: string;
  location?: string;
  avatar?: string;
  
  // RSI data
  rsi_handle?: string;
  rsi_geid?: string; // Populated from game logs
  
  // Roles and permissions
  role: UserRole;
  
  // System fields
  isActive: boolean;
  isBanned: boolean;
  bannedAt?: Date;
  bannedReason?: string;
  bannedBy?: number; // User ID of who banned
  
  // Premium
  isPremium: boolean;
  premiumExpiresAt?: Date;
  
  // Progression - only store XP, level is calculated
  xp: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  
  // Moderation
  isModerated: boolean;
  moderatedAt?: Date;
  moderatedBy?: number; // User ID of moderator
  moderationReason?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  isLiked?: boolean; // When fetched for a specific user
}

export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: Date;
  
  // Relations
  follower?: User;
  following?: User;
}

export interface Friend {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  requester?: User;
  addressee?: User;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
  
  // Relations
  user?: User;
  post?: Post;
}

// API Response types
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
  createdAt: Date;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  isFriend?: boolean;
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasNext: boolean;
    nextCursor?: string;
    total?: number;
  };
}

// XP and Level system
export interface XPGain {
  action: 'post' | 'like_received' | 'follow' | 'quest_completed' | 'event_participation' | 'session_stats';
  amount: number;
  description: string;
}

export const XP_LEVELS = {
  POST_CREATED: 10,
  LIKE_RECEIVED: 2,
  FOLLOW_GAINED: 5,
  QUEST_COMPLETED: 50,
  EVENT_PARTICIPATION: 25,
  SESSION_STATS: 1, // per minute of gameplay
} as const;

// Helper functions
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function canModerateUser(moderatorRole: UserRole, targetRole: UserRole): boolean {
  const roleHierarchy = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
  const moderatorLevel = roleHierarchy.indexOf(moderatorRole);
  const targetLevel = roleHierarchy.indexOf(targetRole);
  return moderatorLevel > targetLevel;
}

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Calculate XP needed for next level
export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}