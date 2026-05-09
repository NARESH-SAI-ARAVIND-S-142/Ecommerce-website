import { Router } from 'express';
import { getUsers, deleteUser, updateUserRole, getAdminStats } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Protect all routes
router.use(protect);
router.use(adminOnly);

router.route('/').get(getUsers);
router.route('/stats').get(getAdminStats);
router.route('/:id').delete(deleteUser);
router.route('/:id/role').put(updateUserRole);

export default router;
