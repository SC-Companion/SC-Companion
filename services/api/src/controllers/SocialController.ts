import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { SocialService } from '../services/SocialService';
import { FollowInput, FriendRequestInput, FriendRequestResponseInput, PaginationInput } from '../domain/schemas';

export class SocialController {
  private socialService: SocialService;

  constructor() {
    this.socialService = new SocialService();
  }

  // Follow endpoints
  followUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const followerId = req.user!.id;
    const { targetUserId }: FollowInput = req.body;
    
    const result = await this.socialService.followUser(followerId, targetUserId);
    
    res.json({
      message: 'User followed successfully',
      ...result
    });
  };

  unfollowUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const followerId = req.user!.id;
    const targetUserId = parseInt(req.params.userId);
    
    const result = await this.socialService.unfollowUser(followerId, targetUserId);
    
    res.json({
      message: 'User unfollowed successfully',
      ...result
    });
  };

  getFollowers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const { cursor, limit }: PaginationInput = req.query as any;
    
    const followers = await this.socialService.getFollowers(userId, cursor, limit);
    
    res.json(followers);
  };

  getFollowing = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const { cursor, limit }: PaginationInput = req.query as any;
    
    const following = await this.socialService.getFollowing(userId, cursor, limit);
    
    res.json(following);
  };

  // Friend endpoints
  sendFriendRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const requesterId = req.user!.id;
    const { targetUserId }: FriendRequestInput = req.body;
    
    const result = await this.socialService.sendFriendRequest(requesterId, targetUserId);
    
    res.status(201).json({
      message: 'Friend request sent successfully',
      ...result
    });
  };

  respondToFriendRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const addresseeId = req.user!.id;
    const requestId = parseInt(req.params.requestId);
    const { action }: FriendRequestResponseInput = req.body;
    
    const result = await this.socialService.respondToFriendRequest(requestId, addresseeId, action);
    
    res.json({
      message: `Friend request ${action}ed successfully`,
      ...result
    });
  };

  removeFriend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const friendId = parseInt(req.params.userId);
    
    const result = await this.socialService.removeFriend(userId, friendId);
    
    res.json({
      message: 'Friend removed successfully',
      ...result
    });
  };

  getFriends = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const { cursor, limit }: PaginationInput = req.query as any;
    
    const friends = await this.socialService.getFriends(userId, cursor, limit);
    
    res.json(friends);
  };

  getPendingFriendRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const type = (req.query.type as 'sent' | 'received') || 'received';
    
    const requests = await this.socialService.getPendingFriendRequests(userId, type);
    
    res.json({
      requests
    });
  };

  getSocialStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    
    const stats = await this.socialService.getSocialStats(userId);
    
    res.json(stats);
  };
}