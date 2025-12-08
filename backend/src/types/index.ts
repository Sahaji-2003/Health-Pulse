import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FitnessActivityType {
  type: 'running' | 'cycling' | 'gym' | 'swimming' | 'walking' | 'other';
  duration: number; // in minutes
  distance?: number; // in kilometers
  caloriesBurned?: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface VitalSignsType {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  weight?: number;
  temperature?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
}

export interface RecommendationType {
  category: 'fitness' | 'nutrition' | 'mental-health' | 'sleep' | 'general';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
}

export interface ResourceType {
  type: 'article' | 'video' | 'podcast';
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

export interface ProviderType {
  name: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  acceptsInsurance: string[];
}

export interface AppointmentType {
  providerId: string;
  // amazonq-ignore-next-line
  dateTime: Date;
  type: 'in-person' | 'video' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
