import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, Permission, hasPermission } from '../domain/types';
import { UserRepository } from '../repositories/UserRepository';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
    handle: string;
    email: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user still exists and is active
    const userRepo = new UserRepository();
    const user = await userRepo.findById(decoded.userId);
    
    if (!user || !user.isActive || user.isBanned) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      handle: user.handle,
      email: user.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(error);
  }
};

export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        userRole: req.user.role
      });
    }

    next();
  };
};

export const requireRole = (minRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const roleHierarchy = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    const userLevel = roleHierarchy.indexOf(req.user.role);
    const requiredLevel = roleHierarchy.indexOf(minRole);

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: 'Insufficient role level',
        required: minRole,
        userRole: req.user.role
      });
    }

    next();
  };
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user still exists and is active
    const userRepo = new UserRepository();
    const user = await userRepo.findById(decoded.userId);
    
    if (user && user.isActive && !user.isBanned) {
      req.user = {
        id: user.id,
        role: user.role,
        handle: user.handle,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
};