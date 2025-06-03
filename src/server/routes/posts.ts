import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controllers/posts';

const router = Router();

router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPost);

router.post(
  '/',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('excerpt').notEmpty().withMessage('L\'extrait est requis'),
    body('content').notEmpty().withMessage('Le contenu est requis'),
    body('image').optional().isURL().withMessage('L\'URL de l\'image est invalide'),
    body('published').isBoolean()
  ],
  validateRequest,
  createPost
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('excerpt').notEmpty().withMessage('L\'extrait est requis'),
    body('content').notEmpty().withMessage('Le contenu est requis'),
    body('image').optional().isURL().withMessage('L\'URL de l\'image est invalide'),
    body('published').isBoolean()
  ],
  validateRequest,
  updatePost
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  deletePost
);

export default router;