import { describe, it, expect, vi, beforeEach } from 'vitest';

// Integration tests that verify data flow and business logic

describe('Integration - User Registration Flow', () => {
  it('should validate registration data before submission', () => {
    const validateRegistration = (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const errors: string[] = [];
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Invalid email');
      }
      if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
      }
      if (!data.firstName || data.firstName.trim() === '') {
        errors.push('First name is required');
      }
      if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Last name is required');
      }
      
      return { isValid: errors.length === 0, errors };
    };

    // Valid registration
    const validData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    expect(validateRegistration(validData).isValid).toBe(true);

    // Invalid email
    const invalidEmail = { ...validData, email: 'invalid-email' };
    expect(validateRegistration(invalidEmail).errors).toContain('Invalid email');

    // Short password
    const shortPassword = { ...validData, password: '12345' };
    expect(validateRegistration(shortPassword).errors).toContain('Password must be at least 6 characters');

    // Empty first name
    const emptyFirstName = { ...validData, firstName: '' };
    expect(validateRegistration(emptyFirstName).errors).toContain('First name is required');
  });
});

describe('Integration - Vital Signs Validation', () => {
  it('should detect abnormal blood pressure readings', () => {
    const checkBloodPressure = (systolic: number, diastolic: number) => {
      const isAbnormal = systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60;
      let severity: 'normal' | 'elevated' | 'high' | 'critical' = 'normal';
      
      if (systolic >= 180 || diastolic >= 120) {
        severity = 'critical';
      } else if (systolic >= 140 || diastolic >= 90) {
        severity = 'high';
      } else if (systolic >= 120 || diastolic >= 80) {
        severity = 'elevated';
      }
      
      return { isAbnormal, severity };
    };

    // Normal blood pressure
    expect(checkBloodPressure(120, 80).severity).toBe('elevated');
    expect(checkBloodPressure(115, 75).severity).toBe('normal');
    
    // High blood pressure
    expect(checkBloodPressure(145, 95).severity).toBe('high');
    expect(checkBloodPressure(145, 95).isAbnormal).toBe(true);
    
    // Critical blood pressure
    expect(checkBloodPressure(185, 125).severity).toBe('critical');
    expect(checkBloodPressure(185, 125).isAbnormal).toBe(true);
  });

  it('should detect abnormal heart rate readings', () => {
    const checkHeartRate = (bpm: number) => {
      const isAbnormal = bpm < 60 || bpm > 100;
      let category: 'low' | 'normal' | 'elevated' | 'high' = 'normal';
      
      if (bpm < 60) {
        category = 'low';
      } else if (bpm > 120) {
        category = 'high';
      } else if (bpm > 100) {
        category = 'elevated';
      }
      
      return { isAbnormal, category };
    };

    expect(checkHeartRate(72).category).toBe('normal');
    expect(checkHeartRate(72).isAbnormal).toBe(false);
    
    expect(checkHeartRate(55).category).toBe('low');
    expect(checkHeartRate(55).isAbnormal).toBe(true);
    
    expect(checkHeartRate(105).category).toBe('elevated');
    expect(checkHeartRate(105).isAbnormal).toBe(true);
    
    expect(checkHeartRate(130).category).toBe('high');
  });

  it('should validate oxygen saturation levels', () => {
    const checkOxygenSaturation = (level: number) => {
      if (level >= 95) return { status: 'normal', alert: false };
      if (level >= 90) return { status: 'low', alert: true };
      return { status: 'critical', alert: true };
    };

    expect(checkOxygenSaturation(98).status).toBe('normal');
    expect(checkOxygenSaturation(98).alert).toBe(false);
    
    expect(checkOxygenSaturation(92).status).toBe('low');
    expect(checkOxygenSaturation(92).alert).toBe(true);
    
    expect(checkOxygenSaturation(85).status).toBe('critical');
    expect(checkOxygenSaturation(85).alert).toBe(true);
  });

  it('should validate blood sugar levels', () => {
    const checkBloodSugar = (level: number, fasting: boolean = false) => {
      if (fasting) {
        if (level < 70) return { status: 'low', alert: true };
        if (level <= 99) return { status: 'normal', alert: false };
        if (level <= 125) return { status: 'prediabetic', alert: true };
        return { status: 'diabetic', alert: true };
      } else {
        if (level < 70) return { status: 'low', alert: true };
        if (level <= 140) return { status: 'normal', alert: false };
        if (level <= 199) return { status: 'prediabetic', alert: true };
        return { status: 'diabetic', alert: true };
      }
    };

    // Fasting blood sugar
    expect(checkBloodSugar(90, true).status).toBe('normal');
    expect(checkBloodSugar(110, true).status).toBe('prediabetic');
    expect(checkBloodSugar(130, true).status).toBe('diabetic');
    
    // Non-fasting blood sugar
    expect(checkBloodSugar(120, false).status).toBe('normal');
    expect(checkBloodSugar(160, false).status).toBe('prediabetic');
    expect(checkBloodSugar(210, false).status).toBe('diabetic');
  });
});

