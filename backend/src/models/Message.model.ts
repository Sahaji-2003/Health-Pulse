import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderType: 'user' | 'provider';
  content: string;
  type: 'text' | 'image' | 'link';
  imageUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Sender ID is required'],
      refPath: 'senderType',
    },
    senderType: {
      type: String,
      required: [true, 'Sender type is required'],
      enum: ['user', 'provider'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'image', 'link'],
      default: 'text',
    },
    imageUrl: {
      type: String,
    },
    linkTitle: {
      type: String,
      maxlength: [200, 'Link title cannot exceed 200 characters'],
    },
    linkDescription: {
      type: String,
      maxlength: [500, 'Link description cannot exceed 500 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient message retrieval
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, isRead: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
