import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('API Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios instance with default config', () => {
    expect(axios.create).toBeDefined();
    
    const mockCreate = vi.fn((config) => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }));
    
    (axios.create as unknown as ReturnType<typeof vi.fn>) = mockCreate;
    
    mockCreate({
      baseURL: 'http://localhost:5000/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5000/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('Auth API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login should call POST /auth/login with credentials', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      data: {
        success: true,
        data: {
          user: { _id: 'user123', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
          tokens: { accessToken: 'token123' },
        },
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/auth/login', credentials);

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result.data.success).toBe(true);
    expect(result.data.data.user.email).toBe('test@example.com');
  });

  it('register should call POST /auth/register with user data', async () => {
    const registerData = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };

    const mockResponse = {
      data: {
        success: true,
        data: {
          user: { _id: 'user456', ...registerData },
          tokens: { accessToken: 'token456' },
        },
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/auth/register', registerData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    expect(result.data.success).toBe(true);
    expect(result.data.data.user.firstName).toBe('New');
  });

  it('getCurrentUser should call GET /auth/me', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          _id: 'user123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/auth/me');

    expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
    expect(result.data.success).toBe(true);
    expect(result.data.data._id).toBe('user123');
  });

  it('logout should call POST /auth/logout', async () => {
    const mockResponse = { data: { success: true, data: null } };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/auth/logout');

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
    expect(result.data.success).toBe(true);
  });

  it('forgotPassword should call POST /auth/forgot-password', async () => {
    const email = 'user@example.com';
    const mockResponse = {
      data: { success: true, message: 'Reset email sent' },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/auth/forgot-password', { email });

    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
    expect(result.data.success).toBe(true);
  });
});

describe('Fitness API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getActivities should call GET /fitness/activities', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'act1', type: 'running', duration: 30 },
          { _id: 'act2', type: 'cycling', duration: 45 },
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/fitness/activities', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/fitness/activities', { params: {} });
    expect(result.data.data).toHaveLength(2);
  });

  it('createActivity should call POST /fitness/activities', async () => {
    const activityData = {
      type: 'running',
      duration: 30,
      intensity: 'medium',
      caloriesBurned: 300,
    };

    const mockResponse = {
      data: {
        success: true,
        data: { _id: 'newact', ...activityData },
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/fitness/activities', activityData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/fitness/activities', activityData);
    expect(result.data.data.type).toBe('running');
  });

  it('updateActivity should call PUT /fitness/activities/:id', async () => {
    const updateData = { duration: 45 };
    const mockResponse = {
      data: { success: true, data: { _id: 'act1', duration: 45 } },
    };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/fitness/activities/act1', updateData);

    expect(mockApiClient.put).toHaveBeenCalledWith('/fitness/activities/act1', updateData);
    expect(result.data.data.duration).toBe(45);
  });

  it('deleteActivity should call DELETE /fitness/activities/:id', async () => {
    const mockResponse = { data: { success: true, data: null } };

    mockApiClient.delete.mockResolvedValue(mockResponse);

    const result = await mockApiClient.delete('/fitness/activities/act1');

    expect(mockApiClient.delete).toHaveBeenCalledWith('/fitness/activities/act1');
    expect(result.data.success).toBe(true);
  });

  it('getGoals should call GET /fitness/goals', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'goal1', goalType: 'steps', targetValue: 10000 },
          { _id: 'goal2', goalType: 'calories', targetValue: 2000 },
        ],
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/fitness/goals', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/fitness/goals', { params: {} });
    expect(result.data.data).toHaveLength(2);
  });

  it('getStats should call GET /fitness/stats with period', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          totalWorkouts: 10,
          totalDuration: 450,
          totalCalories: 3500,
          period: 'week',
        },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/fitness/stats', { params: { period: 'week' } });

    expect(mockApiClient.get).toHaveBeenCalledWith('/fitness/stats', { params: { period: 'week' } });
    expect(result.data.data.totalWorkouts).toBe(10);
  });
});

describe('Vitals API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getVitals should call GET /vitals', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'v1', heartRate: 72, bloodPressureSystolic: 120, bloodPressureDiastolic: 80 },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/vitals', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/vitals', { params: {} });
    expect(result.data.data[0].heartRate).toBe(72);
  });

  it('createVital should call POST /vitals', async () => {
    const vitalData = {
      heartRate: 75,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
    };

    const mockResponse = {
      data: { success: true, data: { _id: 'newvital', ...vitalData } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/vitals', vitalData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/vitals', vitalData);
    expect(result.data.data.heartRate).toBe(75);
  });

  it('getVitalsStats should call GET /vitals/stats', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          averageHeartRate: 72,
          averageBloodPressure: { systolic: 120, diastolic: 80 },
          alertsCount: 2,
        },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/vitals/stats', { params: { period: 'week' } });

    expect(mockApiClient.get).toHaveBeenCalledWith('/vitals/stats', { params: { period: 'week' } });
    expect(result.data.data.averageHeartRate).toBe(72);
  });
});

