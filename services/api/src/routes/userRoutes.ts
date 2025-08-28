import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { authenticate, requireRole, requirePermission } from '../middlewares/auth';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate';
import {
  CreateUserSchema,
  LoginSchema,
  LinkRSIAccountSchema,
  UpdateUserSchema,
  UpdateUserRoleSchema,
  BanUserSchema,
  PaginationSchema
} from '../domain/schemas';
import { UserRole, Permission } from '../domain/types';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();
const userController = new UserController();

// Auth routes
router.post('/register', validateBody(CreateUserSchema), authController.register);
router.post('/login', validateBody(LoginSchema), authController.login);
router.post('/link-rsi', authenticate, validateBody(LinkRSIAccountSchema), authController.linkRSIAccount);
router.put('/rsi-geid', authenticate, validateBody(z.object({ rsi_geid: z.string() })), authController.updateRSIGEID);
router.post('/refresh-token', authenticate, authController.refreshToken);
router.get('/me', authenticate, authController.me);

// User profile routes
router.get('/:userId', 
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  userController.getProfile
);

router.put('/profile', 
  authenticate, 
  validateBody(UpdateUserSchema), 
  userController.updateProfile
);

router.get('/search', 
  validateQuery(z.object({ 
    q: z.string().min(1), 
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20)
  })), 
  userController.searchUsers
);

router.get('/leaderboard', 
  validateQuery(z.object({ 
    limit: z.string().optional().transform(val => val ? parseInt(val) : 50)
  })), 
  userController.getLeaderboard
);

router.delete('/deactivate', authenticate, userController.deactivateAccount);

// Admin routes
router.put('/:userId/role',
  authenticate,
  requirePermission(Permission.MANAGE_USERS),
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateBody(UpdateUserRoleSchema),
  userController.updateUserRole
);

router.post('/:userId/ban',
  authenticate,
  requirePermission(Permission.BAN_USERS),
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateBody(BanUserSchema),
  userController.banUser
);

router.delete('/:userId/ban',
  authenticate,
  requirePermission(Permission.BAN_USERS),
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  userController.unbanUser
);

router.post('/:userId/award-xp',
  authenticate,
  requireRole(UserRole.ADMIN),
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateBody(z.object({ 
    amount: z.number().positive(), 
    reason: z.string().optional() 
  })),
  userController.awardXP
);

export default router;