import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate, optionalAuth, requirePermission } from '../middlewares/auth';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate';
import { 
  CreatePostSchema, 
  UpdatePostSchema, 
  ModeratePostSchema,
  PaginationSchema 
} from '../domain/schemas';
import { Permission } from '../domain/types';
import { z } from 'zod';

const router = Router();
const postController = new PostController();

// Public routes (with optional auth for like status)
router.get('/feed', 
  optionalAuth,
  validateQuery(PaginationSchema), 
  postController.getFeed
);

router.get('/:postId', 
  optionalAuth,
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.getPost
);

router.get('/user/:userId',
  optionalAuth,
  validateParams(z.object({ userId: z.string().transform(val => parseInt(val)) })),
  validateQuery(PaginationSchema),
  postController.getUserPosts
);

// Authenticated routes
router.post('/', 
  authenticate, 
  validateBody(CreatePostSchema), 
  postController.createPost
);

router.put('/:postId',
  authenticate,
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  validateBody(UpdatePostSchema),
  postController.updatePost
);

router.delete('/:postId',
  authenticate,
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.deletePost
);

router.post('/:postId/like',
  authenticate,
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.likePost
);

router.delete('/:postId/like',
  authenticate,
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.unlikePost
);

// Moderation routes
router.post('/:postId/moderate',
  authenticate,
  requirePermission(Permission.MODERATE_POSTS),
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  validateBody(ModeratePostSchema),
  postController.moderatePost
);

export default router;