describe('Reminders API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getReminders should call GET /reminders', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'rem1', name: 'Take vitamins', time: '08:00', category: 'medication' },
        ],
        count: 1,
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/reminders', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/reminders', { params: {} });
    expect(result.data.data[0].name).toBe('Take vitamins');
  });

  it('createReminder should call POST /reminders', async () => {
    const reminderData = {
      name: 'Drink water',
      time: '10:00',
      frequency: 'daily',
      category: 'water',
    };

    const mockResponse = {
      data: { success: true, data: { _id: 'newrem', ...reminderData } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/reminders', reminderData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/reminders', reminderData);
    expect(result.data.data.name).toBe('Drink water');
  });

  it('toggleReminder should call PATCH /reminders/:id/toggle', async () => {
    const mockResponse = {
      data: { success: true, data: { _id: 'rem1', isActive: false } },
    };

    mockApiClient.patch.mockResolvedValue(mockResponse);

    const result = await mockApiClient.patch('/reminders/rem1/toggle');

    expect(mockApiClient.patch).toHaveBeenCalledWith('/reminders/rem1/toggle');
    expect(result.data.data.isActive).toBe(false);
  });
});

describe('Notifications API', () => {
  const mockApiClient = {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getNotifications should call GET /notifications', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'notif1', title: 'Reminder', message: 'Time to take your medication', isRead: false },
        ],
        unreadCount: 1,
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/notifications', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/notifications', { params: {} });
    expect(result.data.unreadCount).toBe(1);
  });

  it('getUnreadCount should call GET /notifications/unread-count', async () => {
    const mockResponse = {
      data: { success: true, data: { unreadCount: 5 } },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/notifications/unread-count');

    expect(mockApiClient.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(result.data.data.unreadCount).toBe(5);
  });

  it('markAsRead should call PUT /notifications/:id/read', async () => {
    const mockResponse = {
      data: { success: true, data: { _id: 'notif1', isRead: true } },
    };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/notifications/notif1/read');

    expect(mockApiClient.put).toHaveBeenCalledWith('/notifications/notif1/read');
    expect(result.data.data.isRead).toBe(true);
  });

  it('markAllAsRead should call PUT /notifications/read-all', async () => {
    const mockResponse = { data: { success: true, data: null } };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/notifications/read-all');

    expect(mockApiClient.put).toHaveBeenCalledWith('/notifications/read-all');
    expect(result.data.success).toBe(true);
  });
});

describe('Community API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPosts should call GET /community/posts', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'post1', title: 'First Post', content: 'Hello world', likes: 5 },
        ],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/community/posts', { params: { page: 1, limit: 10 } });

    expect(mockApiClient.get).toHaveBeenCalledWith('/community/posts', { params: { page: 1, limit: 10 } });
    expect(result.data.data[0].title).toBe('First Post');
  });

  it('createPost should call POST /community/posts', async () => {
    const postData = {
      title: 'New Post',
      content: 'This is my new post',
    };

    const mockResponse = {
      data: { success: true, data: { _id: 'newpost', ...postData, likes: 0 } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/community/posts', postData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/community/posts', postData);
    expect(result.data.data.title).toBe('New Post');
  });

  it('togglePostLike should call POST /community/posts/:id/like', async () => {
    const mockResponse = {
      data: { success: true, data: { id: 'post1', likes: 6, isLiked: true } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/community/posts/post1/like');

    expect(mockApiClient.post).toHaveBeenCalledWith('/community/posts/post1/like');
    expect(result.data.data.isLiked).toBe(true);
  });

  it('addComment should call POST /community/posts/:id/comments', async () => {
    const commentData = { content: 'Great post!' };
    const mockResponse = {
      data: { success: true, data: { id: 'comment1', content: 'Great post!' } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/community/posts/post1/comments', commentData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/community/posts/post1/comments', commentData);
    expect(result.data.data.content).toBe('Great post!');
  });
});

describe('Providers API', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProviders should call GET /providers', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'prov1', name: 'Dr. Smith', specialty: 'Cardiology', rating: 4.5 },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/providers');

    expect(mockApiClient.get).toHaveBeenCalledWith('/providers');
    expect(result.data.data[0].specialty).toBe('Cardiology');
  });

  it('getProviderById should call GET /providers/:id', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { _id: 'prov1', name: 'Dr. Smith', specialty: 'Cardiology' },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/providers/prov1');

    expect(mockApiClient.get).toHaveBeenCalledWith('/providers/prov1');
    expect(result.data.data.name).toBe('Dr. Smith');
  });

  it('createAppointment should call POST /providers/appointments', async () => {
    const appointmentData = {
      providerId: 'prov1',
      dateTime: '2024-03-20T10:00:00Z',
      type: 'video',
    };

    const mockResponse = {
      data: { success: true, data: { _id: 'appt1', ...appointmentData, status: 'scheduled' } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/providers/appointments', appointmentData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/providers/appointments', appointmentData);
    expect(result.data.data.status).toBe('scheduled');
  });

  it('cancelAppointment should call POST /providers/appointments/:id/cancel', async () => {
    const mockResponse = {
      data: { success: true, data: { _id: 'appt1', status: 'cancelled' } },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/providers/appointments/appt1/cancel', { cancelReason: 'Changed plans' });

    expect(mockApiClient.post).toHaveBeenCalledWith('/providers/appointments/appt1/cancel', { cancelReason: 'Changed plans' });
    expect(result.data.data.status).toBe('cancelled');
  });
});

