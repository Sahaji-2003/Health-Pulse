import { Router } from 'express';
import * as vitalsController from '../controllers/vitals.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  createVitalSignsSchema,
  updateVitalSignsSchema,
} from '../utils/validators';

const router = Router();

// All routes are protected
router.use(authenticate);

router.get('/', vitalsController.getVitalSigns);
router.get('/stats', vitalsController.getVitalsStats);
router.get('/history', vitalsController.getVitalsHistory);
// amazonq-ignore-next-line
router.post('/', validate(createVitalSignsSchema), vitalsController.createVitalSigns);
// amazonq-ignore-next-line
router.put('/:id', validate(updateVitalSignsSchema), vitalsController.updateVitalSigns);
// amazonq-ignore-next-line
router.delete('/:id', vitalsController.deleteVitalSigns);

export default router;
