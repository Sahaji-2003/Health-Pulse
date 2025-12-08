import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for a comment on a community post
 */
export interface ICommunityComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for comments on community posts
 */
const CommunityCommentSchema = new Schema<ICommunityComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityPost',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
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
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
CommunityCommentSchema.index({ postId: 1, createdAt: 1 });

// Virtual for checking if a specific user has liked the comment
CommunityCommentSchema.methods.isLikedByUser = function(userId: string): boolean {
  return this.likedBy.some((id: mongoose.Types.ObjectId) => id.toString() === userId);
};

const CommunityComment = mongoose.model<ICommunityComment>('CommunityComment', CommunityCommentSchema);

export default CommunityComment;