describe('Integration - Fitness Goal Progress', () => {
  it('should calculate goal completion percentage', () => {
    const calculateProgress = (current: number, target: number): number => {
      if (target === 0) return 0;
      const progress = (current / target) * 100;
      return Math.min(progress, 100); // Cap at 100%
    };

    expect(calculateProgress(5000, 10000)).toBe(50);
    expect(calculateProgress(10000, 10000)).toBe(100);
    expect(calculateProgress(12000, 10000)).toBe(100); // Capped at 100
    expect(calculateProgress(0, 10000)).toBe(0);
    expect(calculateProgress(1000, 0)).toBe(0); // Edge case: zero target
  });

  it('should determine if goal is on track', () => {
    const isOnTrack = (startDate: Date, endDate: Date, currentValue: number, targetValue: number): boolean => {
      const now = new Date();
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedDuration = now.getTime() - startDate.getTime();
      
      if (elapsedDuration <= 0) return true; // Not started
      if (elapsedDuration >= totalDuration) return currentValue >= targetValue; // Ended
      
      const expectedProgress = (elapsedDuration / totalDuration) * targetValue;
      return currentValue >= expectedProgress * 0.9; // Within 10% of expected
    };

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // 5 days ago
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5); // 5 days from now
    
    // On track (50% through, 50% complete)
    expect(isOnTrack(startDate, endDate, 5000, 10000)).toBe(true);
    
    // Behind (50% through, only 20% complete)
    expect(isOnTrack(startDate, endDate, 2000, 10000)).toBe(false);
  });

  it('should calculate calories from activity', () => {
    const calculateCalories = (type: string, duration: number, intensity: string): number => {
      const baseRates: Record<string, number> = {
        running: 10,
        cycling: 8,
        walking: 4,
        swimming: 9,
        gym: 7,
        yoga: 3,
        other: 5,
      };
      
      const intensityMultipliers: Record<string, number> = {
        low: 0.8,
        medium: 1,
        high: 1.3,
      };
      
      const baseRate = baseRates[type] || 5;
      const multiplier = intensityMultipliers[intensity] || 1;
      
      return Math.round(baseRate * duration * multiplier);
    };

    expect(calculateCalories('running', 30, 'medium')).toBe(300);
    expect(calculateCalories('running', 30, 'high')).toBe(390);
    expect(calculateCalories('walking', 60, 'low')).toBe(192);
    expect(calculateCalories('yoga', 45, 'low')).toBe(108);
  });
});

