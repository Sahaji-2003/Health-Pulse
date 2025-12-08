import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as recommendationService from '../services/recommendation.service';

export const getRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { category, status, priority } = req.query;

    const recommendations = await recommendationService.getRecommendations(
      req.user.id,
      {
        // amazonq-ignore-next-line
        category: category as string,
        status: status as string,
        priority: priority as string,
      }
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecommendationStatus = async (
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

    const recommendation = await recommendationService.updateRecommendationStatus(
      req.user.id,
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Recommendation status updated successfully',
      data: recommendation,
    });
  // amazonq-ignore-next-line
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};
