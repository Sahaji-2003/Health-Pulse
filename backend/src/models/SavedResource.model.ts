import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedResource extends Document {
  userId: mongoose.Types.ObjectId;
  resourceId: mongoose.Types.ObjectId;
  notes?: string;
  savedAt: Date;
}

const savedResourceSchema = new Schema<ISavedResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    // amazonq-ignore-next-line
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource ID is required'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Compound index to prevent duplicate saves
savedResourceSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export default mongoose.model<ISavedResource>('SavedResource', savedResourceSchema);
