import { Router } from 'express';
import * as recommendationsController from '../controllers/recommendations.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { updateRecommendationStatusSchema } from '../utils/validators';

const router = Router();

// All routes are protected
router.use(authenticate);

router.get('/', recommendationsController.getRecommendations);
// amazonq-ignore-next-line
router.put(
  '/:id/status',
  validate(updateRecommendationStatusSchema),
  recommendationsController.updateRecommendationStatus
);

export default router;
