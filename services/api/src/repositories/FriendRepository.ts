import { Knex } from 'knex';
import db from '../db/knex';
import { Friend, UserProfile, PaginatedResponse, calculateLevel } from '../domain/types';

export class FriendRepository {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async sendFriendRequest(requesterId: number, addresseeId: number): Promise<Friend> {
    if (requesterId === addresseeId) {
      throw new Error('Cannot send friend request to yourself');
    }

    // Check if request already exists (in either direction)
    const existing = await this.db('friends')
      .where(builder => {
        builder.where({ requesterId, addresseeId })
          .orWhere({ requesterId: addresseeId, addresseeId: requesterId });
      })
      .first();

    if (existing) {
      if (existing.status === 'accepted') {
        throw new Error('Already friends with this user');
      } else if (existing.status === 'pending') {
        throw new Error('Friend request already pending');
      }
      // If declined, we can send a new request
    }

    const [friendRequest] = await this.db('friends')
      .insert({
        requesterId,
        addresseeId,
        status: 'pending'
      })
      .returning('*');

    return friendRequest;
  }

  async respondToFriendRequest(requestId: number, addresseeId: number, action: 'accept' | 'decline'): Promise<Friend | null> {
    const request = await this.db('friends')
      .where({ id: requestId, addresseeId, status: 'pending' })
      .first();

    if (!request) {
      throw new Error('Friend request not found or not pending');
    }

    await this.db('friends')
      .where({ id: requestId })
      .update({
        status: action,
        updated_at: this.db.fn.now()
      });

    return this.db('friends')
      .where({ id: requestId })
      .first();
  }

  async removeFriend(userId: number, friendId: number): Promise<boolean> {
    const deleted = await this.db('friends')
      .where(builder => {
        builder.where({ requesterId: userId, addresseeId: friendId, status: 'accepted' })
          .orWhere({ requesterId: friendId, addresseeId: userId, status: 'accepted' });
      })
      .del();

    return deleted > 0;
  }

  async areFriends(userId1: number, userId2: number): Promise<boolean> {
    const friendship = await this.db('friends')
      .where(builder => {
        builder.where({ requesterId: userId1, addresseeId: userId2, status: 'accepted' })
          .orWhere({ requesterId: userId2, addresseeId: userId1, status: 'accepted' });
      })
      .first();

    return !!friendship;
  }

  async getFriends(userId: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<UserProfile>> {
    let query = this.db('friends')
      .select(
        'users.*',
        'friends.createdAt as friendedAt'
      )
      .leftJoin('users as requester', function() {
        this.on('friends.requesterId', '=', 'requester.id')
            .andOn('friends.requesterId', '!=', this.db.raw('?', [userId]));
      })
      .leftJoin('users as addressee', function() {
        this.on('friends.addresseeId', '=', 'addressee.id')
            .andOn('friends.addresseeId', '!=', this.db.raw('?', [userId]));
      })
      .select(this.db.raw(`
        CASE 
          WHEN friends.requesterId = ? THEN addressee.*
          ELSE requester.*
        END as users
      `, [userId]))
      .where(builder => {
        builder.where({ requesterId: userId, status: 'accepted' })
          .orWhere({ addresseeId: userId, status: 'accepted' });
      })
      .orderBy('friends.createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.where('friends.createdAt', '<', cursor);
    }

    // Simplified query - let's use a different approach
    const friendsData = await this.db('friends')
      .where(builder => {
        builder.where({ requesterId: userId, status: 'accepted' })
          .orWhere({ addresseeId: userId, status: 'accepted' });
      })
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      const filteredData = friendsData.filter(friend => 
        new Date(friend.createdAt) < new Date(cursor)
      );
      friendsData.length = 0;
      friendsData.push(...filteredData.slice(0, limit + 1));
    }

    const hasNext = friendsData.length > limit;
    const friends = hasNext ? friendsData.slice(0, -1) : friendsData;

    // Get user details for each friend
    const friendsWithUsers = await Promise.all(
      friends.map(async (friendship) => {
        const friendId = friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId;
        const user = await this.db('users')
          .where({ id: friendId })
          .first();

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
        };
      })
    );

    return {
      data: friendsWithUsers,
      pagination: {
        hasNext,
        nextCursor: hasNext ? friends[friends.length - 1].createdAt.toISOString() : undefined
      }
    };
  }

  async getPendingRequests(userId: number, type: 'sent' | 'received' = 'received'): Promise<UserProfile[]> {
    const field = type === 'sent' ? 'requesterId' : 'addresseeId';
    const joinField = type === 'sent' ? 'addresseeId' : 'requesterId';

    const requests = await this.db('friends')
      .select('users.*')
      .join('users', `friends.${joinField}`, 'users.id')
      .where(`friends.${field}`, userId)
      .andWhere('friends.status', 'pending')
      .orderBy('friends.createdAt', 'desc');

    return requests.map(user => ({
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

  async getFriendsCount(userId: number): Promise<number> {
    const [result] = await this.db('friends')
      .where(builder => {
        builder.where({ requesterId: userId, status: 'accepted' })
          .orWhere({ addresseeId: userId, status: 'accepted' });
      })
      .count('id as count');

    return parseInt(result.count);
  }
}