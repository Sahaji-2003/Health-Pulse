import { Router } from 'express';
import {
  getReminders,
  getReminderById,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
  getUpcomingReminders,
} from '../controllers/reminders.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createReminderSchema, updateReminderSchema } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/reminders - Get all reminders for user
router.get('/', getReminders);

// GET /api/reminders/upcoming - Get upcoming reminders for today
router.get('/upcoming', getUpcomingReminders);

// GET /api/reminders/:id - Get single reminder by ID
router.get('/:id', getReminderById);

// POST /api/reminders - Create new reminder
router.post('/', validate(createReminderSchema), createReminder);

// PUT /api/reminders/:id - Update reminder
router.put('/:id', validate(updateReminderSchema), updateReminder);

// PATCH /api/reminders/:id/toggle - Toggle reminder active status
router.patch('/:id/toggle', toggleReminder);

// DELETE /api/reminders/:id - Delete reminder
router.delete('/:id', deleteReminder);

export default router;
