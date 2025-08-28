import { UserRepository } from '../repositories/UserRepository';
import { UpdateUserInput, UpdateUserRoleInput, BanUserInput } from '../domain/schemas';
import { User, UserProfile, UserRole, canModerateUser } from '../domain/types';
import { createError } from '../middlewares/errorHandler';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getProfile(userId: number, requestingUserId?: number): Promise<UserProfile> {
    const profile = await this.userRepo.getProfile(userId, requestingUserId);
    if (!profile) {
      throw createError('User not found', 404);
    }
    return profile;
  }

  async updateProfile(userId: number, updateData: UpdateUserInput): Promise<User> {
    // If updating handle, check availability
    if (updateData.handle) {
      const existingUser = await this.userRepo.findByHandle(updateData.handle);
      if (existingUser && existingUser.id !== userId) {
        throw createError('Handle already taken', 409);
      }
    }

    // If updating RSI handle, check availability
    if (updateData.rsi_handle) {
      const existingRSI = await this.userRepo.findByRSIHandle(updateData.rsi_handle);
      if (existingRSI && existingRSI.id !== userId) {
        throw createError('RSI handle already linked to another account', 409);
      }
    }

    const updatedUser = await this.userRepo.update(userId, updateData);
    if (!updatedUser) {
      throw createError('User not found', 404);
    }

    return updatedUser;
  }

  async updateRole(
    adminId: number, 
    targetUserId: number, 
    roleData: UpdateUserRoleInput
  ): Promise<User> {
    const admin = await this.userRepo.findById(adminId);
    const targetUser = await this.userRepo.findById(targetUserId);

    if (!admin || !targetUser) {
      throw createError('User not found', 404);
    }

    // Check if admin can moderate this user
    if (!canModerateUser(admin.role, targetUser.role)) {
      throw createError('Insufficient permissions to modify this user\'s role', 403);
    }

    // Prevent setting role higher than admin's role
    const roleHierarchy = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    const adminLevel = roleHierarchy.indexOf(admin.role);
    const newRoleLevel = roleHierarchy.indexOf(roleData.role);

    if (newRoleLevel >= adminLevel) {
      throw createError('Cannot assign role equal or higher than your own', 403);
    }

    const updatedUser = await this.userRepo.updateRole(targetUserId, roleData.role);
    if (!updatedUser) {
      throw createError('Failed to update user role', 500);
    }

    return updatedUser;
  }

  async banUser(
    moderatorId: number,
    targetUserId: number,
    banData: BanUserInput
  ): Promise<User> {
    const moderator = await this.userRepo.findById(moderatorId);
    const targetUser = await this.userRepo.findById(targetUserId);

    if (!moderator || !targetUser) {
      throw createError('User not found', 404);
    }

    // Check if moderator can ban this user
    if (!canModerateUser(moderator.role, targetUser.role)) {
      throw createError('Insufficient permissions to ban this user', 403);
    }

    if (targetUser.isBanned) {
      throw createError('User is already banned', 400);
    }

    const bannedUser = await this.userRepo.banUser(
      targetUserId,
      banData.reason,
      moderatorId,
      banData.duration
    );

    if (!bannedUser) {
      throw createError('Failed to ban user', 500);
    }

    return bannedUser;
  }

  async unbanUser(moderatorId: number, targetUserId: number): Promise<User> {
    const moderator = await this.userRepo.findById(moderatorId);
    const targetUser = await this.userRepo.findById(targetUserId);

    if (!moderator || !targetUser) {
      throw createError('User not found', 404);
    }

    if (!targetUser.isBanned) {
      throw createError('User is not banned', 400);
    }

    // Check if moderator can unban this user
    if (!canModerateUser(moderator.role, targetUser.role)) {
      throw createError('Insufficient permissions to unban this user', 403);
    }

    const unbannedUser = await this.userRepo.unbanUser(targetUserId);
    if (!unbannedUser) {
      throw createError('Failed to unban user', 500);
    }

    return unbannedUser;
  }

  async getLeaderboard(limit: number = 50): Promise<UserProfile[]> {
    return this.userRepo.getLeaderboard(limit);
  }

  async searchUsers(query: string, limit: number = 20): Promise<UserProfile[]> {
    if (!query.trim()) {
      throw createError('Search query cannot be empty', 400);
    }

    return this.userRepo.searchUsers(query, limit);
  }

  async awardXP(userId: number, amount: number, reason?: string): Promise<User> {
    if (amount <= 0) {
      throw createError('XP amount must be positive', 400);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const updatedUser = await this.userRepo.updateXP(userId, amount);
    if (!updatedUser) {
      throw createError('Failed to award XP', 500);
    }

    return updatedUser;
  }

  async deactivateAccount(userId: number): Promise<User> {
    const user = await this.userRepo.update(userId, { isActive: false } as UpdateUserInput);
    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }

  async reactivateAccount(userId: number): Promise<User> {
    const user = await this.userRepo.update(userId, { isActive: true } as UpdateUserInput);
    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }
}