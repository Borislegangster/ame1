import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('phone').optional().isMobilePhone('any').withMessage('Numéro de téléphone invalide')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis')
  ],
  validateRequest,
  login
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Email invalide')
  ],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token requis'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
  ],
  validateRequest,
  resetPassword
);

router.get('/verify-email/:token', verifyEmail);

export default router;