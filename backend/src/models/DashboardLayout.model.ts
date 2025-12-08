import mongoose, { Document, Schema } from 'mongoose';

// Widget position and size interface
export interface IWidgetConfig {
  id: string;          // Unique widget identifier
  type: string;        // Widget type: 'profile', 'vitals', 'fitness', 'recommendations', 'weekly-chart', 'awards', 'resources'
  visible: boolean;    // Whether widget is visible on dashboard
  position: {
    x: number;         // Grid column (0-11 for 12-column grid)
    y: number;         // Grid row
  };
  size: {
    width: number;     // Number of columns widget spans
    height: number;    // Number of rows widget spans
  };
  category: string;    // Category: 'vitals', 'fitness', 'social', 'recommendations', 'profile'
}

export interface IDashboardLayout extends Document {
  userId: mongoose.Types.ObjectId;
  widgets: IWidgetConfig[];
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Default widget configuration
export const DEFAULT_WIDGETS: IWidgetConfig[] = [
  {
    id: 'profile',
    type: 'profile',
    visible: true,
    position: { x: 0, y: 0 },
    size: { width: 4, height: 4 },
    category: 'profile'
  },
  {
    id: 'vitals',
    type: 'vitals',
    visible: true,
    position: { x: 4, y: 0 },
    size: { width: 8, height: 4 },
    category: 'vitals'
  },
  {
    id: 'fitness',
    type: 'fitness',
    visible: true,
    position: { x: 0, y: 4 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'recommendations',
    type: 'recommendations',
    visible: true,
    position: { x: 4, y: 4 },
    size: { width: 4, height: 6 },
    category: 'recommendations'
  },
  {
    id: 'weekly-chart',
    type: 'weekly-chart',
    visible: true,
    position: { x: 8, y: 4 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'awards',
    type: 'awards',
    visible: true,
    position: { x: 0, y: 10 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'resources',
    type: 'resources',
    visible: true,
    position: { x: 4, y: 10 },
    size: { width: 8, height: 6 },
    category: 'social'
  }
];

const widgetConfigSchema = new Schema<IWidgetConfig>(
  {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['profile', 'vitals', 'fitness', 'recommendations', 'weekly-chart', 'awards', 'resources']
    },
    visible: {
      type: Boolean,
      default: true
    },
    position: {
      x: {
        type: Number,
        required: true,
        min: 0,
        max: 11
      },
      y: {
        type: Number,
        required: true,
        min: 0
      }
    },
    size: {
      width: {
        type: Number,
        required: true,
        min: 1,
        max: 12
      },
      height: {
        type: Number,
        required: true,
        min: 1
      }
    },
    category: {
      type: String,
      required: true,
      enum: ['vitals', 'fitness', 'social', 'recommendations', 'profile']
    }
  },
  { _id: false }
);

const dashboardLayoutSchema = new Schema<IDashboardLayout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    widgets: {
      type: [widgetConfigSchema],
      default: DEFAULT_WIDGETS
    },
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for faster user lookup
dashboardLayoutSchema.index({ userId: 1 });

export default mongoose.model<IDashboardLayout>('DashboardLayout', dashboardLayoutSchema);
