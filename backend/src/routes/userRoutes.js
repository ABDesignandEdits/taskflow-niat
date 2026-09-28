import { Router } from 'express';
import { updateProfile, seedDemoData } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.put('/profile', updateProfile);
router.post('/seed-demo', seedDemoData);

export default router;
