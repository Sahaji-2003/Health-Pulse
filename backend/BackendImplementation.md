# Health Pulse Backend - Complete API Documentation

## Overview

This backend implements all user stories from the Health Pulse capstone project requirements. It provides a production-ready RESTful API with comprehensive features for health and wellness tracking.

## Implemented User Stories

### 1. ✅ User Profile Creation and Management

**Features Implemented:**
- User registration with email/password
- Secure password hashing with bcrypt
- JWT-based authentication
- Profile management (personal info, medical conditions, allergies, medications)
- Emergency contact information
- Duplicate email prevention
- Account deletion

**Endpoints:**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user
- `GET /api/users/profile` - Get detailed profile
- `PUT /api/users/profile` - Update profile information
- `DELETE /api/users/profile` - Delete account

**Validation:**
- Email format validation
- Password minimum length (8 characters)
- Required fields enforcement
- Type validation for all fields

### 2. ✅ Fitness Activity Logging and Monitoring

**Features Implemented:**
- Multiple activity types (running, cycling, gym, swimming, walking, yoga, other)
- Duration and distance tracking
- Calorie calculation support
- Intensity levels (low, medium, high)
- Goal setting (duration, distance, calories)
- Activity history with filtering
- Pagination for activity lists

**Endpoints:**
- `GET /api/fitness/activities` - List activities with filters
- `POST /api/fitness/activities` - Log new activity
- `PUT /api/fitness/activities/:id` - Update activity
- `DELETE /api/fitness/activities/:id` - Delete activity

**Query Parameters:**
- `type` - Filter by activity type
- `startDate` - Filter activities from date
- `endDate` - Filter activities to date
- `page` - Pagination page number
- `limit` - Results per page

### 3. ✅ Vital Signs Entry and Alerts

**Features Implemented:**
- Manual vital signs entry
- Multiple metrics support:
  - Blood pressure (systolic/diastolic)
  - Heart rate
  - Weight
  - Temperature
  - Blood sugar
  - Oxygen saturation
- Automatic abnormal value detection
- Historical data with filtering
- Abnormal value alerts

**Abnormal Value Thresholds:**
- BP Systolic: >140 or <90 mmHg
- BP Diastolic: >90 or <60 mmHg
- Heart Rate: >100 or <60 bpm
- Temperature: >37.5°C or <36°C
- Blood Sugar: >140 or <70 mg/dL
- Oxygen Saturation: <95%

**Endpoints:**
- `GET /api/vitals` - Get vital signs history
- `GET /api/vitals/stats` - Get vitals statistics (averages, trends, alerts)
- `GET /api/vitals/history` - Get formatted vitals history with filtering by vital type
- `POST /api/vitals` - Record new vital signs
- `PUT /api/vitals/:id` - Update vital signs
- `DELETE /api/vitals/:id` - Delete record

**Query Parameters for /api/vitals:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `isAbnormal` - Filter by abnormal flag
- `page` - Pagination
- `limit` - Results per page

**Query Parameters for /api/vitals/stats:**
- `period` - Time period ('week', 'month', 'year')

**Returns:**
- `averageHeartRate` - Average heart rate for the period
- `averageBloodPressure` - Average systolic/diastolic BP
- `averageBloodSugar` - Average blood sugar for the period
- `latestBloodSugar` - Latest blood sugar reading with date info
- `weightTrend` - Last 7 weight readings
- `alertsCount` - Number of abnormal vitals in period

**Query Parameters for /api/vitals/history:**
- `vitalType` - Filter by type: 'heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'weight', 'blood_sugar'
- `startDate` - Filter from date
- `endDate` - Filter to date
- `page` - Pagination
- `limit` - Results per page

### 4. ✅ Personalized Health Recommendations

**Features Implemented:**
- AI-driven recommendations (using seed/dummy data)
- Multiple categories:
  - Fitness
  - Nutrition
  - Mental Health
  - Sleep
  - General
  - Medical
- Priority levels (low, medium, high)
- Status tracking (pending, in-progress, completed, dismissed)
- Progress tracking (0-100%)
- Conflict detection with medical history
- Recommendation filtering

**Recommendation Generation:**
- Automatic generation on first request
- Based on user profile
- Considers medical conditions
- Provides conflict warnings

**Endpoints:**
- `GET /api/recommendations` - Get recommendations with filters
- `PUT /api/recommendations/:id/status` - Update status and progress

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status
- `priority` - Filter by priority

### 5. ✅ Educational Resources Library

**Features Implemented:**
- Multiple resource types (articles, videos, podcasts)
- Searchable library
- Category and tag system
- Rating and review system
- Average rating calculation
- Personal saved resources library
- Seed data for resources

