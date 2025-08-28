import { Knex } from 'knex';
import db from '../db/knex';
import { User, UserProfile, UserRole, calculateLevel } from '../domain/types';
import { CreateUserInput, UpdateUserInput } from '../domain/schemas';
import bcrypt from 'bcryptjs';

export class UserRepository {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async create(userData: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    const [user] = await this.db('users')
      .insert({
        handle: userData.handle,
        displayName: userData.displayName,
        email: userData.email,
        passwordHash,
        bio: userData.bio,
        location: userData.location,
        rsi_handle: userData.rsi_handle,
      })
      .returning('*');

    return this.addCalculatedFields(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db('users')
      .where({ id })
      .first();

    return user ? this.addCalculatedFields(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db('users')
      .where({ email })
      .first();

    return user ? this.addCalculatedFields(user) : null;
  }

  async findByHandle(handle: string): Promise<User | null> {
    const user = await this.db('users')
      .where({ handle })
      .first();

    return user ? this.addCalculatedFields(user) : null;
  }

  async findByRSIHandle(rsi_handle: string): Promise<User | null> {
    const user = await this.db('users')
      .where({ rsi_handle })
      .first();

    return user ? this.addCalculatedFields(user) : null;
  }

  async update(id: number, userData: UpdateUserInput): Promise<User | null> {
    await this.db('users')
      .where({ id })
      .update({
        ...userData,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async updateXP(id: number, xpChange: number): Promise<User | null> {
    await this.db('users')
      .where({ id })
      .increment('xp', xpChange);

    return this.findById(id);
  }

  async updateRSIData(id: number, rsi_geid: string): Promise<User | null> {
    await this.db('users')
      .where({ id })
      .update({
        rsi_geid,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async updateRole(id: number, role: UserRole): Promise<User | null> {
    await this.db('users')
      .where({ id })
      .update({
        role,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async banUser(id: number, reason: string, bannedBy: number, duration?: number): Promise<User | null> {
    const bannedUntil = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;
    
    await this.db('users')
      .where({ id })
      .update({
        isBanned: true,
        bannedAt: this.db.fn.now(),
        bannedReason: reason,
        bannedBy,
        ...(bannedUntil && { bannedUntil }),
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async unbanUser(id: number): Promise<User | null> {
    await this.db('users')
      .where({ id })
      .update({
        isBanned: false,
        bannedAt: null,
        bannedReason: null,
        bannedBy: null,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async getProfile(id: number, requestingUserId?: number): Promise<UserProfile | null> {
    const user = await this.db('users')
      .where({ id })
      .first();

    if (!user) return null;

    // Get counts
    const [followersCount] = await this.db('follows')
      .where({ followingId: id })
      .count('id as count');

    const [followingCount] = await this.db('follows')
      .where({ followerId: id })
      .count('id as count');

    const [postsCount] = await this.db('posts')
      .where({ userId: id, isModerated: false })
      .count('id as count');

    let isFollowing = false;
    let isFriend = false;

    if (requestingUserId && requestingUserId !== id) {
      // Check if requesting user follows this user
      const followRecord = await this.db('follows')
        .where({ followerId: requestingUserId, followingId: id })
        .first();
      isFollowing = !!followRecord;

      // Check if they are friends
      const friendRecord = await this.db('friends')
        .where(builder => {
          builder.where({ requesterId: requestingUserId, addresseeId: id, status: 'accepted' })
            .orWhere({ requesterId: id, addresseeId: requestingUserId, status: 'accepted' });
        })
        .first();
      isFriend = !!friendRecord;
    }

    return {
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
      followersCount: parseInt(followersCount.count),
      followingCount: parseInt(followingCount.count),
      postsCount: parseInt(postsCount.count),
      isFollowing,
      isFriend
    };
  }

  async getLeaderboard(limit: number = 50): Promise<UserProfile[]> {
    const users = await this.db('users')
      .where({ isActive: true, isBanned: false })
      .orderBy('xp', 'desc')
      .limit(limit);

    return users.map(user => ({
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
    }));
  }

  async searchUsers(query: string, limit: number = 20): Promise<UserProfile[]> {
    const users = await this.db('users')
      .where({ isActive: true, isBanned: false })
      .andWhere(builder => {
        builder.where('handle', 'like', `%${query}%`)
          .orWhere('displayName', 'like', `%${query}%`)
          .orWhere('rsi_handle', 'like', `%${query}%`);
      })
      .limit(limit);

    return users.map(user => ({
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
    }));
  }

  private addCalculatedFields(user: any): User {
    return {
      ...user,
      level: calculateLevel(user.xp)
    };
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }
}