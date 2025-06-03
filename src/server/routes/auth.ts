```typescript
import { Router } from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  logout, 
  checkAuth,
  updateProfile,
  changePassword 
} from '../controllers/auth';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes existantes...

router.put(
  '/profile',
  authenticate,
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('phone').optional().isMobilePhone('any').withMessage('Numéro de téléphone invalide')
  ],
  validateRequest,
  updateProfile
);

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
    body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
  ],
  validateRequest,
  changePassword
);

export default router;
```