import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
} from '../controllers/user.controller.js';

const router = express.Router();

// All user routes require authentication.
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);
router.get('/friend-request/', getFriendRequests);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);

export default router;
