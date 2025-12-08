import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import FitnessActivity from '../models/Fitness.model';
import FitnessGoal from '../models/FitnessGoal.model';

export const getActivities = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // amazonq-ignore-next-line
    const { type, startDate, endDate, page = '1', limit = '10' } = req.query;

    // amazonq-ignore-next-line
    const query: any = { userId: req.user.id };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        // amazonq-ignore-next-line
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }

    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const activities = await FitnessActivity.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await FitnessActivity.countDocuments(query);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // amazonq-ignore-next-line
    const activity = await FitnessActivity.create({
      // amazonq-ignore-next-line
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    // amazonq-ignore-next-line
    const activity = await FitnessActivity.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!activity) {
      res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const activity = await FitnessActivity.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!activity) {
      res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ============ FITNESS STATS ============

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { period = 'week' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'week':
      default:
        // Start of current week (Sunday)
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    // Aggregate stats from activities
    const stats = await FitnessActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
          totalDistance: { $sum: { $ifNull: ['$distance', 0] } },
          avgIntensity: { $avg: { 
            $switch: {
              branches: [
                { case: { $eq: ['$intensity', 'low'] }, then: 1 },
                { case: { $eq: ['$intensity', 'medium'] }, then: 2 },
                { case: { $eq: ['$intensity', 'high'] }, then: 3 },
              ],
              default: 2,
            }
          }},
        },
      },
    ]);

    // Default stats if no activities found
    const result = stats[0] || {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalDistance: 0,
      avgIntensity: 0,
    };

    // Convert avgIntensity to string
    let averageIntensity = 'medium';
    if (result.avgIntensity <= 1.5) averageIntensity = 'low';
    else if (result.avgIntensity >= 2.5) averageIntensity = 'high';

    res.status(200).json({
      success: true,
      data: {
        totalWorkouts: result.totalWorkouts,
        totalDuration: result.totalDuration,
        totalCalories: result.totalCalories,
        totalDistance: Math.round(result.totalDistance * 10) / 10,
        averageIntensity,
        period,
        startDate,
        endDate: now,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============ FITNESS GOALS ============

export const getGoals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { isCompleted, goalType } = req.query;

    // amazonq-ignore-next-line
    const query: any = { userId: req.user.id };

    if (isCompleted !== undefined) {
      query.isCompleted = isCompleted === 'true';
    }

    if (goalType) {
      query.goalType = goalType;
    }

    const goals = await FitnessGoal.find(query).sort({ endDate: 1 });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const goal = await FitnessGoal.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const goal = await FitnessGoal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!goal) {
      res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const goal = await FitnessGoal.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!goal) {
      res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};