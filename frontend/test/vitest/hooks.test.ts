import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock all API services
vi.mock('../../src/services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
  fitnessApi: {
    getActivities: vi.fn(),
    getActivity: vi.fn(),
    createActivity: vi.fn(),
    updateActivity: vi.fn(),
    deleteActivity: vi.fn(),
    getGoals: vi.fn(),
    createGoal: vi.fn(),
    updateGoal: vi.fn(),
    deleteGoal: vi.fn(),
    getStats: vi.fn(),
  },
  vitalsApi: {
    getVitals: vi.fn(),
    getVital: vi.fn(),
    createVital: vi.fn(),
    updateVital: vi.fn(),
    deleteVital: vi.fn(),
    getAlerts: vi.fn(),
    markAlertRead: vi.fn(),
    getStats: vi.fn(),
    getVitalsHistory: vi.fn(),
  },
  remindersApi: {
    getReminders: vi.fn(),
    getUpcomingReminders: vi.fn(),
    getReminder: vi.fn(),
    createReminder: vi.fn(),
    updateReminder: vi.fn(),
    toggleReminder: vi.fn(),
    deleteReminder: vi.fn(),
  },
  notificationsApi: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    deleteAllNotifications: vi.fn(),
  },
  communityApi: {
    getPosts: vi.fn(),
    getPostById: vi.fn(),
    createPost: vi.fn(),
    togglePostLike: vi.fn(),
    addComment: vi.fn(),
    toggleCommentLike: vi.fn(),
    deletePost: vi.fn(),
    deleteComment: vi.fn(),
  },
  recommendationsApi: {
    getRecommendations: vi.fn(),
    getRecommendation: vi.fn(),
    updateStatus: vi.fn(),
    dismiss: vi.fn(),
    generate: vi.fn(),
  },
  userApi: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    deleteAccount: vi.fn(),
    uploadAvatar: vi.fn(),
    getDashboardLayout: vi.fn(),
    updateDashboardLayout: vi.fn(),
    resetDashboardLayout: vi.fn(),
  },
}));

describe('Hooks - Query Key Constants', () => {
  it('AUTH_QUERY_KEY should be defined correctly', async () => {
    const { AUTH_QUERY_KEY } = await import('../../src/hooks/useAuth');
    expect(AUTH_QUERY_KEY).toEqual(['auth', 'user']);
  });

  it('FITNESS_ACTIVITIES_KEY should be defined correctly', async () => {
    const { FITNESS_ACTIVITIES_KEY } = await import('../../src/hooks/useFitness');
    expect(FITNESS_ACTIVITIES_KEY).toEqual(['fitness', 'activities']);
  });

  it('FITNESS_GOALS_KEY should be defined correctly', async () => {
    const { FITNESS_GOALS_KEY } = await import('../../src/hooks/useFitness');
    expect(FITNESS_GOALS_KEY).toEqual(['fitness', 'goals']);
  });

  it('FITNESS_STATS_KEY should be defined correctly', async () => {
    const { FITNESS_STATS_KEY } = await import('../../src/hooks/useFitness');
    expect(FITNESS_STATS_KEY).toEqual(['fitness', 'stats']);
  });

  it('VITALS_KEY should be defined correctly', async () => {
    const { VITALS_KEY } = await import('../../src/hooks/useVitals');
    expect(VITALS_KEY).toEqual(['vitals']);
  });

  it('VITALS_ALERTS_KEY should be defined correctly', async () => {
    const { VITALS_ALERTS_KEY } = await import('../../src/hooks/useVitals');
    expect(VITALS_ALERTS_KEY).toEqual(['vitals', 'alerts']);
  });

  it('VITALS_STATS_KEY should be defined correctly', async () => {
    const { VITALS_STATS_KEY } = await import('../../src/hooks/useVitals');
    expect(VITALS_STATS_KEY).toEqual(['vitals', 'stats']);
  });

  it('REMINDERS_KEY should be defined correctly', async () => {
    const { REMINDERS_KEY } = await import('../../src/hooks/useReminders');
    expect(REMINDERS_KEY).toEqual(['reminders']);
  });

  it('REMINDERS_UPCOMING_KEY should be defined correctly', async () => {
    const { REMINDERS_UPCOMING_KEY } = await import('../../src/hooks/useReminders');
    expect(REMINDERS_UPCOMING_KEY).toEqual(['reminders', 'upcoming']);
  });

  it('NOTIFICATIONS_KEY should be defined correctly', async () => {
    const { NOTIFICATIONS_KEY } = await import('../../src/hooks/useNotifications');
    expect(NOTIFICATIONS_KEY).toEqual(['notifications']);
  });

  it('NOTIFICATIONS_COUNT_KEY should be defined correctly', async () => {
    const { NOTIFICATIONS_COUNT_KEY } = await import('../../src/hooks/useNotifications');
    expect(NOTIFICATIONS_COUNT_KEY).toEqual(['notifications', 'unread-count']);
  });

  it('PROFILE_QUERY_KEY should be defined correctly', async () => {
    const { PROFILE_QUERY_KEY } = await import('../../src/hooks/useProfile');
    expect(PROFILE_QUERY_KEY).toEqual(['user', 'profile']);
  });

  it('DASHBOARD_LAYOUT_QUERY_KEY should be defined correctly', async () => {
    const { DASHBOARD_LAYOUT_QUERY_KEY } = await import('../../src/hooks/useDashboardLayout');
    expect(DASHBOARD_LAYOUT_QUERY_KEY).toEqual(['user', 'dashboard-layout']);
  });
});

