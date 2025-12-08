import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for a community forum post
 */
export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for community forum posts
 */
const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ likes: -1 });

// Virtual for checking if a specific user has liked the post
CommunityPostSchema.methods.isLikedByUser = function(userId: string): boolean {
  return this.likedBy.some((id: mongoose.Types.ObjectId) => id.toString() === userId);
};

const CommunityPost = mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);

export default CommunityPost;
