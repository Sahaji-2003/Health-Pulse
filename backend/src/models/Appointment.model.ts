import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  dateTime: Date;
  type: 'in-person' | 'video' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  meetingLink?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
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
    dateTime: {
      type: Date,
      required: [true, 'Date and time are required'],
    },
    type: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: ['in-person', 'video', 'chat'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    // amazonq-ignore-next-line
    meetingLink: {
      type: String,
    },
    cancelReason: {
      type: String,
      maxlength: [500, 'Cancel reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ userId: 1, dateTime: -1 });
appointmentSchema.index({ providerId: 1, dateTime: 1 });
appointmentSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
