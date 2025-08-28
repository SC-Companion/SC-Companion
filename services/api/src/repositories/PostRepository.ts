import { Knex } from 'knex';
import db from '../db/knex';
import { Post, PostWithUser, PaginatedResponse, calculateLevel } from '../domain/types';
import { CreatePostInput, UpdatePostInput } from '../domain/schemas';

export class PostRepository {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async create(userId: number, postData: CreatePostInput): Promise<Post> {
    const [post] = await this.db('posts')
      .insert({
        userId,
        content: postData.content,
        mediaUrls: postData.mediaUrls ? JSON.stringify(postData.mediaUrls) : null,
      })
      .returning('*');

    return {
      ...post,
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined
    };
  }

  async findById(id: number): Promise<Post | null> {
    const post = await this.db('posts')
      .where({ id })
      .first();

    if (!post) return null;

    return {
      ...post,
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined
    };
  }

  async findWithUser(id: number, requestingUserId?: number): Promise<PostWithUser | null> {
    const query = this.db('posts')
      .select(
        'posts.*',
        'users.id as user_id',
        'users.handle as user_handle',
        'users.displayName as user_displayName',
        'users.avatar as user_avatar',
        'users.role as user_role',
        'users.isPremium as user_isPremium',
        'users.rsi_handle as user_rsi_handle',
        'users.xp as user_xp'
      )
      .join('users', 'posts.userId', 'users.id')
      .where('posts.id', id)
      .andWhere('posts.isModerated', false)
      .first();

    const result = await query;
    if (!result) return null;

    let isLiked = false;
    if (requestingUserId) {
      const like = await this.db('likes')
        .where({ userId: requestingUserId, postId: id })
        .first();
      isLiked = !!like;
    }

    return {
      id: result.id,
      userId: result.userId,
      content: result.content,
      mediaUrls: result.mediaUrls ? JSON.parse(result.mediaUrls) : undefined,
      likesCount: result.likesCount,
      isModerated: result.isModerated,
      moderatedAt: result.moderatedAt,
      moderatedBy: result.moderatedBy,
      moderationReason: result.moderationReason,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      isLiked,
      user: {
        id: result.user_id,
        handle: result.user_handle,
        displayName: result.user_displayName,
        avatar: result.user_avatar,
        xp: result.user_xp,
        level: calculateLevel(result.user_xp),
        isPremium: result.user_isPremium,
        role: result.user_role,
        rsi_handle: result.user_rsi_handle
      }
    };
  }

  async getFeed(requestingUserId?: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<PostWithUser>> {
    let query = this.db('posts')
      .select(
        'posts.*',
        'users.id as user_id',
        'users.handle as user_handle',
        'users.displayName as user_displayName',
        'users.avatar as user_avatar',
        'users.role as user_role',
        'users.isPremium as user_isPremium',
        'users.rsi_handle as user_rsi_handle',
        'users.xp as user_xp'
      )
      .join('users', 'posts.userId', 'users.id')
      .where('posts.isModerated', false)
      .andWhere('users.isActive', true)
      .andWhere('users.isBanned', false)
      .orderBy('posts.createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.where('posts.createdAt', '<', cursor);
    }

    const results = await query;
    const hasNext = results.length > limit;
    const posts = hasNext ? results.slice(0, -1) : results;

    // Get like status for each post if user is authenticated
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;
        if (requestingUserId) {
          const like = await this.db('likes')
            .where({ userId: requestingUserId, postId: post.id })
            .first();
          isLiked = !!like;
        }

        return {
          id: post.id,
          userId: post.userId,
          content: post.content,
          mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined,
          likesCount: post.likesCount,
          isModerated: post.isModerated,
          moderatedAt: post.moderatedAt,
          moderatedBy: post.moderatedBy,
          moderationReason: post.moderationReason,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          isLiked,
          user: {
            id: post.user_id,
            handle: post.user_handle,
            displayName: post.user_displayName,
            avatar: post.user_avatar,
            xp: post.user_xp,
            level: calculateLevel(post.user_xp),
            isPremium: post.user_isPremium,
            role: post.user_role,
            rsi_handle: post.user_rsi_handle
          }
        };
      })
    );

    return {
      data: postsWithLikes,
      pagination: {
        hasNext,
        nextCursor: hasNext ? posts[posts.length - 1].createdAt.toISOString() : undefined
      }
    };
  }

  async getUserPosts(userId: number, requestingUserId?: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<PostWithUser>> {
    let query = this.db('posts')
      .select(
        'posts.*',
        'users.id as user_id',
        'users.handle as user_handle',
        'users.displayName as user_displayName',
        'users.avatar as user_avatar',
        'users.role as user_role',
        'users.isPremium as user_isPremium',
        'users.rsi_handle as user_rsi_handle',
        'users.xp as user_xp'
      )
      .join('users', 'posts.userId', 'users.id')
      .where('posts.userId', userId)
      .andWhere('posts.isModerated', false)
      .orderBy('posts.createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.where('posts.createdAt', '<', cursor);
    }

    const results = await query;
    const hasNext = results.length > limit;
    const posts = hasNext ? results.slice(0, -1) : results;

    // Get like status for each post if user is authenticated
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        let isLiked = false;
        if (requestingUserId) {
          const like = await this.db('likes')
            .where({ userId: requestingUserId, postId: post.id })
            .first();
          isLiked = !!like;
        }

        return {
          id: post.id,
          userId: post.userId,
          content: post.content,
          mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined,
          likesCount: post.likesCount,
          isModerated: post.isModerated,
          moderatedAt: post.moderatedAt,
          moderatedBy: post.moderatedBy,
          moderationReason: post.moderationReason,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          isLiked,
          user: {
            id: post.user_id,
            handle: post.user_handle,
            displayName: post.user_displayName,
            avatar: post.user_avatar,
            xp: post.user_xp,
            level: calculateLevel(post.user_xp),
            isPremium: post.user_isPremium,
            role: post.user_role,
            rsi_handle: post.user_rsi_handle
          }
        };
      })
    );

    return {
      data: postsWithLikes,
      pagination: {
        hasNext,
        nextCursor: hasNext ? posts[posts.length - 1].createdAt.toISOString() : undefined
      }
    };
  }

  async update(id: number, postData: UpdatePostInput): Promise<Post | null> {
    await this.db('posts')
      .where({ id })
      .update({
        ...postData,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.db('posts')
      .where({ id })
      .del();

    return deleted > 0;
  }

  async moderate(id: number, reason: string, moderatedBy: number): Promise<Post | null> {
    await this.db('posts')
      .where({ id })
      .update({
        isModerated: true,
        moderatedAt: this.db.fn.now(),
        moderatedBy,
        moderationReason: reason,
        updated_at: this.db.fn.now()
      });

    return this.findById(id);
  }

  async incrementLikesCount(id: number): Promise<void> {
    await this.db('posts')
      .where({ id })
      .increment('likesCount', 1);
  }

  async decrementLikesCount(id: number): Promise<void> {
    await this.db('posts')
      .where({ id })
      .decrement('likesCount', 1);
  }
}