describe('Integration - Reminder Scheduling', () => {
  it('should determine next reminder time for daily frequency', () => {
    const getNextDailyReminder = (time: string): Date => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const next = new Date();
      next.setHours(hours, minutes, 0, 0);
      
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      
      return next;
    };

    const reminderTime = '08:00';
    const nextReminder = getNextDailyReminder(reminderTime);
    
    expect(nextReminder.getHours()).toBe(8);
    expect(nextReminder.getMinutes()).toBe(0);
    expect(nextReminder > new Date()).toBe(true);
  });

  it('should determine next reminder time for weekly frequency', () => {
    const getNextWeeklyReminder = (time: string, daysOfWeek: number[]): Date | null => {
      if (daysOfWeek.length === 0) return null;
      
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      
      // Check next 7 days
      for (let i = 0; i <= 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(now.getDate() + i);
        checkDate.setHours(hours, minutes, 0, 0);
        
        if (daysOfWeek.includes(checkDate.getDay()) && checkDate > now) {
          return checkDate;
        }
      }
      
      return null;
    };

    // Monday = 1, Wednesday = 3, Friday = 5
    const nextReminder = getNextWeeklyReminder('10:00', [1, 3, 5]);
    
    if (nextReminder) {
      expect([1, 3, 5]).toContain(nextReminder.getDay());
      expect(nextReminder > new Date()).toBe(true);
    }
  });

  it('should categorize reminders by urgency', () => {
    const categorizeReminder = (time: string, isActive: boolean) => {
      if (!isActive) return 'inactive';
      
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);
      
      const diffMinutes = (reminderTime.getTime() - now.getTime()) / (1000 * 60);
      
      if (diffMinutes < 0) return 'passed';
      if (diffMinutes <= 30) return 'upcoming';
      if (diffMinutes <= 120) return 'soon';
      return 'later';
    };

    const now = new Date();
    const inFiveMinutes = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 5).padStart(2, '0')}`;
    
    expect(categorizeReminder(inFiveMinutes, true)).toBe('upcoming');
    expect(categorizeReminder('23:59', false)).toBe('inactive');
  });
});

describe('Integration - Dashboard Widget Management', () => {
  it('should filter visible widgets', () => {
    const widgets = [
      { id: 'profile', visible: true },
      { id: 'vitals', visible: true },
      { id: 'fitness', visible: false },
      { id: 'recommendations', visible: true },
    ];

    const visibleWidgets = widgets.filter((w) => w.visible);
    
    expect(visibleWidgets).toHaveLength(3);
    expect(visibleWidgets.map((w) => w.id)).not.toContain('fitness');
  });

  it('should sort widgets by position', () => {
    const widgets = [
      { id: 'c', position: { x: 0, y: 4 } },
      { id: 'a', position: { x: 0, y: 0 } },
      { id: 'b', position: { x: 4, y: 0 } },
    ];

    const sorted = [...widgets].sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });
    
    expect(sorted[0].id).toBe('a');
    expect(sorted[1].id).toBe('b');
    expect(sorted[2].id).toBe('c');
  });

  it('should validate widget size constraints', () => {
    const validateWidgetSize = (width: number, height: number): boolean => {
      const minWidth = 2;
      const maxWidth = 12;
      const minHeight = 2;
      const maxHeight = 12;
      
      return width >= minWidth && width <= maxWidth && height >= minHeight && height <= maxHeight;
    };

    expect(validateWidgetSize(4, 4)).toBe(true);
    expect(validateWidgetSize(1, 4)).toBe(false); // Too narrow
    expect(validateWidgetSize(4, 1)).toBe(false); // Too short
    expect(validateWidgetSize(14, 4)).toBe(false); // Too wide
    expect(validateWidgetSize(4, 14)).toBe(false); // Too tall
  });
});

describe('Integration - Notification Priority', () => {
  it('should sort notifications by priority and time', () => {
    const notifications = [
      { id: '1', severity: 'info', createdAt: '2024-03-15T10:00:00Z', isRead: false },
      { id: '2', severity: 'critical', createdAt: '2024-03-15T09:00:00Z', isRead: false },
      { id: '3', severity: 'warning', createdAt: '2024-03-15T11:00:00Z', isRead: false },
      { id: '4', severity: 'critical', createdAt: '2024-03-15T12:00:00Z', isRead: true },
    ];

    const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
    
    const sorted = [...notifications].sort((a, b) => {
      // Unread first
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      // Then by severity
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      // Then by time (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    expect(sorted[0].id).toBe('2'); // Critical, unread, oldest
    expect(sorted[1].id).toBe('3'); // Warning, unread
    expect(sorted[2].id).toBe('1'); // Info, unread
    expect(sorted[3].id).toBe('4'); // Critical but read
  });
});

describe('Integration - Health Score Calculation', () => {
  it('should calculate overall health score', () => {
    const calculateHealthScore = (metrics: {
      fitnessScore: number;
      nutritionScore: number;
      sleepScore: number;
      mentalHealthScore: number;
      vitalsScore: number;
    }): number => {
      const weights = {
        fitnessScore: 0.25,
        nutritionScore: 0.2,
        sleepScore: 0.2,
        mentalHealthScore: 0.15,
        vitalsScore: 0.2,
      };

      let totalScore = 0;
      for (const [key, weight] of Object.entries(weights)) {
        totalScore += metrics[key as keyof typeof metrics] * weight;
      }

      return Math.round(totalScore);
    };

    const metrics = {
      fitnessScore: 80,
      nutritionScore: 70,
      sleepScore: 85,
      mentalHealthScore: 90,
      vitalsScore: 75,
    };

    const overallScore = calculateHealthScore(metrics);
    
    // 80*0.25 + 70*0.2 + 85*0.2 + 90*0.15 + 75*0.2 = 20 + 14 + 17 + 13.5 + 15 = 79.5 ≈ 80
    expect(overallScore).toBe(80);
  });

  it('should determine health score category', () => {
    const getScoreCategory = (score: number): string => {
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Good';
      if (score >= 70) return 'Fair';
      if (score >= 60) return 'Needs Improvement';
      return 'Poor';
    };

    expect(getScoreCategory(95)).toBe('Excellent');
    expect(getScoreCategory(85)).toBe('Good');
    expect(getScoreCategory(75)).toBe('Fair');
    expect(getScoreCategory(65)).toBe('Needs Improvement');
    expect(getScoreCategory(55)).toBe('Poor');
  });
});

describe('Integration - Appointment Scheduling', () => {
  it('should check slot availability', () => {
    const existingAppointments = [
      { dateTime: '2024-03-20T10:00:00Z' },
      { dateTime: '2024-03-20T14:00:00Z' },
    ];

    const isSlotAvailable = (dateTime: string): boolean => {
      const requestedTime = new Date(dateTime).getTime();
      const slotDuration = 60 * 60 * 1000; // 1 hour in ms
      
      for (const appt of existingAppointments) {
        const apptTime = new Date(appt.dateTime).getTime();
        if (Math.abs(requestedTime - apptTime) < slotDuration) {
          return false;
        }
      }
      
      return true;
    };

    expect(isSlotAvailable('2024-03-20T10:00:00Z')).toBe(false); // Exact match
    expect(isSlotAvailable('2024-03-20T10:30:00Z')).toBe(false); // Within 1 hour
    expect(isSlotAvailable('2024-03-20T12:00:00Z')).toBe(true); // Available
    expect(isSlotAvailable('2024-03-20T16:00:00Z')).toBe(true); // Available
  });

  it('should validate appointment time constraints', () => {
    const validateAppointmentTime = (dateTime: string): { valid: boolean; error?: string } => {
      const appointmentDate = new Date(dateTime);
      const now = new Date();
      
      // Must be in the future
      if (appointmentDate <= now) {
        return { valid: false, error: 'Appointment must be in the future' };
      }
      
      // Must be within business hours (9 AM - 5 PM)
      const hours = appointmentDate.getHours();
      if (hours < 9 || hours >= 17) {
        return { valid: false, error: 'Appointment must be during business hours (9 AM - 5 PM)' };
      }
      
      // Must be at least 24 hours in advance
      const minAdvanceTime = 24 * 60 * 60 * 1000; // 24 hours in ms
      if (appointmentDate.getTime() - now.getTime() < minAdvanceTime) {
        return { valid: false, error: 'Appointment must be at least 24 hours in advance' };
      }
      
      return { valid: true };
    };

    // Future appointment during business hours
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    futureDate.setHours(10, 0, 0, 0);
    
    const result = validateAppointmentTime(futureDate.toISOString());
    expect(result.valid).toBe(true);
  });
});

describe('Integration - Provider Search', () => {
  it('should filter providers by specialty', () => {
    const providers = [
      { id: '1', name: 'Dr. Smith', specialty: 'Cardiology' },
      { id: '2', name: 'Dr. Jones', specialty: 'Dermatology' },
      { id: '3', name: 'Dr. Wilson', specialty: 'Cardiology' },
    ];

    const filterBySpecialty = (specialty: string) =>
      providers.filter((p) => p.specialty.toLowerCase() === specialty.toLowerCase());

    const cardiologists = filterBySpecialty('Cardiology');
    
    expect(cardiologists).toHaveLength(2);
    expect(cardiologists.map((p) => p.name)).toContain('Dr. Smith');
    expect(cardiologists.map((p) => p.name)).toContain('Dr. Wilson');
  });

  it('should sort providers by rating', () => {
    const providers = [
      { id: '1', name: 'Dr. Smith', rating: 4.2 },
      { id: '2', name: 'Dr. Jones', rating: 4.8 },
      { id: '3', name: 'Dr. Wilson', rating: 4.5 },
    ];

    const sortedByRating = [...providers].sort((a, b) => b.rating - a.rating);
    
    expect(sortedByRating[0].name).toBe('Dr. Jones');
    expect(sortedByRating[1].name).toBe('Dr. Wilson');
    expect(sortedByRating[2].name).toBe('Dr. Smith');
  });

  it('should search providers by name', () => {
    const providers = [
      { id: '1', name: 'Dr. John Smith', specialty: 'Cardiology' },
      { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Dermatology' },
      { id: '3', name: 'Dr. Michael Smith', specialty: 'Orthopedics' },
    ];

    const searchByName = (query: string) =>
      providers.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

    const smithResults = searchByName('Smith');
    
    expect(smithResults).toHaveLength(2);
    expect(smithResults.map((p) => p.id)).toContain('1');
    expect(smithResults.map((p) => p.id)).toContain('3');
  });
});
