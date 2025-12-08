import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Resource from '../models/Resource.model';
import SavedResource from '../models/SavedResource.model';

export const getResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    const { type, category, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // amazonq-ignore-next-line
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      data: resources,
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

export const getResourceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const saveResource = async (
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

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Check if already saved - if so, unsave it (toggle behavior)
    const existingSave = await SavedResource.findOne({
      userId: req.user.id,
      resourceId: id,
    });

    if (existingSave) {
      await SavedResource.deleteOne({ _id: existingSave._id });
      res.status(200).json({
        success: true,
        message: 'Resource removed from saved',
        data: { isSaved: false },
      });
      return;
    }

    const savedResource = await SavedResource.create({
      userId: req.user.id,
      resourceId: id,
      notes: req.body.notes,
    });

    res.status(201).json({
      success: true,
      message: 'Resource saved successfully',
      data: { ...savedResource.toObject(), isSaved: true },
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedResources = async (
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

    const savedResources = await SavedResource.find({ userId: req.user.id })
      .populate('resourceId')
      .sort({ savedAt: -1 });

    res.status(200).json({
      success: true,
      data: savedResources,
    });
  } catch (error) {
    next(error);
  }
};

export const rateResource = async (
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
    const { rating, review } = req.body;

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Check if user already rated
    const existingRatingIndex = resource.ratings.findIndex(
      (r) => r.userId.toString() === req.user!.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      resource.ratings[existingRatingIndex].rating = rating;
      resource.ratings[existingRatingIndex].review = review;
      resource.ratings[existingRatingIndex].date = new Date();
    } else {
      // Add new rating
      resource.ratings.push({
        userId: req.user.id as any,
        rating,
        review,
        date: new Date(),
      });
    }

    // Recalculate average rating
    const totalRating = resource.ratings.reduce((sum, r) => sum + r.rating, 0);
    resource.averageRating = totalRating / resource.ratings.length;
    resource.totalRatings = resource.ratings.length;

    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};
