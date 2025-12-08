import { Router } from 'express';
import * as fitnessController from '../controllers/fitness.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  createFitnessActivitySchema,
  updateFitnessActivitySchema,
  createFitnessGoalSchema,
  updateFitnessGoalSchema,
} from '../utils/validators';

const router = Router();

// All routes are protected
router.use(authenticate);

// ============ ACTIVITY ROUTES ============
router.get('/activities', fitnessController.getActivities);
// amazonq-ignore-next-line
router.post(
  '/activities',
  validate(createFitnessActivitySchema),
  fitnessController.createActivity
);
// amazonq-ignore-next-line
router.put(
  '/activities/:id',
  validate(updateFitnessActivitySchema),
  fitnessController.updateActivity
);
// amazonq-ignore-next-line
router.delete('/activities/:id', fitnessController.deleteActivity);

// ============ STATS ROUTES ============
router.get('/stats', fitnessController.getStats);

// ============ GOAL ROUTES ============
router.get('/goals', fitnessController.getGoals);
router.post('/goals', validate(createFitnessGoalSchema), fitnessController.createGoal);
router.put('/goals/:id', validate(updateFitnessGoalSchema), fitnessController.updateGoal);
router.delete('/goals/:id', fitnessController.deleteGoal);

export default router;
