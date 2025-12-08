import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  time: string; // 24h format "HH:MM"
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  daysOfWeek?: number[]; // 0-6 for weekly reminders (0 = Sunday)
  dayOfMonth?: number; // 1-31 for monthly reminders
  pushNotification: boolean;
  isActive: boolean;
  category: 'medication' | 'appointment' | 'vitals' | 'exercise' | 'water' | 'other';
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Reminder name is required'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Reminder time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM (24h format)'],
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'once'],
      default: 'daily',
    },
    daysOfWeek: {
      type: [Number],
      validate: {
        validator: function(v: number[]) {
          return v.every(day => day >= 0 && day <= 6);
        },
        message: 'Days of week must be between 0 (Sunday) and 6 (Saturday)',
      },
    },
    dayOfMonth: {
      type: Number,
      min: [1, 'Day of month must be between 1 and 31'],
      max: [31, 'Day of month must be between 1 and 31'],
    },
    pushNotification: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['medication', 'appointment', 'vitals', 'exercise', 'water', 'other'],
      default: 'other',
    },
    lastTriggered: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reminderSchema.index({ userId: 1, isActive: 1 });
reminderSchema.index({ userId: 1, category: 1 });
reminderSchema.index({ userId: 1, time: 1 });

export default mongoose.model<IReminder>('Reminder', reminderSchema);
