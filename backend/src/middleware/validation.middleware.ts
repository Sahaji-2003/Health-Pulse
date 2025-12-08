import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// amazonq-ignore-next-line
// amazonq-ignore-next-line
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors,
        });
        return;
      }

      // amazonq-ignore-next-line
      res.status(500).json({
        success: false,
        message: 'Validation processing error',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Query validation error',
          errors,
        });
        return;
      }

      // amazonq-ignore-next-line
      res.status(500).json({
        success: false,
        message: 'Query validation processing error',
      });
    }
  };
};