**Endpoints:**
- `GET /api/resources` - Search and browse resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources/:id/save` - Save to personal library
- `GET /api/resources/saved/list` - Get saved resources
- `POST /api/resources/:id/rate` - Rate and review

**Query Parameters:**
- `type` - Filter by type (article/video/podcast)
- `category` - Filter by category
- `search` - Full-text search
- `page` - Pagination
- `limit` - Results per page

### 6. ✅ Healthcare Provider & Insurance Connectivity

**Features Implemented:**
- Provider directory with seed data
- Multiple specialties
- Location-based search
- Insurance acceptance information
- Provider ratings and reviews
- Appointment scheduling
- Appointment types (in-person, video, chat)
- Video chat integration (Google Meet links)
- Appointment status tracking
- Cancellation with reason tracking

**Endpoints:**
- `GET /api/providers` - Search providers
- `GET /api/providers/:id` - Get provider details
- `POST /api/providers/appointments` - Schedule appointment
- `GET /api/providers/appointments/list` - Get user appointments
- `PUT /api/providers/appointments/:id` - Update appointment
- `POST /api/providers/appointments/:id/cancel` - Cancel appointment

**Query Parameters (Providers):**
- `specialty` - Filter by specialty
- `city` - Filter by city
- `search` - Search by name/specialty
- `page` - Pagination
- `limit` - Results per page

**Appointment Features:**
- Automatic Google Meet link generation for video appointments
- Status tracking (scheduled, completed, cancelled, rescheduled)
- Provider availability display
- Multiple insurance acceptance

### 7. ✅ Health & Wellness Dashboard Support

The API provides all necessary endpoints for a comprehensive dashboard:

**Available Data:**
- User profile with medical history
- Fitness activities with trends
- Vital signs with abnormal alerts
- Active recommendations
- Recent appointments
- Health metrics aggregation support

**Dashboard Capabilities:**
- Custom filtering and date ranges
- Pagination for all list endpoints
- Abnormal value alerts
- Progress tracking
- Recommendation status

## Technical Implementation

### Security Features

1. **Authentication & Authorization**
   - JWT-based token authentication
   - Secure password hashing (bcrypt)
   - Token expiration (7 days default)
   - Protected routes with middleware

2. **Input Validation**
   - Zod schema validation
   - Type safety with TypeScript
   - Request body validation
   - Query parameter validation

3. **API Protection**
   - Rate limiting (100 requests/15 minutes)
   - Helmet security headers
   - CORS configuration
   - Request compression

4. **Data Validation**
   - Model-level validation
   - Required field enforcement
   - Min/max value constraints
   - Enum validation
   - Email format validation

### Database Design

**Indexing Strategy:**
- User email (unique index)
- UserId on all user-related collections
- Date fields for time-based queries
- Text indexes for search functionality
- Compound indexes for common queries

**Relationships:**
- One-to-Many: User → Activities, Vitals, Recommendations
- Many-to-Many: Users ↔ Resources (SavedResources)
- Reference: Appointments → Users, Providers

### Error Handling

**Consistent Error Responses:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [/* validation errors */]
}
```

**Error Types Handled:**
- Authentication errors (401)
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Duplicate key errors (400)

### Performance Optimizations

1. **Database Queries**
   - Index utilization
   - Query result limitation
   - Pagination implementation
   - Selective field projection

2. **Response Handling**
   - Gzip compression
   - Efficient JSON serialization
   - Appropriate HTTP status codes

3. **Middleware**
   - Morgan logging
   - Request compression
   - Response caching headers

## Code Quality

### TypeScript Usage
- Strict mode enabled
- No implicit any
- Interface definitions for all models
- Type safety throughout

### Architecture
- MVC pattern implementation
- Service layer for business logic
- Middleware for cross-cutting concerns
- Modular route organization

### Best Practices
- Async/await for async operations
- Error handling in all controllers
- Input validation before processing
- Consistent naming conventions
- Comprehensive documentation

## Deployment Considerations

### Environment Configuration
- Environment-specific settings
- Secure secret management
- Database connection pooling
- Production-ready logging

### Scalability
- Horizontal scaling ready
- Stateless authentication
- Database indexing
- Rate limiting

### Monitoring
- Request logging (Morgan)
- Error logging
- Health check endpoint
- Connection status monitoring

## Testing Recommendations

1. **Unit Tests**
   - Service layer functions
   - Utility functions
   - Validation schemas

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Authentication flow

3. **E2E Tests**
   - Complete user workflows
   - Cross-feature interactions

