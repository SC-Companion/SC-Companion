import { Router } from 'express';
import { SocialController } from '../controllers/SocialController';
import { authenticate } from '../middlewares/auth';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate';
import { FollowSchema, PaginationSchema } from '../domain/schemas';
import { z } from 'zod';

const router = Router();
const socialController = new SocialController();

// All follow routes require authentication
router.use(authenticate);

// Follow/Unfollow
router.post('/', 
  validateBody(FollowSchema), 
  socialController.followUser
);

router.delete('/:userId',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  socialController.unfollowUser
);

// Get followers/following lists
router.get('/:userId/followers',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateQuery(PaginationSchema),
  socialController.getFollowers
);

router.get('/:userId/following',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateQuery(PaginationSchema),
  socialController.getFollowing
);

export default router;