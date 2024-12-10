import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/refresh-token', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));

export default router;