import { describe, it, expect } from 'vitest';
import type {
  User,
  LoginCredentials,
  RegisterData,
  FitnessActivity,
  FitnessGoal,
  VitalSigns,
  Reminder,
  Recommendation,
  Resource,
  HealthcareProvider,
  Appointment,
  DashboardStats,
  HealthScore,
} from '../../src/types';

/**
 * Type validation tests ensure our interfaces are correctly defined
 * and can be used with proper TypeScript type checking.
 */

describe('Types - User', () => {
  it('should create a valid User object', () => {
    const user: User = {
      _id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(user._id).toBe('user123');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
  });

  it('should accept optional User fields', () => {
    const user: User = {
      _id: 'user123',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/avatar.jpg',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'female',
      height: 165,
      weight: 60,
      medicalConditions: ['allergies', 'asthma'],
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '555-1234',
        relationship: 'spouse',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(user.avatarUrl).toBe('https://example.com/avatar.jpg');
    expect(user.gender).toBe('female');
    expect(user.height).toBe(165);
    expect(user.medicalConditions).toHaveLength(2);
    expect(user.emergencyContact?.name).toBe('Emergency Contact');
  });
});

describe('Types - Authentication', () => {
  it('should create valid LoginCredentials', () => {
    const credentials: LoginCredentials = {
      email: 'user@test.com',
      password: 'securePassword123',
    };

    expect(credentials.email).toBe('user@test.com');
    expect(credentials.password).toBe('securePassword123');
  });

  it('should create valid RegisterData', () => {
    const registerData: RegisterData = {
      email: 'newuser@test.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      age: '25',
      gender: 'male',
      height: '180',
      weight: '75',
    };

    expect(registerData.email).toBe('newuser@test.com');
    expect(registerData.firstName).toBe('New');
    expect(registerData.age).toBe('25');
  });
});

describe('Types - Fitness', () => {
  it('should create valid FitnessActivity object', () => {
    const activity: FitnessActivity = {
      _id: 'activity123',
      userId: 'user123',
      type: 'running',
      duration: 45,
      distance: 5.5,
      caloriesBurned: 400,
      intensity: 'high',
      notes: 'Morning run',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(activity.type).toBe('running');
    expect(activity.duration).toBe(45);
    expect(activity.intensity).toBe('high');
  });

  it('should validate FitnessActivity types', () => {
    const validTypes = ['running', 'cycling', 'walking', 'swimming', 'gym', 'yoga', 'other'];
    const validIntensities = ['low', 'medium', 'high'];

    validTypes.forEach((type) => {
      const activity: Partial<FitnessActivity> = { type: type as FitnessActivity['type'] };
      expect(validTypes).toContain(activity.type);
    });

    validIntensities.forEach((intensity) => {
      const activity: Partial<FitnessActivity> = { intensity: intensity as FitnessActivity['intensity'] };
      expect(validIntensities).toContain(activity.intensity);
    });
  });

  it('should create valid FitnessGoal object', () => {
    const goal: FitnessGoal = {
      _id: 'goal123',
      userId: 'user123',
      goalType: 'steps',
      targetValue: 10000,
      currentValue: 5000,
      unit: 'steps',
      startDate: new Date(),
      endDate: new Date(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(goal.goalType).toBe('steps');
    expect(goal.targetValue).toBe(10000);
    expect(goal.currentValue).toBe(5000);
    expect(goal.isCompleted).toBe(false);
  });
});

describe('Types - Vitals', () => {
  it('should create valid VitalSigns object', () => {
    const vitals: VitalSigns = {
      _id: 'vitals123',
      userId: 'user123',
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      weight: 70,
      temperature: 36.6,
      oxygenSaturation: 98,
      bloodSugar: 100,
      notes: 'Morning reading',
      date: new Date(),
      isAbnormal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(vitals.bloodPressureSystolic).toBe(120);
    expect(vitals.bloodPressureDiastolic).toBe(80);
    expect(vitals.heartRate).toBe(72);
    expect(vitals.isAbnormal).toBe(false);
  });

  it('should allow partial vitals data', () => {
    const partialVitals: VitalSigns = {
      _id: 'vitals124',
      userId: 'user123',
      heartRate: 75,
      date: new Date(),
      isAbnormal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(partialVitals.heartRate).toBe(75);
    expect(partialVitals.bloodPressureSystolic).toBeUndefined();
  });
});

describe('Types - Reminder', () => {
  it('should create valid Reminder object', () => {
    const reminder: Reminder = {
      _id: 'reminder123',
      userId: 'user123',
      name: 'Take medication',
      description: 'Morning vitamins',
      time: '08:00',
      frequency: 'daily',
      pushNotification: true,
      isActive: true,
      category: 'medication',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(reminder.name).toBe('Take medication');
    expect(reminder.frequency).toBe('daily');
    expect(reminder.category).toBe('medication');
    expect(reminder.isActive).toBe(true);
  });

  it('should validate Reminder frequency types', () => {
    const validFrequencies = ['daily', 'weekly', 'monthly', 'once'];
    const validCategories = ['medication', 'appointment', 'vitals', 'exercise', 'water', 'other'];

    validFrequencies.forEach((freq) => {
      const reminder: Partial<Reminder> = { frequency: freq as Reminder['frequency'] };
      expect(validFrequencies).toContain(reminder.frequency);
    });

    validCategories.forEach((cat) => {
      const reminder: Partial<Reminder> = { category: cat as Reminder['category'] };
      expect(validCategories).toContain(reminder.category);
    });
  });
});

describe('Types - Recommendation', () => {
  it('should create valid Recommendation object', () => {
    const recommendation: Recommendation = {
      _id: 'rec123',
      userId: 'user123',
      category: 'fitness',
      title: 'Increase daily steps',
      description: 'Try to walk 10,000 steps daily',
      priority: 'high',
      status: 'pending',
      source: 'ai',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(recommendation.category).toBe('fitness');
    expect(recommendation.priority).toBe('high');
    expect(recommendation.status).toBe('pending');
    expect(recommendation.source).toBe('ai');
  });

  it('should validate Recommendation categories and statuses', () => {
    const validCategories = ['fitness', 'nutrition', 'sleep', 'mental-health', 'medical'];
    const validPriorities = ['low', 'medium', 'high'];
    const validStatuses = ['pending', 'in-progress', 'completed', 'dismissed'];

    validCategories.forEach((cat) => {
      const rec: Partial<Recommendation> = { category: cat as Recommendation['category'] };
      expect(validCategories).toContain(rec.category);
    });

    validPriorities.forEach((pri) => {
      const rec: Partial<Recommendation> = { priority: pri as Recommendation['priority'] };
      expect(validPriorities).toContain(rec.priority);
    });

    validStatuses.forEach((status) => {
      const rec: Partial<Recommendation> = { status: status as Recommendation['status'] };
      expect(validStatuses).toContain(rec.status);
    });
  });
});

describe('Types - Healthcare Provider', () => {
  it('should create valid HealthcareProvider object', () => {
    const provider: HealthcareProvider = {
      _id: 'provider123',
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      facility: 'City Hospital',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      phone: '555-1234',
      email: 'dr.smith@hospital.com',
      rating: 4.5,
      reviewCount: 120,
      acceptedInsurance: ['BlueCross', 'Aetna'],
      availability: [
        { day: 'Monday', slots: ['09:00', '10:00', '11:00'] },
        { day: 'Tuesday', slots: ['14:00', '15:00'] },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(provider.name).toBe('Dr. Smith');
    expect(provider.specialty).toBe('Cardiology');
    expect(provider.rating).toBe(4.5);
    expect(provider.availability).toHaveLength(2);
    expect(provider.acceptedInsurance).toContain('BlueCross');
  });
});

describe('Types - Appointment', () => {
  it('should create valid Appointment object', () => {
    const provider: HealthcareProvider = {
      _id: 'provider123',
      name: 'Dr. Jones',
      specialty: 'General Practice',
      facility: 'Medical Center',
      address: {
        street: '456 Oak Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
      },
      phone: '555-5678',
      email: 'dr.jones@medical.com',
      rating: 4.8,
      reviewCount: 200,
      acceptedInsurance: ['United'],
      availability: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const appointment: Appointment = {
      _id: 'appt123',
      userId: 'user123',
      providerId: 'provider123',
      provider: provider,
      dateTime: new Date(),
      type: 'video',
      status: 'scheduled',
      reason: 'Annual checkup',
      notes: 'First time visit',
      meetingLink: 'https://meet.example.com/123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(appointment.type).toBe('video');
    expect(appointment.status).toBe('scheduled');
    expect(appointment.meetingLink).toBeDefined();
    expect(appointment.provider.name).toBe('Dr. Jones');
  });
});

describe('Types - Dashboard', () => {
  it('should create valid DashboardStats object', () => {
    const stats: DashboardStats = {
      todaySteps: 8500,
      weeklyWorkouts: 5,
      averageHeartRate: 72,
      lastWeight: 70,
      activeGoals: 3,
      completedGoals: 7,
      pendingRecommendations: 2,
      upcomingAppointments: 1,
    };

    expect(stats.todaySteps).toBe(8500);
    expect(stats.weeklyWorkouts).toBe(5);
    expect(stats.activeGoals).toBe(3);
  });

  it('should create valid HealthScore object', () => {
    const score: HealthScore = {
      overall: 85,
      fitness: 90,
      nutrition: 75,
      sleep: 80,
      mentalHealth: 95,
    };

    expect(score.overall).toBe(85);
    expect(score.fitness).toBe(90);
    expect(score.nutrition).toBe(75);
    expect(score.sleep).toBe(80);
    expect(score.mentalHealth).toBe(95);
  });
});

describe('Types - Resource', () => {
  it('should create valid Resource object', () => {
    const resource: Resource = {
      _id: 'resource123',
      title: 'Healthy Eating Guide',
      description: 'Complete guide to balanced nutrition',
      type: 'article',
      category: 'nutrition',
      url: 'https://example.com/guide',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      author: 'Health Expert',
      rating: 4.5,
      reviewCount: 150,
      tags: ['nutrition', 'health', 'diet'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(resource.type).toBe('article');
    expect(resource.category).toBe('nutrition');
    expect(resource.tags).toHaveLength(3);
    expect(resource.rating).toBe(4.5);
  });

  it('should validate Resource types', () => {
    const validTypes = ['article', 'video', 'podcast', 'infographic'];

    validTypes.forEach((type) => {
      const resource: Partial<Resource> = { type: type as Resource['type'] };
      expect(validTypes).toContain(resource.type);
    });
  });
});