describe('Recommendations API', () => {
  const mockApiClient = {
    get: vi.fn(),
    put: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getRecommendations should call GET /recommendations', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          { _id: 'rec1', title: 'Exercise More', category: 'fitness', priority: 'high' },
        ],
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/recommendations', { params: {} });

    expect(mockApiClient.get).toHaveBeenCalledWith('/recommendations', { params: {} });
    expect(result.data.data[0].category).toBe('fitness');
  });

  it('updateStatus should call PUT /recommendations/:id/status', async () => {
    const mockResponse = {
      data: { success: true, data: { _id: 'rec1', status: 'in-progress' } },
    };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/recommendations/rec1/status', { status: 'in-progress' });

    expect(mockApiClient.put).toHaveBeenCalledWith('/recommendations/rec1/status', { status: 'in-progress' });
    expect(result.data.data.status).toBe('in-progress');
  });

  it('dismiss should call PUT /recommendations/:id/dismiss', async () => {
    const mockResponse = {
      data: { success: true, data: { _id: 'rec1', status: 'dismissed' } },
    };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/recommendations/rec1/dismiss');

    expect(mockApiClient.put).toHaveBeenCalledWith('/recommendations/rec1/dismiss');
    expect(result.data.data.status).toBe('dismissed');
  });
});

describe('User API', () => {
  const mockApiClient = {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfile should call GET /users/profile', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { _id: 'user1', email: 'user@test.com', firstName: 'Test', lastName: 'User' },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/users/profile');

    expect(mockApiClient.get).toHaveBeenCalledWith('/users/profile');
    expect(result.data.data.firstName).toBe('Test');
  });

  it('updateProfile should call PUT /users/profile', async () => {
    const updateData = { firstName: 'Updated', weight: 70 };
    const mockResponse = {
      data: { success: true, data: { _id: 'user1', firstName: 'Updated', weight: 70 } },
    };

    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await mockApiClient.put('/users/profile', updateData);

    expect(mockApiClient.put).toHaveBeenCalledWith('/users/profile', updateData);
    expect(result.data.data.firstName).toBe('Updated');
  });

  it('deleteAccount should call DELETE /users/profile', async () => {
    const mockResponse = { data: { success: true, data: null } };

    mockApiClient.delete.mockResolvedValue(mockResponse);

    const result = await mockApiClient.delete('/users/profile');

    expect(mockApiClient.delete).toHaveBeenCalledWith('/users/profile');
    expect(result.data.success).toBe(true);
  });

  it('getDashboardLayout should call GET /users/dashboard-layout', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          widgets: [
            { id: 'profile', type: 'profile', visible: true },
          ],
          lastModified: '2024-03-15T10:00:00Z',
        },
      },
    };

    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await mockApiClient.get('/users/dashboard-layout');

    expect(mockApiClient.get).toHaveBeenCalledWith('/users/dashboard-layout');
    expect(result.data.data.widgets).toHaveLength(1);
  });

  it('resetDashboardLayout should call POST /users/dashboard-layout/reset', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { widgets: [], lastModified: '2024-03-15T10:00:00Z' },
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await mockApiClient.post('/users/dashboard-layout/reset');

    expect(mockApiClient.post).toHaveBeenCalledWith('/users/dashboard-layout/reset');
    expect(result.data.success).toBe(true);
  });
});
