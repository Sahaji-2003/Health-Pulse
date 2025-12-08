import { Router } from 'express';
import * as resourcesController from '../controllers/resources.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createResourceRatingSchema } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', resourcesController.getResources);
router.get('/:id', resourcesController.getResourceById);

// Protected routes
// amazonq-ignore-next-line
// amazonq-ignore-next-line
router.post('/:id/save', authenticate, resourcesController.saveResource);
// amazonq-ignore-next-line
router.get('/saved/list', authenticate, resourcesController.getSavedResources);
// amazonq-ignore-next-line
router.post(
  '/:id/rate',
  authenticate,
  validate(createResourceRatingSchema),
  resourcesController.rateResource
);

export default router;
