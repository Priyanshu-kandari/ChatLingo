import express from 'express';
import { SignUp, LogIn, LogOut, onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public auth routes.
router.post('/signUp', SignUp);
router.post('/LogIn', LogIn);

// Protected auth routes.
router.post('/LogOut', protectRoute, LogOut);
router.post('/onboarding', protectRoute, onboard);

router.get('/me', protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
