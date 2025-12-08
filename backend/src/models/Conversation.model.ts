import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'Provider ID is required'],
      index: true,
    },
    lastMessage: {
      type: String,
      maxlength: [500, 'Last message preview cannot exceed 500 characters'],
    },
    lastMessageTime: {
      type: Date,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries and ensuring unique conversation per user-provider pair
conversationSchema.index({ userId: 1, providerId: 1 }, { unique: true });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