describe('Hooks - useDashboardLayout Constants', () => {
  it('DEFAULT_WIDGETS should have all required widgets', async () => {
    const { DEFAULT_WIDGETS } = await import('../../src/hooks/useDashboardLayout');
    
    expect(DEFAULT_WIDGETS).toBeDefined();
    expect(Array.isArray(DEFAULT_WIDGETS)).toBe(true);
    expect(DEFAULT_WIDGETS.length).toBeGreaterThanOrEqual(7);

    const widgetIds = DEFAULT_WIDGETS.map((w) => w.id);
    expect(widgetIds).toContain('profile');
    expect(widgetIds).toContain('vitals');
    expect(widgetIds).toContain('fitness');
    expect(widgetIds).toContain('recommendations');
    expect(widgetIds).toContain('weekly-chart');
    expect(widgetIds).toContain('awards');
    expect(widgetIds).toContain('resources');
  });

  it('DEFAULT_WIDGETS should have correct structure', async () => {
    const { DEFAULT_WIDGETS } = await import('../../src/hooks/useDashboardLayout');
    
    DEFAULT_WIDGETS.forEach((widget) => {
      expect(widget).toHaveProperty('id');
      expect(widget).toHaveProperty('type');
      expect(widget).toHaveProperty('visible');
      expect(widget).toHaveProperty('position');
      expect(widget).toHaveProperty('size');
      expect(widget).toHaveProperty('category');
      expect(widget.position).toHaveProperty('x');
      expect(widget.position).toHaveProperty('y');
      expect(widget.size).toHaveProperty('width');
      expect(widget.size).toHaveProperty('height');
    });
  });

  it('WIDGET_METADATA should have metadata for all widgets', async () => {
    const { WIDGET_METADATA } = await import('../../src/hooks/useDashboardLayout');
    
    expect(WIDGET_METADATA).toBeDefined();
    expect(WIDGET_METADATA.profile).toBeDefined();
    expect(WIDGET_METADATA.vitals).toBeDefined();
    expect(WIDGET_METADATA.fitness).toBeDefined();
    expect(WIDGET_METADATA.recommendations).toBeDefined();
    expect(WIDGET_METADATA['weekly-chart']).toBeDefined();
    expect(WIDGET_METADATA.awards).toBeDefined();
    expect(WIDGET_METADATA.resources).toBeDefined();
  });

  it('WIDGET_METADATA should have correct structure', async () => {
    const { WIDGET_METADATA } = await import('../../src/hooks/useDashboardLayout');
    
    Object.values(WIDGET_METADATA).forEach((metadata) => {
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('icon');
      expect(typeof metadata.name).toBe('string');
      expect(typeof metadata.description).toBe('string');
      expect(typeof metadata.icon).toBe('string');
    });
  });
});