## Future Enhancements

While the current implementation covers all user stories, potential improvements include:

1. **Advanced Features**
   - Real-time notifications
   - Advanced analytics
   - Data export functionality
   - Multi-language support

2. **Integrations**
   - Health device APIs
   - Email notifications
   - SMS reminders
   - Calendar sync

3. **Performance**
   - Redis caching
   - Database query optimization
   - CDN integration
   - Load balancing

## Updates (December 2, 2025)

- **Fitness Goals Enhancements:**
  - Added API endpoints for creating, updating, and retrieving fitness goals.
  - Integrated duration selection for fitness goals.
  - Updated stat cards to reflect daily goals dynamically.

- **Feedback Mechanism:**
  - Implemented `Snackbar` feedback for goal-saving actions.

- **Bug Fixes:**
  - Resolved issues with stat cards not updating after saving goals.
  - Fixed API integration for duration selection.

## Updates (December 3, 2025)

- **Vitals API Enhancements:**
  - Enhanced `/api/vitals/stats` endpoint to include:
    - `averageBloodSugar` - Average blood sugar reading for the period
    - `latestBloodSugar` - Latest blood sugar reading with `value`, `date`, and `daysAgo` info
  - Enhanced `/api/vitals/history` endpoint to support:
    - `blood_sugar` as a new vital type filter option
  - All vital types now supported: `heart_rate`, `blood_pressure`, `temperature`, `oxygen_saturation`, `weight`, `blood_sugar`

- **Frontend Integration:**
  - Connected VitalsEntrySection form to backend API for saving vitals
  - Added proper API methods for vitals alerts (derived from abnormal vitals)
  - Updated type definitions to include `blood_sugar` vital type

- **Reminders API (NEW):**
  - Complete CRUD implementation for health reminders
  - See "Reminders Management" section below for full details

### 8. ✅ Reminders Management (NEW)

**Features Implemented:**
- Create, read, update, delete reminders
- Multiple reminder categories:
  - Medication
  - Appointment
  - Vitals
  - Exercise
  - Water intake
  - Other
- Flexible frequency options:
  - Daily
  - Weekly (with day selection)
  - Monthly (with day of month)
  - Once
- Push notification toggle
- Active/inactive status
- Upcoming reminders filtering for today
- Time-based sorting

**Endpoints:**
- `GET /api/reminders` - Get all user reminders
- `GET /api/reminders/upcoming` - Get upcoming reminders for today
- `GET /api/reminders/:id` - Get single reminder
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `PATCH /api/reminders/:id/toggle` - Toggle reminder active status
- `DELETE /api/reminders/:id` - Delete reminder

**Query Parameters (GET /api/reminders):**
- `category` - Filter by category
- `isActive` - Filter by active status (true/false)

**Request Body (POST /api/reminders):**
```json
{
  "name": "Take medication",
  "description": "Morning medication",
  "time": "08:00",
  "frequency": "daily",
  "daysOfWeek": [1, 3, 5],
  "dayOfMonth": 15,
  "pushNotification": true,
  "category": "medication"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "name": "Take medication",
    "description": "Morning medication",
    "time": "08:00",
    "frequency": "daily",
    "daysOfWeek": [1, 3, 5],
    "pushNotification": true,
    "isActive": true,
    "category": "medication",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Reminder created successfully"
}

## Updates (December 3, 2025) - Healthcare Provider Messaging

### 9. ✅ Provider Messaging System (NEW)

**Features Implemented:**
- Real-time messaging between users and healthcare providers
- Conversation management (create, list, read)
- Message types: text, image, link
- Read status tracking
- Unread message count
- Auto-reply simulation for demo purposes
- Message history with pagination

**New Models:**
- `Conversation` - Tracks conversations between users and providers
- `Message` - Individual messages within conversations

**Endpoints:**
- `GET /api/providers/messages/conversations` - Get all user's conversations
- `POST /api/providers/messages/conversations` - Create or get existing conversation with a provider
- `GET /api/providers/messages/:conversationId` - Get messages for a conversation
- `POST /api/providers/messages/:conversationId` - Send a message
- `PATCH /api/providers/messages/:conversationId/read` - Mark messages as read

**Request Body (POST /api/providers/messages/conversations):**
```json
{
  "providerId": "provider-id-here"
}
```

**Request Body (POST /api/providers/messages/:conversationId):**
```json
{
  "content": "Hello, I have a question about my medication.",
  "type": "text"
}
```

**Response Format (Conversation):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "providerId": { /* populated provider object */ },
    "lastMessage": "Hello, I have a question...",
    "lastMessageTime": "2025-12-03T10:00:00.000Z",
    "unreadCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response Format (Messages):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "conversationId": "...",
      "senderId": "...",
      "senderType": "user",
      "content": "Hello!",
      "type": "text",
      "isRead": true,
      "createdAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10,
    "pages": 1
  }
}
```

