import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  type: 'article' | 'video' | 'podcast';
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  author?: string;
  publishedDate?: Date;
  duration?: number; // for videos and podcasts in minutes
  ratings: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    date: Date;
  }[];
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['article', 'video', 'podcast'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    // amazonq-ignore-next-line
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    duration: {
      type: Number,
      min: [0, 'Duration must be positive'],
    },
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, 'Rating must be between 1 and 5'],
          max: [5, 'Rating must be between 1 and 5'],
        },
        review: {
          type: String,
          maxlength: [500, 'Review cannot exceed 500 characters'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
// amazonq-ignore-next-line
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, type: 1 });

export default mongoose.model<IResource>('Resource', resourceSchema);
