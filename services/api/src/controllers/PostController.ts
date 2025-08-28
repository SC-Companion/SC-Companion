import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { PostService } from '../services/PostService';
import { CreatePostInput, UpdatePostInput, ModeratePostInput, PaginationInput } from '../domain/schemas';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const postData: CreatePostInput = req.body;
    
    const post = await this.postService.createPost(userId, postData);
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  };

  getPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const requestingUserId = req.user?.id;
    
    const post = await this.postService.getPost(postId, requestingUserId);
    
    res.json({ post });
  };

  updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    const updateData: UpdatePostInput = req.body;
    
    const post = await this.postService.updatePost(postId, userId, updateData);
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  };

  deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const success = await this.postService.deletePost(postId, userId);
    
    res.json({
      message: 'Post deleted successfully',
      success
    });
  };

  getFeed = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const requestingUserId = req.user?.id;
    const { cursor, limit }: PaginationInput = req.query as any;
    
    const feed = await this.postService.getFeed(requestingUserId, cursor, limit);
    
    res.json(feed);
  };

  getUserPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const requestingUserId = req.user?.id;
    const { cursor, limit }: PaginationInput = req.query as any;
    
    const posts = await this.postService.getUserPosts(userId, requestingUserId, cursor, limit);
    
    res.json(posts);
  };

  likePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const result = await this.postService.likePost(userId, postId);
    
    res.json({
      message: 'Post liked successfully',
      ...result
    });
  };

  unlikePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const result = await this.postService.unlikePost(userId, postId);
    
    res.json({
      message: 'Post unliked successfully',
      ...result
    });
  };

  moderatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const moderatorId = req.user!.id;
    const moderationData: ModeratePostInput = req.body;
    
    const post = await this.postService.moderatePost(moderatorId, postId, moderationData);
    
    res.json({
      message: 'Post moderated successfully',
      post
    });
  };
}