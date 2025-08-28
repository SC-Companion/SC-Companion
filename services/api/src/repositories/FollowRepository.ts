import { Knex } from 'knex';
import db from '../db/knex';
import { Follow, UserProfile, PaginatedResponse, calculateLevel } from '../domain/types';

export class FollowRepository {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async follow(followerId: number, followingId: number): Promise<Follow> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existing = await this.db('follows')
      .where({ followerId, followingId })
      .first();

    if (existing) {
      throw new Error('Already following this user');
    }

    const [follow] = await this.db('follows')
      .insert({ followerId, followingId })
      .returning('*');

    return follow;
  }

  async unfollow(followerId: number, followingId: number): Promise<boolean> {
    const deleted = await this.db('follows')
      .where({ followerId, followingId })
      .del();

    return deleted > 0;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.db('follows')
      .where({ followerId, followingId })
      .first();

    return !!follow;
  }

  async getFollowers(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    let query = this.db('follows')
      .select(
        'users.*',
        'follows.createdAt as followedAt'
      )
      .join('users', 'follows.followerId', 'users.id')
      .where('follows.followingId', userId)
      .andWhere('users.isActive', true)
      .andWhere('users.isBanned', false)
      .orderBy('follows.createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.where('follows.createdAt', '<', cursor);
    }

    const results = await query;
    const hasNext = results.length > limit;
    const followers = hasNext ? results.slice(0, -1) : results;

    return {
      data: followers.map(user => ({
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
        isActive: user.isActive,
        isPremium: user.isPremium,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      })),
      pagination: {
        hasNext,
        nextCursor: hasNext ? followers[followers.length - 1].followedAt.toISOString() : undefined
      }
    };
  }

  async getFollowing(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    let query = this.db('follows')
      .select(
        'users.*',
        'follows.createdAt as followedAt'
      )
      .join('users', 'follows.followingId', 'users.id')
      .where('follows.followerId', userId)
      .andWhere('users.isActive', true)
      .andWhere('users.isBanned', false)
      .orderBy('follows.createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.where('follows.createdAt', '<', cursor);
    }

    const results = await query;
    const hasNext = results.length > limit;
    const following = hasNext ? results.slice(0, -1) : results;

    return {
      data: following.map(user => ({
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
        isActive: user.isActive,
        isPremium: user.isPremium,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      })),
      pagination: {
        hasNext,
        nextCursor: hasNext ? following[following.length - 1].followedAt.toISOString() : undefined
      }
    };
  }

  async getFollowersCount(userId: number): Promise<number> {
    const [result] = await this.db('follows')
      .where({ followingId: userId })
      .count('id as count');

    return parseInt(result.count);
  }

  async getFollowingCount(userId: number): Promise<number> {
    const [result] = await this.db('follows')
      .where({ followerId: userId })
      .count('id as count');

    return parseInt(result.count);
  }
}