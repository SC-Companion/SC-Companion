import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AuthService } from '../services/AuthService';
import { CreateUserInput, LoginInput, LinkRSIAccountInput } from '../domain/schemas';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userData: CreateUserInput = req.body;
    
    const result = await this.authService.register(userData);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        handle: result.user.handle,
        displayName: result.user.displayName,
        email: result.user.email,
        bio: result.user.bio,
        location: result.user.location,
        avatar: result.user.avatar,
        rsi_handle: result.user.rsi_handle,
        role: result.user.role,
        xp: result.user.xp,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt
      },
      token: result.token
    });
  };

  login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const loginData: LoginInput = req.body;
    
    const result = await this.authService.login(loginData);
    
    res.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        handle: result.user.handle,
        displayName: result.user.displayName,
        email: result.user.email,
        bio: result.user.bio,
        location: result.user.location,
        avatar: result.user.avatar,
        rsi_handle: result.user.rsi_handle,
        role: result.user.role,
        xp: result.user.xp,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt
      },
      token: result.token
    });
  };

  linkRSIAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { rsi_handle }: LinkRSIAccountInput = req.body;
    
    const user = await this.authService.linkRSIAccount(userId, rsi_handle);
    
    res.json({
      message: 'RSI account linked successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
        rsi_handle: user.rsi_handle,
        role: user.role,
        xp: user.xp,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      }
    });
  };

  updateRSIGEID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { rsi_geid } = req.body;
    
    const user = await this.authService.updateRSIGEID(userId, rsi_geid);
    
    res.json({
      message: 'RSI GEID updated successfully',
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        rsi_handle: user.rsi_handle,
        rsi_geid: user.rsi_geid,
        role: user.role,
        xp: user.xp,
        createdAt: user.createdAt
      }
    });
  };

  refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    const token = await this.authService.refreshToken(userId);
    
    res.json({
      message: 'Token refreshed successfully',
      token
    });
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    // Get fresh user data
    const authService = new AuthService();
    // For now, we'll use UserRepository directly
    const { UserRepository } = await import('../repositories/UserRepository');
    const userRepo = new UserRepository();
    const user = await userRepo.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
        rsi_handle: user.rsi_handle,
        role: user.role,
        xp: user.xp,
        isPremium: user.isPremium,
        isActive: user.isActive,
        isBanned: user.isBanned,
        createdAt: user.createdAt
      }
    });
  };
}