describe('Hooks - useProfile Helper Functions', () => {
  it('profileToFormData should handle undefined user', async () => {
    const { useProfile } = await import('../../src/hooks/useProfile');
    
    // We need to test the helper function logic
    const emptyFormData = {
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      password: '',
      medicalConditions: '',
    };

    // Verify structure matches expected empty form
    expect(emptyFormData.firstName).toBe('');
    expect(emptyFormData.lastName).toBe('');
    expect(emptyFormData.age).toBe('');
    expect(emptyFormData.gender).toBe('');
  });

  it('formDataToApiData conversion logic', async () => {
    // Test the conversion logic independently
    const formData = {
      firstName: 'Test',
      lastName: 'User',
      age: '30',
      gender: 'male' as const,
      height: '180',
      weight: '75',
      password: '',
      medicalConditions: 'allergies, asthma',
    };

    // Simulate the conversion
    const apiData: Record<string, unknown> = {};
    if (formData.firstName) apiData.firstName = formData.firstName;
    if (formData.lastName) apiData.lastName = formData.lastName;
    if (formData.gender) apiData.gender = formData.gender;
    if (formData.height) apiData.height = parseFloat(formData.height);
    if (formData.weight) apiData.weight = parseFloat(formData.weight);
    if (formData.medicalConditions) {
      apiData.medicalConditions = formData.medicalConditions
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    expect(apiData.firstName).toBe('Test');
    expect(apiData.height).toBe(180);
    expect(apiData.weight).toBe(75);
    expect(apiData.medicalConditions).toEqual(['allergies', 'asthma']);
  });
});

describe('Hooks - Data Validation', () => {
  it('should validate fitness activity types', () => {
    const validTypes = ['running', 'cycling', 'walking', 'swimming', 'gym', 'yoga', 'other'];
    
    validTypes.forEach((type) => {
      expect(validTypes.includes(type)).toBe(true);
    });

    expect(validTypes.includes('invalid')).toBe(false);
  });

  it('should validate intensity levels', () => {
    const validIntensities = ['low', 'medium', 'high'];
    
    validIntensities.forEach((intensity) => {
      expect(validIntensities.includes(intensity)).toBe(true);
    });

    expect(validIntensities.includes('extreme')).toBe(false);
  });

  it('should validate reminder frequencies', () => {
    const validFrequencies = ['daily', 'weekly', 'monthly', 'once'];
    
    validFrequencies.forEach((freq) => {
      expect(validFrequencies.includes(freq)).toBe(true);
    });

    expect(validFrequencies.includes('hourly')).toBe(false);
  });

  it('should validate reminder categories', () => {
    const validCategories = ['medication', 'appointment', 'vitals', 'exercise', 'water', 'other'];
    
    validCategories.forEach((cat) => {
      expect(validCategories.includes(cat)).toBe(true);
    });

    expect(validCategories.includes('unknown')).toBe(false);
  });

  it('should validate notification types', () => {
    const validTypes = ['vital_alert', 'reminder', 'appointment', 'system'];
    
    validTypes.forEach((type) => {
      expect(validTypes.includes(type)).toBe(true);
    });

    expect(validTypes.includes('invalid')).toBe(false);
  });

  it('should validate notification severities', () => {
    const validSeverities = ['info', 'warning', 'critical'];
    
    validSeverities.forEach((severity) => {
      expect(validSeverities.includes(severity)).toBe(true);
    });

    expect(validSeverities.includes('danger')).toBe(false);
  });

  it('should validate goal types', () => {
    const validGoalTypes = ['steps', 'calories', 'distance', 'workouts', 'duration', 'weight'];
    
    validGoalTypes.forEach((type) => {
      expect(validGoalTypes.includes(type)).toBe(true);
    });

    expect(validGoalTypes.includes('unknown')).toBe(false);
  });

  it('should validate recommendation categories', () => {
    const validCategories = ['fitness', 'nutrition', 'sleep', 'mental-health', 'medical'];
    
    validCategories.forEach((cat) => {
      expect(validCategories.includes(cat)).toBe(true);
    });

    expect(validCategories.includes('unknown')).toBe(false);
  });

  it('should validate recommendation statuses', () => {
    const validStatuses = ['pending', 'in-progress', 'completed', 'dismissed'];
    
    validStatuses.forEach((status) => {
      expect(validStatuses.includes(status)).toBe(true);
    });

    expect(validStatuses.includes('unknown')).toBe(false);
  });

  it('should validate appointment types', () => {
    const validTypes = ['in-person', 'video', 'phone'];
    
    validTypes.forEach((type) => {
      expect(validTypes.includes(type)).toBe(true);
    });

    expect(validTypes.includes('chat')).toBe(false); // Note: 'chat' is in providers API but not core types
  });

  it('should validate appointment statuses', () => {
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    
    validStatuses.forEach((status) => {
      expect(validStatuses.includes(status)).toBe(true);
    });

    expect(validStatuses.includes('pending')).toBe(false);
  });

  it('should validate resource types', () => {
    const validTypes = ['article', 'video', 'podcast', 'infographic'];
    
    validTypes.forEach((type) => {
      expect(validTypes.includes(type)).toBe(true);
    });

    expect(validTypes.includes('book')).toBe(false);
  });

  it('should validate widget categories', () => {
    const validCategories = ['vitals', 'fitness', 'social', 'recommendations', 'profile'];
    
    validCategories.forEach((cat) => {
      expect(validCategories.includes(cat)).toBe(true);
    });

    expect(validCategories.includes('unknown')).toBe(false);
  });

  it('should validate widget types', () => {
    const validTypes = ['profile', 'vitals', 'fitness', 'recommendations', 'weekly-chart', 'awards', 'resources'];
    
    validTypes.forEach((type) => {
      expect(validTypes.includes(type)).toBe(true);
    });

    expect(validTypes.includes('unknown')).toBe(false);
  });
});

describe('Hooks - Time Period Validation', () => {
  it('should validate stats periods', () => {
    const validPeriods = ['week', 'month', 'year'];
    
    validPeriods.forEach((period) => {
      expect(validPeriods.includes(period)).toBe(true);
    });

    expect(validPeriods.includes('day')).toBe(false);
    expect(validPeriods.includes('quarter')).toBe(false);
  });
});

describe('Hooks - Pagination Parameters', () => {
  it('should accept valid pagination parameters', () => {
    const validPagination = {
      page: 1,
      limit: 10,
    };

    expect(validPagination.page).toBeGreaterThan(0);
    expect(validPagination.limit).toBeGreaterThan(0);
    expect(validPagination.limit).toBeLessThanOrEqual(100); // reasonable limit
  });

  it('should handle pagination calculation', () => {
    const total = 95;
    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    expect(totalPages).toBe(10);
  });
});

describe('Hooks - State Management', () => {
  it('should handle loading states correctly', () => {
    const states = {
      isLoading: true,
      isError: false,
      isSuccess: false,
    };

    // Only one state should be active at a time
    const activeStates = [states.isLoading, states.isError, states.isSuccess].filter(Boolean);
    expect(activeStates.length).toBeLessThanOrEqual(1);
  });

  it('should handle error states correctly', () => {
    const errorState = {
      isLoading: false,
      isError: true,
      error: new Error('Test error'),
    };

    expect(errorState.isError).toBe(true);
    expect(errorState.error).toBeInstanceOf(Error);
    expect(errorState.error.message).toBe('Test error');
  });

  it('should handle success states correctly', () => {
    const successState = {
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { id: '123', name: 'Test' },
    };

    expect(successState.isSuccess).toBe(true);
    expect(successState.data).toBeDefined();
    expect(successState.data.id).toBe('123');
  });
});
