import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User profile validators
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  // amazonq-ignore-next-line
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string(),
    })
    .optional(),
});

// Fitness activity validators
export const createFitnessActivitySchema = z.object({
  type: z.enum(['running', 'cycling', 'gym', 'swimming', 'walking', 'yoga', 'other']),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  distance: z.number().positive().optional(),
  caloriesBurned: z.number().positive().optional(),
  intensity: z.enum(['low', 'medium', 'high']),
  notes: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
  goals: z
    .object({
      targetDuration: z.number().positive().optional(),
      targetDistance: z.number().positive().optional(),
      targetCalories: z.number().positive().optional(),
    })
    .optional(),
});

export const updateFitnessActivitySchema = createFitnessActivitySchema.partial();

// Fitness goal validators
export const createFitnessGoalSchema = z.object({
  goalType: z.enum(['steps', 'calories', 'distance', 'workouts', 'duration', 'weight']),
  targetValue: z.number().positive('Target value must be positive'),
  currentValue: z.number().min(0).optional().default(0),
  unit: z.string().min(1, 'Unit is required'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
});

export const updateFitnessGoalSchema = z.object({
  goalType: z.enum(['steps', 'calories', 'distance', 'workouts', 'duration', 'weight']).optional(),
  targetValue: z.number().positive().optional(),
  currentValue: z.number().min(0).optional(),
  unit: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

// Vital signs validators
export const createVitalSignsSchema = z.object({
  bloodPressureSystolic: z.number().min(0).max(300).optional(),
  bloodPressureDiastolic: z.number().min(0).max(200).optional(),
  heartRate: z.number().min(0).max(300).optional(),
  weight: z.number().min(0).max(500).optional(),
  temperature: z.number().min(30).max(45).optional(),
  bloodSugar: z.number().min(0).max(600).optional(),
  oxygenSaturation: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
});

export const updateVitalSignsSchema = createVitalSignsSchema;

// Recommendation validators
export const updateRecommendationStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed', 'dismissed']),
  progress: z.number().min(0).max(100).optional(),
});

// Resource validators
export const createResourceRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().max(500).optional(),
});

// Appointment validators
export const createAppointmentSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
  dateTime: z.string().datetime('Invalid date and time'),
  type: z.enum(['in-person', 'video', 'chat']),
  notes: z.string().max(1000).optional(),
});

export const updateAppointmentSchema = z.object({
  dateTime: z.string().datetime().optional(),
  type: z.enum(['in-person', 'video', 'chat']).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional(),
  notes: z.string().max(1000).optional(),
  cancelReason: z.string().max(500).optional(),
});

// Message validators
export const createConversationSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(5000, 'Message cannot exceed 5000 characters'),
  type: z.enum(['text', 'image', 'link']).optional().default('text'),
  imageUrl: z.string().url().optional(),
  linkTitle: z.string().max(200).optional(),
  linkDescription: z.string().max(500).optional(),
});

// Reminder validators
export const createReminderSchema = z.object({
  name: z.string().min(1, 'Reminder name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24h format)'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'once']).optional().default('daily'),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  pushNotification: z.boolean().optional().default(true),
  category: z.enum(['medication', 'appointment', 'vitals', 'exercise', 'water', 'other']).optional().default('other'),
});

export const updateReminderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24h format)').optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'once']).optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  pushNotification: z.boolean().optional(),
  isActive: z.boolean().optional(),
  category: z.enum(['medication', 'appointment', 'vitals', 'exercise', 'water', 'other']).optional(),
});

// Query validators
export const paginationSchema = z.object({
  // amazonq-ignore-next-line
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
