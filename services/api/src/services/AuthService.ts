import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserInput, LoginInput } from '../domain/schemas';
import { User, XP_LEVELS } from '../domain/types';
import { createError } from '../middlewares/errorHandler';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(userData: CreateUserInput): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingEmail = await this.userRepo.findByEmail(userData.email);
    if (existingEmail) {
      throw createError('Email already registered', 409);
    }

    const existingHandle = await this.userRepo.findByHandle(userData.handle);
    if (existingHandle) {
      throw createError('Handle already taken', 409);
    }

    if (userData.rsi_handle) {
      const existingRSI = await this.userRepo.findByRSIHandle(userData.rsi_handle);
      if (existingRSI) {
        throw createError('RSI handle already linked to another account', 409);
      }
    }

    // Create user
    const user = await this.userRepo.create(userData);

    // Award registration XP
    await this.userRepo.updateXP(user.id, 50); // Welcome bonus
    const updatedUser = await this.userRepo.findById(user.id);

    // Generate token
    const token = this.generateToken(updatedUser!);

    return {
      user: updatedUser!,
      token
    };
  }

  async login(loginData: LoginInput): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findByEmail(loginData.email);
    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw createError('Account is deactivated', 401);
    }

    if (user.isBanned) {
      throw createError('Account is banned', 401);
    }

    const isValidPassword = await this.userRepo.validatePassword(user, loginData.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    const token = this.generateToken(user);

    return {
      user,
      token
    };
  }

  async linkRSIAccount(userId: number, rsi_handle: string): Promise<User> {
    // Check if RSI handle is already linked
    const existingRSI = await this.userRepo.findByRSIHandle(rsi_handle);
    if (existingRSI && existingRSI.id !== userId) {
      throw createError('RSI handle already linked to another account', 409);
    }

    const updatedUser = await this.userRepo.update(userId, { rsi_handle });
    if (!updatedUser) {
      throw createError('User not found', 404);
    }

    // Award XP for linking RSI account
    await this.userRepo.updateXP(userId, 25);

    return this.userRepo.findById(userId)!;
  }

  async updateRSIGEID(userId: number, rsi_geid: string): Promise<User> {
    const updatedUser = await this.userRepo.updateRSIData(userId, rsi_geid);
    if (!updatedUser) {
      throw createError('User not found', 404);
    }

    return updatedUser;
  }

  private generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload = {
      userId: user.id,
      role: user.role,
      handle: user.handle,
      email: user.email
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  async refreshToken(userId: number): Promise<string> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.isActive || user.isBanned) {
      throw createError('Invalid user', 401);
    }

    return this.generateToken(user);
  }
}