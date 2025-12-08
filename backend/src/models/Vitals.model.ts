import mongoose, { Document, Schema } from 'mongoose';

export interface IVitalSigns extends Document {
  userId: mongoose.Types.ObjectId;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // bpm
  weight?: number; // kg
  temperature?: number; // celsius
  bloodSugar?: number; // mg/dL
  oxygenSaturation?: number; // percentage
  notes?: string;
  date: Date;
  isAbnormal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vitalSignsSchema = new Schema<IVitalSigns>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    bloodPressureSystolic: {
      type: Number,
      min: [0, 'Blood pressure must be positive'],
      max: [300, 'Invalid blood pressure value'],
    },
    bloodPressureDiastolic: {
      type: Number,
      min: [0, 'Blood pressure must be positive'],
      max: [200, 'Invalid blood pressure value'],
    },
    heartRate: {
      type: Number,
      min: [0, 'Heart rate must be positive'],
      max: [300, 'Invalid heart rate value'],
    },
    weight: {
      type: Number,
      min: [0, 'Weight must be positive'],
      max: [500, 'Invalid weight value'],
    },
    temperature: {
      type: Number,
      min: [30, 'Invalid temperature value'],
      max: [45, 'Invalid temperature value'],
    },
    bloodSugar: {
      type: Number,
      min: [0, 'Blood sugar must be positive'],
      max: [600, 'Invalid blood sugar value'],
    },
    oxygenSaturation: {
      type: Number,
      min: [0, 'Oxygen saturation must be between 0 and 100'],
      max: [100, 'Oxygen saturation must be between 0 and 100'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    isAbnormal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to detect abnormal values
// amazonq-ignore-next-line
vitalSignsSchema.pre('save', function (next) {
  let abnormal = false;

  // Check blood pressure
  if (
    this.bloodPressureSystolic &&
    (this.bloodPressureSystolic > 140 || this.bloodPressureSystolic < 90)
  ) {
    abnormal = true;
  }
  if (
    this.bloodPressureDiastolic &&
    (this.bloodPressureDiastolic > 90 || this.bloodPressureDiastolic < 60)
  ) {
    abnormal = true;
  }

  // Check heart rate
  if (this.heartRate && (this.heartRate > 100 || this.heartRate < 60)) {
    abnormal = true;
  }

  // Check temperature
  if (this.temperature && (this.temperature > 37.5 || this.temperature < 36)) {
    abnormal = true;
  }

  // Check blood sugar
  if (this.bloodSugar && (this.bloodSugar > 140 || this.bloodSugar < 70)) {
    abnormal = true;
  }

  // Check oxygen saturation
  if (this.oxygenSaturation && this.oxygenSaturation < 95) {
    abnormal = true;
  }

  this.isAbnormal = abnormal;
  next();
});

// Index for efficient queries
vitalSignsSchema.index({ userId: 1, date: -1 });
vitalSignsSchema.index({ userId: 1, isAbnormal: 1 });

export default mongoose.model<IVitalSigns>('VitalSigns', vitalSignsSchema);
