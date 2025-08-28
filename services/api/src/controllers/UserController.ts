import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { UserService } from '../services/UserService';
import { UpdateUserInput, UpdateUserRoleInput, BanUserInput } from '../domain/schemas';
import { calculateLevel } from '../domain/types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const requestingUserId = req.user?.id;
    
    const profile = await this.userService.getProfile(userId, requestingUserId);
    
    res.json({
      user: {
        ...profile,
        level: calculateLevel(profile.xp) // Ensure level is calculated
      }
    });
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const updateData: UpdateUserInput = req.body;
    
    const user = await this.userService.updateProfile(userId, updateData);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
        rsi_handle: user.rsi_handle,
        role: user.role,
        xp: user.xp,
        level: calculateLevel(user.xp),
        isPremium: user.isPremium,
        createdAt: user.createdAt
      }
    });
  };

  getLeaderboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 50;
    
    const leaderboard = await this.userService.getLeaderboard(Math.min(limit, 100));
    
    res.json({
      leaderboard: leaderboard.map(user => ({
        ...user,
        level: calculateLevel(user.xp)
      }))
    });
  };

  searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const users = await this.userService.searchUsers(query, Math.min(limit, 50));
    
    res.json({
      users: users.map(user => ({
        ...user,
        level: calculateLevel(user.xp)
      }))
    });
  };

  // Admin endpoints
  updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const adminId = req.user!.id;
    const targetUserId = parseInt(req.params.userId);
    const roleData: UpdateUserRoleInput = req.body;
    
    const user = await this.userService.updateRole(adminId, targetUserId, roleData);
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        role: user.role,
        xp: user.xp,
        level: calculateLevel(user.xp),
        createdAt: user.createdAt
      }
    });
  };

  banUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const moderatorId = req.user!.id;
    const targetUserId = parseInt(req.params.userId);
    const banData: BanUserInput = req.body;
    
    const user = await this.userService.banUser(moderatorId, targetUserId, banData);
    
    res.json({
      message: 'User banned successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        isBanned: user.isBanned,
        bannedAt: user.bannedAt,
        bannedReason: user.bannedReason,
        createdAt: user.createdAt
      }
    });
  };

  unbanUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const moderatorId = req.user!.id;
    const targetUserId = parseInt(req.params.userId);
    
    const user = await this.userService.unbanUser(moderatorId, targetUserId);
    
    res.json({
      message: 'User unbanned successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        isBanned: user.isBanned,
        createdAt: user.createdAt
      }
    });
  };

  awardXP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const { amount, reason } = req.body;
    
    const user = await this.userService.awardXP(userId, amount, reason);
    
    res.json({
      message: 'XP awarded successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        xp: user.xp,
        level: calculateLevel(user.xp),
        createdAt: user.createdAt
      }
    });
  };

  deactivateAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    const user = await this.userService.deactivateAccount(userId);
    
    res.json({
      message: 'Account deactivated successfully',
      user: {
        id: user.id,
        handle: user.handle,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  };
}