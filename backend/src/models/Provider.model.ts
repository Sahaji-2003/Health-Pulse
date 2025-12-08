import mongoose, { Document, Schema } from 'mongoose';

export interface IProvider extends Document {
  name: string;
  specialty: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  acceptsInsurance: string[];
  rating: number;
  reviewCount: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    name: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'USA',
      },
    },
    // amazonq-ignore-next-line
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    // amazonq-ignore-next-line
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    acceptsInsurance: {
      type: [String],
      default: [],
    },
    // amazonq-ignore-next-line
    rating: {
      type: Number,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
providerSchema.index({ specialty: 1, 'location.city': 1 });
providerSchema.index({ name: 'text', specialty: 'text' });

export default mongoose.model<IProvider>('Provider', providerSchema);
