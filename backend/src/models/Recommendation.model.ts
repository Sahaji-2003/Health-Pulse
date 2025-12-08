import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  category: 'fitness' | 'nutrition' | 'mental-health' | 'sleep' | 'general' | 'medical';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  conflictsWithMedicalHistory: boolean;
  conflictDetails?: string;
  source: 'ai-generated' | 'healthcare-provider' | 'system';
  // amazonq-ignore-next-line
  progress?: number; // percentage 0-100
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['fitness', 'nutrition', 'mental-health', 'sleep', 'general', 'medical'],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'in-progress', 'completed', 'dismissed'],
      default: 'pending',
    },
    conflictsWithMedicalHistory: {
      type: Boolean,
      default: false,
    },
    conflictDetails: {
      type: String,
      maxlength: [500, 'Conflict details cannot exceed 500 characters'],
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: ['ai-generated', 'healthcare-provider', 'system'],
      default: 'ai-generated',
    },
    progress: {
      type: Number,
      min: [0, 'Progress must be between 0 and 100'],
      max: [100, 'Progress must be between 0 and 100'],
      default: 0,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
recommendationSchema.index({ userId: 1, status: 1 });
recommendationSchema.index({ userId: 1, category: 1 });
recommendationSchema.index({ userId: 1, priority: -1 });

export default mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
