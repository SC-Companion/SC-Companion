import { Router } from 'express';
import { SocialController } from '../controllers/SocialController';
import { authenticate } from '../middlewares/auth';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate';
import { FriendRequestSchema, FriendRequestResponseSchema, PaginationSchema } from '../domain/schemas';
import { z } from 'zod';

const router = Router();
const socialController = new SocialController();

// All friend routes require authentication
router.use(authenticate);

// Friend requests
router.post('/request', 
  validateBody(FriendRequestSchema), 
  socialController.sendFriendRequest
);

router.put('/request/:requestId',
  validateParams(z.object({ requestId: z.string().transform(val => parseInt(val)) })),
  validateBody(FriendRequestResponseSchema),
  socialController.respondToFriendRequest
);

router.get('/requests',
  validateQuery(z.object({ type: z.enum(['sent', 'received']).optional() })),
  socialController.getPendingFriendRequests
);

// Friend management
router.delete('/:userId',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  socialController.removeFriend
);

router.get('/:userId/friends',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateQuery(PaginationSchema),
  socialController.getFriends
);

// Social stats
router.get('/:userId/stats',
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  socialController.getSocialStats
);

export default router;