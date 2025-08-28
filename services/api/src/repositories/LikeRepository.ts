import { Knex } from 'knex';
import db from '../db/knex';
import { Like } from '../domain/types';

export class LikeRepository {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async likePost(userId: number, postId: number): Promise<Like> {
    // Check if already liked
    const existing = await this.db('likes')
      .where({ userId, postId })
      .first();

    if (existing) {
      throw new Error('Post already liked');
    }

    // Check if post exists
    const post = await this.db('posts')
      .where({ id: postId })
      .first();

    if (!post) {
      throw new Error('Post not found');
    }

    const [like] = await this.db('likes')
      .insert({ userId, postId })
      .returning('*');

    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const deleted = await this.db('likes')
      .where({ userId, postId })
      .del();

    return deleted > 0;
  }

  async isLiked(userId: number, postId: number): Promise<boolean> {
    const like = await this.db('likes')
      .where({ userId, postId })
      .first();

    return !!like;
  }

  async getPostLikesCount(postId: number): Promise<number> {
    const [result] = await this.db('likes')
      .where({ postId })
      .count('id as count');

    return parseInt(result.count);
  }

  async getUserLikes(userId: number, limit: number = 50): Promise<Like[]> {
    return this.db('likes')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .limit(limit);
  }
}