import { Response, NextFunction } from 'express';
import Reminder from '../models/Reminder.model';
import { AuthRequest } from '../types';

/**
 * Get all reminders for the authenticated user
 * GET /api/reminders
 */
export const getReminders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { category, isActive } = req.query;

    // Build query
    const query: any = { userId };
    
    if (category && typeof category === 'string') {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const reminders = await Reminder.find(query).sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: reminders,
      count: reminders.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single reminder by ID
 * GET /api/reminders/:id
 */
export const getReminderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ _id: id, userId });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new reminder
 * POST /api/reminders
 */
export const createReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description, time, frequency, daysOfWeek, dayOfMonth, pushNotification, category } = req.body;

    const reminder = await Reminder.create({
      userId,
      name,
      description,
      time,
      frequency: frequency || 'daily',
      daysOfWeek,
      dayOfMonth,
      pushNotification: pushNotification !== false,
      isActive: true,
      category: category || 'other',
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a reminder
 * PUT /api/reminders/:id
 */
export const updateReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, time, frequency, daysOfWeek, dayOfMonth, pushNotification, isActive, category } = req.body;

    const reminder = await Reminder.findOne({ _id: id, userId });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
      return;
    }

    // Update fields
    if (name !== undefined) reminder.name = name;
    if (description !== undefined) reminder.description = description;
    if (time !== undefined) reminder.time = time;
    if (frequency !== undefined) reminder.frequency = frequency;
    if (daysOfWeek !== undefined) reminder.daysOfWeek = daysOfWeek;
    if (dayOfMonth !== undefined) reminder.dayOfMonth = dayOfMonth;
    if (pushNotification !== undefined) reminder.pushNotification = pushNotification;
    if (isActive !== undefined) reminder.isActive = isActive;
    if (category !== undefined) reminder.category = category;

    await reminder.save();

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle reminder active status
 * PATCH /api/reminders/:id/toggle
 */
export const toggleReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ _id: id, userId });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
      return;
    }

    reminder.isActive = !reminder.isActive;
    await reminder.save();

    res.status(200).json({
      success: true,
      message: `Reminder ${reminder.isActive ? 'activated' : 'deactivated'} successfully`,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a reminder
 * DELETE /api/reminders/:id
 */
export const deleteReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const reminder = await Reminder.findOneAndDelete({ _id: id, userId });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming reminders for today
 * GET /api/reminders/upcoming
 */
export const getUpcomingReminders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0-6 (Sunday-Saturday)

    // Get all active reminders
    const reminders = await Reminder.find({ userId, isActive: true }).sort({ time: 1 });

    // Filter reminders that are upcoming today
    const upcomingReminders = reminders.filter((reminder) => {
      // Skip reminders that already passed today
      if (reminder.time < currentTime) return false;

      // Check frequency
      if (reminder.frequency === 'daily') return true;
      if (reminder.frequency === 'weekly' && reminder.daysOfWeek?.includes(currentDay)) return true;
      if (reminder.frequency === 'monthly' && reminder.dayOfMonth === now.getDate()) return true;
      if (reminder.frequency === 'once') return true;

      return false;
    });

    res.status(200).json({
      success: true,
      data: upcomingReminders,
      count: upcomingReminders.length,
    });
  } catch (error) {
    next(error);
  }
};
