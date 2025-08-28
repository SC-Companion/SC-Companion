import { PostRepository } from '../repositories/PostRepository';
import { LikeRepository } from '../repositories/LikeRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CreatePostInput, UpdatePostInput, ModeratePostInput } from '../domain/schemas';
import { Post, PostWithUser, PaginatedResponse, XP_LEVELS, canModerateUser } from '../domain/types';
import { createError } from '../middlewares/errorHandler';

export class PostService {
  private postRepo: PostRepository;
  private likeRepo: LikeRepository;
  private userRepo: UserRepository;

  constructor() {
    this.postRepo = new PostRepository();
    this.likeRepo = new LikeRepository();
    this.userRepo = new UserRepository();
  }

  async createPost(userId: number, postData: CreatePostInput): Promise<Post> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    if (!user.isActive || user.isBanned) {
      throw createError('Account is not active', 403);
    }

    const post = await this.postRepo.create(userId, postData);

    // Award XP for creating post
    await this.userRepo.updateXP(userId, XP_LEVELS.POST_CREATED);

    return post;
  }

  async getPost(postId: number, requestingUserId?: number): Promise<PostWithUser> {
    const post = await this.postRepo.findWithUser(postId, requestingUserId);
    if (!post) {
      throw createError('Post not found', 404);
    }

    return post;
  }

  async updatePost(postId: number, userId: number, updateData: UpdatePostInput): Promise<Post> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw createError('Post not found', 404);
    }

    if (post.userId !== userId) {
      throw createError('You can only edit your own posts', 403);
    }

    const updatedPost = await this.postRepo.update(postId, updateData);
    if (!updatedPost) {
      throw createError('Failed to update post', 500);
    }

    return updatedPost;
  }

  async deletePost(postId: number, userId: number): Promise<boolean> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw createError('Post not found', 404);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Users can delete their own posts, moderators can delete any post
    const canDelete = post.userId === userId || 
                     user.role === 'moderator' || 
                     user.role === 'admin' || 
                     user.role === 'super_admin';

    if (!canDelete) {
      throw createError('You can only delete your own posts', 403);
    }

    return this.postRepo.delete(postId);
  }

  async getFeed(requestingUserId?: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<PostWithUser>> {
    return this.postRepo.getFeed(requestingUserId, cursor, limit);
  }

  async getUserPosts(userId: number, requestingUserId?: number, cursor?: string, limit: number = 20): Promise<PaginatedResponse<PostWithUser>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return this.postRepo.getUserPosts(userId, requestingUserId, cursor, limit);
  }

  async likePost(userId: number, postId: number): Promise<{ success: boolean; likesCount: number }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    if (!user.isActive || user.isBanned) {
      throw createError('Account is not active', 403);
    }

    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw createError('Post not found', 404);
    }

    try {
      await this.likeRepo.likePost(userId, postId);
      await this.postRepo.incrementLikesCount(postId);

      // Award XP to post author for receiving a like
      if (post.userId !== userId) { // Don't award XP for liking your own post
        await this.userRepo.updateXP(post.userId, XP_LEVELS.LIKE_RECEIVED);
      }

      const updatedPost = await this.postRepo.findById(postId);
      return {
        success: true,
        likesCount: updatedPost?.likesCount || 0
      };
    } catch (error: any) {
      if (error.message === 'Post already liked') {
        throw createError('Post already liked', 409);
      }
      throw error;
    }
  }

  async unlikePost(userId: number, postId: number): Promise<{ success: boolean; likesCount: number }> {
    const success = await this.likeRepo.unlikePost(userId, postId);
    if (!success) {
      throw createError('Post not liked or not found', 404);
    }

    await this.postRepo.decrementLikesCount(postId);

    const post = await this.postRepo.findById(postId);
    return {
      success: true,
      likesCount: post?.likesCount || 0
    };
  }

  async moderatePost(
    moderatorId: number,
    postId: number,
    moderationData: ModeratePostInput
  ): Promise<Post> {
    const moderator = await this.userRepo.findById(moderatorId);
    const post = await this.postRepo.findById(postId);

    if (!moderator || !post) {
      throw createError('User or post not found', 404);
    }

    const postAuthor = await this.userRepo.findById(post.userId);
    if (!postAuthor) {
      throw createError('Post author not found', 404);
    }

    // Check if moderator can moderate this post
    if (!canModerateUser(moderator.role, postAuthor.role)) {
      throw createError('Insufficient permissions to moderate this post', 403);
    }

    if (post.isModerated) {
      throw createError('Post is already moderated', 400);
    }

    const moderatedPost = await this.postRepo.moderate(
      postId,
      moderationData.reason,
      moderatorId
    );

    if (!moderatedPost) {
      throw createError('Failed to moderate post', 500);
    }

    return moderatedPost;
  }

  async getPostLikes(postId: number): Promise<number> {
    return this.likeRepo.getPostLikesCount(postId);
  }
}