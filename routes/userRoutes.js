import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Get Current User
router.get('/me', authMiddleware, getMe);

// Logout User
router.post('/logout', authMiddleware, logout);

export default router;
