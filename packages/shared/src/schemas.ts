import { z } from 'zod';
import { UserRole } from './types';

// User schemas
export const CreateUserSchema = z.object({
  handle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  rsi_handle: z.string().min(1).max(50).optional(),
});

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  rsi_handle: z.string().min(1).max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LinkRSIAccountSchema = z.object({
  rsi_handle: z.string().min(1).max(50),
});

// Post schemas
export const CreatePostSchema = z.object({
  content: z.string().min(1).max(2000),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
});

export const UpdatePostSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
});

// Admin schemas
export const UpdateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const BanUserSchema = z.object({
  reason: z.string().min(1).max(500),
  duration: z.number().positive().optional(),
});

export const ModeratePostSchema = z.object({
  reason: z.string().min(1).max(500),
});

// Social schemas
export const FollowSchema = z.object({
  targetUserId: z.number().int().positive(),
});

export const FriendRequestSchema = z.object({
  targetUserId: z.number().int().positive(),
});

export const FriendRequestResponseSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

// Pagination schemas
export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});

// Type exports
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type LinkRSIAccountInput = z.infer<typeof LinkRSIAccountSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type BanUserInput = z.infer<typeof BanUserSchema>;
export type ModeratePostInput = z.infer<typeof ModeratePostSchema>;
export type FollowInput = z.infer<typeof FollowSchema>;
export type FriendRequestInput = z.infer<typeof FriendRequestSchema>;
export type FriendRequestResponseInput = z.infer<typeof FriendRequestResponseSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;