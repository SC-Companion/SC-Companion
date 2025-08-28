import { FollowRepository } from '../repositories/FollowRepository';
import { FriendRepository } from '../repositories/FriendRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserProfile, PaginatedResponse, XP_LEVELS } from '../domain/types';
import { createError } from '../middlewares/errorHandler';

export class SocialService {
  private followRepo: FollowRepository;
  private friendRepo: FriendRepository;
  private userRepo: UserRepository;

  constructor() {
    this.followRepo = new FollowRepository();
    this.friendRepo = new FriendRepository();
    this.userRepo = new UserRepository();
  }

  // Follow functionality
  async followUser(followerId: number, followingId: number): Promise<{ success: boolean }> {
    if (followerId === followingId) {
      throw createError('Cannot follow yourself', 400);
    }

    const follower = await this.userRepo.findById(followerId);
    const following = await this.userRepo.findById(followingId);

    if (!follower || !following) {
      throw createError('User not found', 404);
    }

    if (!follower.isActive || follower.isBanned) {
      throw createError('Your account is not active', 403);
    }

    if (!following.isActive) {
      throw createError('Target user account is not active', 403);
    }

    try {
      await this.followRepo.follow(followerId, followingId);
      
      // Award XP for gaining a follower
      await this.userRepo.updateXP(followingId, XP_LEVELS.FOLLOW_GAINED);
      
      return { success: true };
    } catch (error: any) {
      if (error.message === 'Already following this user') {
        throw createError('Already following this user', 409);
      }
      throw error;
    }
  }

  async unfollowUser(followerId: number, followingId: number): Promise<{ success: boolean }> {
    const success = await this.followRepo.unfollow(followerId, followingId);
    if (!success) {
      throw createError('Not following this user', 404);
    }

    return { success: true };
  }

  async getFollowers(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return this.followRepo.getFollowers(userId, cursor, limit);
  }

  async getFollowing(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return this.followRepo.getFollowing(userId, cursor, limit);
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return this.followRepo.isFollowing(followerId, followingId);
  }

  // Friend functionality
  async sendFriendRequest(requesterId: number, addresseeId: number): Promise<{ success: boolean }> {
    if (requesterId === addresseeId) {
      throw createError('Cannot send friend request to yourself', 400);
    }

    const requester = await this.userRepo.findById(requesterId);
    const addressee = await this.userRepo.findById(addresseeId);

    if (!requester || !addressee) {
      throw createError('User not found', 404);
    }

    if (!requester.isActive || requester.isBanned) {
      throw createError('Your account is not active', 403);
    }

    if (!addressee.isActive) {
      throw createError('Target user account is not active', 403);
    }

    try {
      await this.friendRepo.sendFriendRequest(requesterId, addresseeId);
      return { success: true };
    } catch (error: any) {
      if (error.message.includes('already')) {
        throw createError(error.message, 409);
      }
      throw error;
    }
  }

  async respondToFriendRequest(
    requestId: number, 
    addresseeId: number, 
    action: 'accept' | 'decline'
  ): Promise<{ success: boolean }> {
    const addressee = await this.userRepo.findById(addresseeId);
    if (!addressee) {
      throw createError('User not found', 404);
    }

    if (!addressee.isActive || addressee.isBanned) {
      throw createError('Your account is not active', 403);
    }

    try {
      await this.friendRepo.respondToFriendRequest(requestId, addresseeId, action);
      return { success: true };
    } catch (error: any) {
      if (error.message === 'Friend request not found or not pending') {
        throw createError('Friend request not found or not pending', 404);
      }
      throw error;
    }
  }

  async removeFriend(userId: number, friendId: number): Promise<{ success: boolean }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const success = await this.friendRepo.removeFriend(userId, friendId);
    if (!success) {
      throw createError('Not friends with this user', 404);
    }

    return { success: true };
  }

  async getFriends(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return this.friendRepo.getFriends(userId, cursor, limit);
  }

  async getPendingFriendRequests(userId: number, type: 'sent' | 'received' = 'received'): Promise<UserProfile[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return this.friendRepo.getPendingRequests(userId, type);
  }

  async areFriends(userId1: number, userId2: number): Promise<boolean> {
    return this.friendRepo.areFriends(userId1, userId2);
  }

  // Combined social stats
  async getSocialStats(userId: number): Promise<{
    followersCount: number;
    followingCount: number;
    friendsCount: number;
  }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const [followersCount, followingCount, friendsCount] = await Promise.all([
      this.followRepo.getFollowersCount(userId),
      this.followRepo.getFollowingCount(userId),
      this.friendRepo.getFriendsCount(userId)
    ]);

    return {
      followersCount,
      followingCount,
      friendsCount
    };
  }
}