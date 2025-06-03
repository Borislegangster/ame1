```typescript
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser
} from '../controllers/users';

const router = Router();

// Routes protégées pour les administrateurs uniquement
router.get('/', authenticate, authorize('admin'), getUsers);
router.put('/:id/status', authenticate, authorize('admin'), updateUserStatus);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
```