import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate } from '../middlewares/auth';
import { validateParams } from '../middlewares/validate';
import { z } from 'zod';

const router = Router();
const postController = new PostController();

// All like routes require authentication
router.use(authenticate);

// Like/Unlike posts (alternative routes - main ones are in postRoutes)
router.post('/post/:postId',
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.likePost
);

router.delete('/post/:postId',
  validateParams(z.object({ postId: z.string().transform(val => parseInt(val)) })),
  postController.unlikePost
);

export default router;