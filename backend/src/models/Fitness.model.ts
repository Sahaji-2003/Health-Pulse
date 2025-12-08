import mongoose, { Document, Schema } from 'mongoose';

export interface IFitnessActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'running' | 'cycling' | 'gym' | 'swimming' | 'walking' | 'yoga' | 'other';
  duration: number; // in minutes
  distance?: number; // in kilometers
  caloriesBurned?: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
  date: Date;
  goals?: {
    targetDuration?: number;
    targetDistance?: number;
    targetCalories?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const fitnessActivitySchema = new Schema<IFitnessActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: ['running', 'cycling', 'gym', 'swimming', 'walking', 'yoga', 'other'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    distance: {
      type: Number,
      min: [0, 'Distance must be positive'],
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned must be positive'],
    },
    intensity: {
      type: String,
      required: [true, 'Intensity is required'],
      enum: ['low', 'medium', 'high'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required'],
      default: Date.now,
    },
    // amazonq-ignore-next-line
    goals: {
      targetDuration: Number,
      targetDistance: Number,
      targetCalories: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
fitnessActivitySchema.index({ userId: 1, date: -1 });
fitnessActivitySchema.index({ userId: 1, type: 1 });

export default mongoose.model<IFitnessActivity>('FitnessActivity', fitnessActivitySchema);
