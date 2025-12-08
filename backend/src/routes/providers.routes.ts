import { Router } from 'express';
import * as providersController from '../controllers/providers.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  createConversationSchema,
  sendMessageSchema,
} from '../utils/validators';

const router = Router();

// Protected routes - appointments (must come before /:id to avoid conflicts)
// amazonq-ignore-next-line
router.post(
  '/appointments',
  authenticate,
  validate(createAppointmentSchema),
  providersController.createAppointment
);
// amazonq-ignore-next-line
router.get('/appointments/list', authenticate, providersController.getAppointments);
// amazonq-ignore-next-line
router.put(
  '/appointments/:id',
  authenticate,
  validate(updateAppointmentSchema),
  providersController.updateAppointment
);
// amazonq-ignore-next-line
// amazonq-ignore-next-line
router.post('/appointments/:id/cancel', authenticate, providersController.cancelAppointment);

// Protected routes - messaging (must come before /:id to avoid conflicts)
router.get('/messages/conversations', authenticate, providersController.getConversations);
router.post(
  '/messages/conversations',
  authenticate,
  validate(createConversationSchema),
  providersController.getOrCreateConversation
);
router.get('/messages/:conversationId', authenticate, providersController.getMessages);
router.post(
  '/messages/:conversationId',
  authenticate,
  validate(sendMessageSchema),
  providersController.sendMessage
);
router.patch('/messages/:conversationId/read', authenticate, providersController.markMessagesAsRead);

// Public routes - providers (generic routes last)
router.get('/', providersController.getProviders);
router.get('/:id', providersController.getProviderById);

export default router;