**Auto-Reply Feature:**
- For demo purposes, providers automatically reply to user messages
- Responses are context-aware based on keywords (appointments, medications, symptoms, etc.)
- Simulates real-time interaction without actual provider integration

### Enhanced Provider Data

**Updated Seed Script:**
- 10 healthcare providers with diverse specialties
- Added `description` field to Provider model
- Comprehensive provider information including:
  - Cardiology, General Practitioner, Endocrinology, Neurology
  - Dermatology, Orthopedics, Psychiatry, Gastroenterology
  - Pediatrics, Pulmonology
- Each provider has detailed availability, insurance acceptance, and ratings

**Frontend Integration:**
- Random avatar generation using DiceBear API
- Real-time message updates with polling
- Conversation state management with React Query
- Seamless navigation between provider detail, messaging, and video views

## Updates (December 3, 2025) - Community Forum

### 10. ✅ Community Forum (NEW)

**Features Implemented:**
- Community discussion posts for health-related topics
- Full CRUD operations for posts
- Comment system on posts
- Like/unlike functionality for both posts and comments
- User attribution for posts and comments
- Pagination and sorting support
- Seed data with sample posts and comments

**New Models:**
- `CommunityPost` - Forum posts with title, content, image, likes, and comment count
- `CommunityComment` - Comments on posts with content and likes

**Endpoints:**
- `GET /api/community/posts` - Get all posts with pagination (public, with optional auth for like status)
- `GET /api/community/posts/:id` - Get single post with comments
- `POST /api/community/posts` - Create a new post (requires auth)
- `POST /api/community/posts/:id/like` - Toggle like on a post (requires auth)
- `POST /api/community/posts/:id/comments` - Add a comment to a post (requires auth)
- `POST /api/community/comments/:commentId/like` - Toggle like on a comment (requires auth)
- `DELETE /api/community/posts/:id` - Delete a post (requires auth, owner only)
- `DELETE /api/community/comments/:commentId` - Delete a comment (requires auth, owner only)

**Query Parameters (GET /api/community/posts):**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `sortBy` - Sort by 'createdAt' (default) or 'likes'

**Request Body (POST /api/community/posts):**
```json
{
  "title": "How to manage stress?",
  "content": "I've been feeling stressed lately. What are some tips for managing stress in daily life?",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Request Body (POST /api/community/posts/:id/comments):**
```json
{
  "content": "I recommend trying meditation and regular exercise!"
}
```

**Response Format (Post):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "How to manage stress?",
    "content": "I've been feeling stressed lately...",
    "imageUrl": "https://example.com/image.jpg",
    "author": {
      "id": "...",
      "name": "John Doe",
      "avatar": null
    },
    "createdAt": "2025-12-03T10:00:00.000Z",
    "likes": 15,
    "comments": 5,
    "isLiked": false,
    "commentsList": [
      {
        "id": "...",
        "content": "Great question!",
        "author": {
          "id": "...",
          "name": "Jane Smith",
          "avatar": null
        },
        "createdAt": "2025-12-03T10:05:00.000Z",
        "likes": 3,
        "isLiked": false
      }
    ]
  }
}
```

**Response Format (Posts List):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "How to manage stress?",
      "content": "I've been feeling stressed...",
      "author": { "id": "...", "name": "John Doe" },
      "createdAt": "2025-12-03T10:00:00.000Z",
      "likes": 15,
      "comments": 5,
      "isLiked": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Seed Data:**
- 5 sample users for community interactions
- 6 sample posts covering various health topics:
  - Booking appointments
  - Diabetes management tips
  - Heart health exercises
  - Weight loss journey
  - Mental health resources
  - Sleep tracking
- 20+ sample comments with realistic health discussions
- Pre-set likes on posts and comments

**Frontend Integration:**
- React Query hooks for data fetching and mutations
- Optimistic updates for likes
- Real-time comment submission
- Loading states and error handling

## Conclusion

This backend implementation provides a complete, production-ready API that fulfills all requirements specified in the Health Pulse capstone project. It demonstrates:

- Clean, maintainable code architecture
- Comprehensive error handling
- Security best practices
- Proper validation and type safety
- Scalable design patterns
- Professional documentation

The API is ready for frontend integration and can support all the features outlined in the project requirements.
