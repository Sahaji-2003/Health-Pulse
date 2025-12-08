// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height?: number;
  weight?: number;
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  age?: string;
  gender?: 'male' | 'female' | 'other';
  height?: string;
  weight?: string;
  medicalConditions?: string;
}

// Fitness Types
export interface FitnessActivity {
  _id: string;
  userId: string;
  type: 'running' | 'cycling' | 'walking' | 'swimming' | 'gym' | 'yoga' | 'other';
  duration: number; // in minutes
  distance?: number; // in kilometers
  caloriesBurned?: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
  date: Date;
  goals?: {
    targetDuration?: number;
    targetDistance?: number;
    targetCalories?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FitnessGoal {
  _id: string;
  userId: string;
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

// Vitals Types
export interface VitalSigns {
  _id: string;
  userId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  weight?: number;
  temperature?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
  date: Date;
  isAbnormal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalAlert {
  _id: string;
  userId: string;
  vitalType: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Reminder Types
export interface Reminder {
  _id: string;
  userId: string;
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

// Recommendation Types
export interface Recommendation {
  _id: string;
  userId: string;
  category: 'fitness' | 'nutrition' | 'sleep' | 'mental-health' | 'medical';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  source: 'ai' | 'provider' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'infographic';
  category: string;
  url: string;
  thumbnailUrl?: string;
  author?: string;
  duration?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedResource {
  _id: string;
  userId: string;
  resourceId: string;
  resource: Resource;
  notes?: string;
  savedAt: Date;
}

// Provider Types
export interface HealthcareProvider {
  _id: string;
  name: string;
  specialty: string;
  facility: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  acceptedInsurance: string[];
  availability: {
    day: string;
    slots: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id: string;
  userId: string;
  providerId: string;
  provider: HealthcareProvider;
  dateTime: Date;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface DashboardStats {
  todaySteps: number;
  weeklyWorkouts: number;
  averageHeartRate: number;
  lastWeight: number;
  activeGoals: number;
  completedGoals: number;
  pendingRecommendations: number;
  upcomingAppointments: number;
}

export interface HealthScore {
  overall: number;
  fitness: number;
  nutrition: number;
  sleep: number;
  mentalHealth: number;
}
