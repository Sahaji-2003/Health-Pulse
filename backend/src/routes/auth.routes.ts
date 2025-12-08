import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../utils/validators';

const router = Router();

// Public routes
// amazonq-ignore-next-line
router.post('/register', validate(registerSchema), authController.register);
// amazonq-ignore-next-line
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
// amazonq-ignore-next-line
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
