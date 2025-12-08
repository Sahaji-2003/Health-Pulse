import mongoose, { Document, Schema } from 'mongoose';

export interface IFitnessGoal extends Document {
  userId: mongoose.Types.ObjectId;
  goalType: 'steps' | 'calories' | 'distance' | 'workouts' | 'duration' | 'weight';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fitnessGoalSchema = new Schema<IFitnessGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    goalType: {
      type: String,
      required: [true, 'Goal type is required'],
      enum: ['steps', 'calories', 'distance', 'workouts', 'duration', 'weight'],
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [0, 'Target value must be positive'],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, 'Current value must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
fitnessGoalSchema.index({ userId: 1, endDate: -1 });
fitnessGoalSchema.index({ userId: 1, isCompleted: 1 });

// Virtual for progress percentage
fitnessGoalSchema.virtual('progress').get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

// Pre-save hook to check completion
fitnessGoalSchema.pre('save', function (next) {
  if (this.currentValue >= this.targetValue) {
    this.isCompleted = true;
  }
  next();
});

export default mongoose.model<IFitnessGoal>('FitnessGoal', fitnessGoalSchema);
