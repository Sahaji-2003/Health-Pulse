import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { updateProfileSchema } from '../utils/validators';

const router = Router();

// Configure multer for avatar uploads
const uploadsDir = path.join(__dirname, '../../uploads/avatars');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// All routes are protected
router.use(authenticate);

router.get('/profile', userController.getProfile);
// amazonq-ignore-next-line
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
// amazonq-ignore-next-line
router.delete('/profile', userController.deleteProfile);

// Avatar routes
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// Dashboard Layout routes
router.get('/dashboard-layout', userController.getDashboardLayout);
router.put('/dashboard-layout', userController.updateDashboardLayout);
router.post('/dashboard-layout/reset', userController.resetDashboardLayout);

// Profile PDF download route
router.get('/profile/download-pdf', userController.downloadProfilePdf);

export default router;
