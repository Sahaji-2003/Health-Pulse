# Health Pulse API - Test Collection

This file contains sample API requests for testing all endpoints.

## Setup

1. Base URL: `http://localhost:5000`
2. After login, save the token and use it in Authorization header: `Bearer <token>`

---

## Authentication

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response:** Save the `data.token` for subsequent requests

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## User Profile

### 5. Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### 6. Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "dateOfBirth": "1990-05-15T00:00:00.000Z",
  "gender": "male",
  "height": 175,
  "weight": 70,
  "medicalConditions": ["Hypertension"],
  "allergies": ["Penicillin"],
  "medications": ["Lisinopril 10mg"],
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567890",
    "relationship": "Spouse"
  }
}
```

### 7. Delete Profile
```http
DELETE /api/users/profile
Authorization: Bearer <token>
```

---

## Fitness Activities

### 8. Get Activities
```http
GET /api/fitness/activities?page=1&limit=10
Authorization: Bearer <token>
```

### 9. Get Activities with Filters
```http
GET /api/fitness/activities?type=running&startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z
Authorization: Bearer <token>
```

### 10. Create Activity
```http
POST /api/fitness/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "running",
  "duration": 30,
  "distance": 5,
  "caloriesBurned": 300,
  "intensity": "medium",
  "notes": "Morning run in the park",
  "date": "2024-12-01T07:00:00.000Z",
  "goals": {
    "targetDuration": 45,
    "targetDistance": 7,
    "targetCalories": 400
  }
}
```

### 11. Update Activity
```http
PUT /api/fitness/activities/{activityId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration": 35,
  "distance": 5.5,
  "caloriesBurned": 325,
  "notes": "Updated: Felt great during the run"
}
```

### 12. Delete Activity
```http
DELETE /api/fitness/activities/{activityId}
Authorization: Bearer <token>
```

---

## Vital Signs

### 13. Get Vital Signs
```http
GET /api/vitals?page=1&limit=10
Authorization: Bearer <token>
```

### 14. Get Abnormal Vitals
```http
GET /api/vitals?isAbnormal=true
Authorization: Bearer <token>
```

### 15. Record Vital Signs
```http
POST /api/vitals
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "heartRate": 72,
  "weight": 70,
  "temperature": 36.6,
  "bloodSugar": 95,
  "oxygenSaturation": 98,
  "notes": "Feeling good today",
  "date": "2024-12-01T08:00:00.000Z"
}
```

### 16. Record Abnormal Vitals (for testing alerts)
```http
POST /api/vitals
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodPressureSystolic": 150,
  "bloodPressureDiastolic": 95,
  "heartRate": 105,
  "temperature": 38.2,
  "notes": "Not feeling well"
}
```

### 17. Update Vital Signs
```http
PUT /api/vitals/{vitalId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodPressureSystolic": 118,
  "bloodPressureDiastolic": 78,
  "notes": "Rechecked after rest"
}
```

### 18. Delete Vital Signs
```http
DELETE /api/vitals/{vitalId}
Authorization: Bearer <token>
```

### 18a. Get Vitals Statistics
```http
GET /api/vitals/stats?period=week
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` - Time period: 'week', 'month', or 'year'

**Response includes:**
- `averageHeartRate` - Average heart rate for the period
- `averageBloodPressure` - Object with systolic and diastolic averages
- `averageBloodSugar` - Average blood sugar reading
- `latestBloodSugar` - Latest blood sugar with value, date, and daysAgo
- `weightTrend` - Last 7 weight readings
- `alertsCount` - Number of abnormal vitals in period

### 18b. Get Vitals History (Formatted)
```http
GET /api/vitals/history?vitalType=heart_rate&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `vitalType` - Type of vital to filter: 'heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'weight', 'blood_sugar'
- `startDate` - Filter from date (ISO 8601)
- `endDate` - Filter to date (ISO 8601)
- `page` - Page number
- `limit` - Results per page

**Response:**
Returns formatted data with `id`, `date`, `value`, `unit`, `isAbnormal`, and `notes` for each record.

### 18c. Get Blood Sugar History
```http
GET /api/vitals/history?vitalType=blood_sugar&limit=10
Authorization: Bearer <token>
```

---

## Recommendations

### 19. Get All Recommendations
```http
GET /api/recommendations
Authorization: Bearer <token>
```

### 20. Get Recommendations by Category
```http
GET /api/recommendations?category=fitness
Authorization: Bearer <token>
```

### 21. Get Recommendations by Status
```http
GET /api/recommendations?status=pending&priority=high
Authorization: Bearer <token>
```

### 22. Update Recommendation Status
```http
PUT /api/recommendations/{recommendationId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "progress": 50
}
```

### 23. Complete Recommendation
```http
PUT /api/recommendations/{recommendationId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "progress": 100
}
```

---

## Resources

### 24. Get All Resources
```http
GET /api/resources?page=1&limit=10
```

### 25. Search Resources
```http
GET /api/resources?search=heart&type=article
```

### 26. Filter Resources by Category
```http
GET /api/resources?category=Fitness
```

### 27. Get Resource by ID
```http
GET /api/resources/{resourceId}
```

### 28. Save Resource
```http
POST /api/resources/{resourceId}/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Interesting article to read later"
}
```

### 29. Get Saved Resources
```http
GET /api/resources/saved/list
Authorization: Bearer <token>
```

### 30. Rate Resource
```http
POST /api/resources/{resourceId}/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "review": "Excellent resource! Very informative and helpful."
}
```

---

## Providers & Appointments

### 31. Get All Providers
```http
GET /api/providers?page=1&limit=10
```

### 32. Search Providers by Specialty
```http
GET /api/providers?specialty=Cardiology
```

### 33. Search Providers by Location
```http
GET /api/providers?city=New York
```

### 34. Search Providers (Full Text)
```http
GET /api/providers?search=Anderson
```

### 35. Get Provider by ID
```http
GET /api/providers/{providerId}
```

### 36. Schedule Appointment (In-Person)
```http
POST /api/providers/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": "{providerId}",
  "dateTime": "2024-12-15T10:00:00.000Z",
  "type": "in-person",
  "notes": "Annual checkup"
}
```

### 37. Schedule Video Appointment
```http
POST /api/providers/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": "{providerId}",
  "dateTime": "2024-12-20T14:00:00.000Z",
  "type": "video",
  "notes": "Follow-up consultation"
}
```

**Note:** Response will include a Google Meet link for video appointments

### 38. Get User's Appointments
```http
GET /api/providers/appointments/list?page=1&limit=10
Authorization: Bearer <token>
```

### 39. Get Scheduled Appointments
```http
GET /api/providers/appointments/list?status=scheduled
Authorization: Bearer <token>
```

### 40. Update Appointment
```http
PUT /api/providers/appointments/{appointmentId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "dateTime": "2024-12-15T11:00:00.000Z",
  "notes": "Rescheduled to 11 AM"
}
```

### 41. Cancel Appointment
```http
POST /api/providers/appointments/{appointmentId}/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancelReason": "Schedule conflict"
}
```

---

## Health Check

### 42. API Health Check
```http
GET /health
```

---

## Testing Workflow

### Complete User Journey Test

1. **Register** (Request #1)
2. **Login** (Request #2) → Save token
3. **Update Profile** (Request #6) → Add medical info
4. **Log Fitness Activity** (Request #10)
5. **Record Vital Signs** (Request #15)
6. **Get Recommendations** (Request #19) → Auto-generated
7. **Update Recommendation** (Request #22) → Track progress
8. **Browse Resources** (Request #24)
9. **Save Resource** (Request #28)
10. **Rate Resource** (Request #30)
11. **Search Providers** (Request #32)
12. **Schedule Appointment** (Request #37) → Get meeting link
13. **View Dashboard Data**:
    - Get Profile (Request #5)
    - Get Activities (Request #8)
    - Get Vitals (Request #13)
    - Get Recommendations (Request #19)
    - Get Appointments (Request #38)

---

## Error Testing

### Invalid Email Format
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "Test1234",
  "firstName": "Test",
  "lastName": "User"
}
```
**Expected:** 400 Bad Request with validation error

### Weak Password
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123",
  "firstName": "Test",
  "lastName": "User"
}
```
**Expected:** 400 Bad Request - Password too short

### Unauthorized Access
```http
GET /api/users/profile
```
**Expected:** 401 Unauthorized - No token provided

### Invalid Token
```http
GET /api/users/profile
Authorization: Bearer invalid_token_here
```
**Expected:** 401 Unauthorized - Invalid token

---

## Notes for Testing

1. Replace `{activityId}`, `{vitalId}`, `{recommendationId}`, `{resourceId}`, `{providerId}`, and `{appointmentId}` with actual IDs from responses
2. All dates should be in ISO 8601 format
3. Token expires after 7 days (default)
4. Rate limit: 100 requests per 15 minutes per IP
5. Pagination defaults: page=1, limit=10

---

## Postman Import

To use in Postman:
1. Copy these requests
2. Create a new collection
3. Set base URL as environment variable: `{{baseUrl}} = http://localhost:5000`
4. Set token as environment variable: `{{token}}` after login
5. Use `{{token}}` in Authorization headers

---

**All endpoints tested and working! ✅**

---

### Updates (December 2, 2025)

- **Fitness Goals API Testing:**
  - Added test cases for creating, updating, and retrieving fitness goals.
  - Verified duration selection integration.

- **Snackbar Feedback Testing:**
  - Confirmed feedback mechanism for goal-saving actions.

- **Stat Card Updates:**
  - Tested dynamic updates of stat cards after saving goals.

### Updates (December 3, 2025)

- **Vitals API Enhancements:**
  - Added test cases for `/api/vitals/stats` endpoint with blood sugar data
  - Added test cases for `/api/vitals/history` with blood_sugar vital type filter
  - Documented all query parameters and response formats for vitals endpoints

- **New Vitals Test Cases Added:**
  - 18a: Get Vitals Statistics (includes blood sugar averages)
  - 18b: Get Vitals History with vital type filtering
  - 18c: Get Blood Sugar History specifically

- **Reminders API (NEW):**
  - Full CRUD operations for health reminders
  - See Reminders section below for all test cases

---

## Reminders

### 43. Get All Reminders
```http
GET /api/reminders
Authorization: Bearer <token>
```

### 44. Get Reminders by Category
```http
GET /api/reminders?category=medication
Authorization: Bearer <token>
```

### 45. Get Active Reminders Only
```http
GET /api/reminders?isActive=true
Authorization: Bearer <token>
```

### 46. Get Upcoming Reminders (Today)
```http
GET /api/reminders/upcoming
Authorization: Bearer <token>
```

### 47. Get Single Reminder
```http
GET /api/reminders/{reminderId}
Authorization: Bearer <token>
```

### 48. Create Daily Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Take morning medication",
  "description": "Blood pressure medication",
  "time": "08:00",
  "frequency": "daily",
  "pushNotification": true,
  "category": "medication"
}
```

### 49. Create Weekly Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Weekly blood pressure check",
  "time": "09:00",
  "frequency": "weekly",
  "daysOfWeek": [1, 3, 5],
  "pushNotification": true,
  "category": "vitals"
}
```

### 50. Create Monthly Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly checkup reminder",
  "time": "10:00",
  "frequency": "monthly",
  "dayOfMonth": 15,
  "pushNotification": true,
  "category": "appointment"
}
```

### 51. Create Water Intake Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Drink water",
  "time": "14:00",
  "frequency": "daily",
  "pushNotification": true,
  "category": "water"
}
```

### 52. Create Exercise Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Evening walk",
  "description": "30 minute walk in the park",
  "time": "18:00",
  "frequency": "daily",
  "pushNotification": true,
  "category": "exercise"
}
```

### 53. Update Reminder
```http
PUT /api/reminders/{reminderId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated reminder name",
  "time": "08:30",
  "frequency": "daily",
  "pushNotification": false
}
```

### 54. Toggle Reminder Active Status
```http
PATCH /api/reminders/{reminderId}/toggle
Authorization: Bearer <token>
```

### 55. Delete Reminder
```http
DELETE /api/reminders/{reminderId}
Authorization: Bearer <token>
```

---

## Reminder Categories

Available categories:
- `medication` - Medicine reminders
- `appointment` - Medical appointment reminders
- `vitals` - Vital signs measurement reminders
- `exercise` - Physical activity reminders
- `water` - Hydration reminders
- `other` - Custom reminders

## Reminder Frequencies

- `daily` - Every day at specified time
- `weekly` - Specific days of week (use `daysOfWeek`: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
- `monthly` - Specific day of month (use `dayOfMonth`: 1-31)
- `once` - One-time reminder

---

## Provider Messaging (NEW - December 3, 2025)

### 56. Get All Conversations
```http
GET /api/providers/messages/conversations
Authorization: Bearer <token>
```

**Response:**
Returns list of user's conversations with providers, including last message info.

### 57. Create or Get Conversation
```http
POST /api/providers/messages/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": "{providerId}"
}
```

**Note:** Creates a new conversation if one doesn't exist, or returns the existing conversation.

### 58. Get Messages in Conversation
```http
GET /api/providers/messages/{conversationId}?page=1&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Messages per page (default: 50)

**Response:**
Returns messages in chronological order with pagination.

### 59. Send Message
```http
POST /api/providers/messages/{conversationId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello, I have a question about my medication.",
  "type": "text"
}
```

**Message Types:**
- `text` - Plain text message (default)
- `image` - Image with URL
- `link` - Link with title and description

**For Image Messages:**
```json
{
  "content": "Check out this image",
  "type": "image",
  "imageUrl": "https://example.com/image.jpg"
}
```

**For Link Messages:**
```json
{
  "content": "Read this article",
  "type": "link",
  "linkTitle": "Health Tips",
  "linkDescription": "10 tips for better health"
}
```

### 60. Mark Messages as Read
```http
PATCH /api/providers/messages/{conversationId}/read
Authorization: Bearer <token>
```

**Note:** Marks all messages from the provider as read and resets unread count.

---

## Messaging Test Workflow

1. **Get Provider List** (Request #31)
2. **Create Conversation** (Request #57) with selected provider
3. **Send Initial Message** (Request #59)
4. **Wait for Auto-Reply** (simulated after ~2 seconds)
5. **Get Messages** (Request #58) to see conversation
6. **Mark as Read** (Request #60) to clear unread count
7. **Get Conversations** (Request #56) to see updated list

---

## Auto-Reply Keywords

The demo messaging system responds to these keywords:
- `appointment`, `schedule` - Scheduling information
- `result`, `test` - Test results feedback
- `medication`, `prescription` - Medication guidance
- `pain`, `hurt`, `symptom` - Symptom advice
- `hello`, `hi`, `hey` - Greeting response
- `thank` - Thank you response
- Default - General assistance message

---

## Community Forum (NEW - December 2025)

The Community Forum API allows users to create posts, comment, and interact with the health community. Posts and comments can be liked, and the API supports both authenticated and unauthenticated access for reading.

### 61. Get All Community Posts
```http
GET /api/community/posts?page=1&limit=10
Authorization: Bearer <token> (optional)
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "postId123",
        "title": "Managing Type 2 Diabetes",
        "content": "Hi everyone! I was recently diagnosed...",
        "author": {
          "_id": "userId123",
          "name": "Sarah Johnson",
          "avatar": "/avatars/sarah.jpg"
        },
        "imageUrl": null,
        "likes": 24,
        "commentsCount": 8,
        "isLiked": true,
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 6,
      "pages": 1
    }
  }
}
```

**Note:** `isLiked` is only present when authenticated

### 62. Get Single Community Post (with Comments)
```http
GET /api/community/posts/{postId}
Authorization: Bearer <token> (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "postId123",
    "title": "Managing Type 2 Diabetes",
    "content": "Hi everyone! I was recently diagnosed...",
    "author": {
      "_id": "userId123",
      "name": "Sarah Johnson",
      "avatar": "/avatars/sarah.jpg"
    },
    "imageUrl": null,
    "likes": 24,
    "commentsCount": 8,
    "isLiked": true,
    "createdAt": "2024-12-01T10:00:00.000Z",
    "comments": [
      {
        "_id": "commentId123",
        "content": "Great tips! I've been managing...",
        "author": {
          "_id": "userId456",
          "name": "Michael Chen",
          "avatar": "/avatars/michael.jpg"
        },
        "likes": 5,
        "isLiked": false,
        "createdAt": "2024-12-01T11:30:00.000Z"
      }
    ]
  }
}
```

### 63. Create Community Post
```http
POST /api/community/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tips for Better Sleep Quality",
  "content": "I've been struggling with sleep lately and wanted to share some tips that have helped me...",
  "imageUrl": "https://example.com/sleep-tips.jpg"
}
```

**Required Fields:**
- `title` - Post title (required)
- `content` - Post content (required)

**Optional Fields:**
- `imageUrl` - URL to post image

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "newPostId",
    "title": "Tips for Better Sleep Quality",
    "content": "I've been struggling with sleep lately...",
    "userId": "userId123",
    "likes": 0,
    "likedBy": [],
    "commentsCount": 0,
    "createdAt": "2024-12-01T12:00:00.000Z"
  },
  "message": "Post created successfully"
}
```

### 64. Toggle Like on Post
```http
POST /api/community/posts/{postId}/like
Authorization: Bearer <token>
```

**Response (When Liked):**
```json
{
  "success": true,
  "data": {
    "likes": 25,
    "isLiked": true
  },
  "message": "Post liked"
}
```

**Response (When Unliked):**
```json
{
  "success": true,
  "data": {
    "likes": 24,
    "isLiked": false
  },
  "message": "Post unliked"
}
```

### 65. Add Comment to Post
```http
POST /api/community/posts/{postId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is really helpful! I've been dealing with similar issues and your advice makes a lot of sense."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "newCommentId",
    "postId": "postId123",
    "content": "This is really helpful!...",
    "author": {
      "_id": "userId123",
      "name": "John Doe",
      "avatar": "/avatars/john.jpg"
    },
    "likes": 0,
    "isLiked": false,
    "createdAt": "2024-12-01T13:00:00.000Z"
  },
  "message": "Comment added successfully"
}
```

### 66. Toggle Like on Comment
```http
POST /api/community/comments/{commentId}/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "likes": 6,
    "isLiked": true
  },
  "message": "Comment liked"
}
```

### 67. Delete Post
```http
DELETE /api/community/posts/{postId}
Authorization: Bearer <token>
```

**Note:** Users can only delete their own posts.

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### 68. Delete Comment
```http
DELETE /api/community/comments/{commentId}
Authorization: Bearer <token>
```

**Note:** Users can only delete their own comments.

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Community Forum Test Workflow

1. **Browse Posts** (Request #61) - View all posts without authentication
2. **Login** (Request #2) - Get authentication token
3. **Browse Posts Again** (Request #61) - Now see `isLiked` status
4. **View Single Post** (Request #62) - See full post with comments
5. **Like a Post** (Request #64) - Toggle like on post
6. **Add Comment** (Request #65) - Comment on a post
7. **Like a Comment** (Request #66) - Toggle like on comment
8. **Create New Post** (Request #63) - Create your own post
9. **Delete Comment** (Request #68) - Remove your comment
10. **Delete Post** (Request #67) - Remove your post

---

## Community Forum Seed Data

The seed script creates sample community data:

**Users Created:**
| Email | Name |
|-------|------|
| elmer@example.com | Elmer User |
| sarah@example.com | Sarah Johnson |
| michael@example.com | Michael Chen |
| jane@example.com | Jane Smith |
| john@example.com | John Williams |

**Password for all seed users:** `Test1234`

**Sample Posts:**
1. Managing Type 2 Diabetes - Daily routines and tips
2. Best Morning Exercises for Seniors - Low-impact workout suggestions
3. Heart-Healthy Diet Tips - Nutrition advice
4. Mental Health and Exercise Connection - Wellness discussion
5. Sleep Quality Improvement - Better sleep strategies
6. Staying Hydrated - Water intake recommendations

**Sample Comments:** 20+ comments distributed across posts with pre-populated likes

---

## Community Forum Error Cases

### Post Not Found
```http
GET /api/community/posts/invalidPostId
```
**Expected:** 404 Not Found

### Create Post Without Authentication
```http
POST /api/community/posts
Content-Type: application/json

{
  "title": "Test Post",
  "content": "Test content"
}
```
**Expected:** 401 Unauthorized

### Create Post Without Title
```http
POST /api/community/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Content without title"
}
```
**Expected:** 400 Bad Request - Title is required

### Delete Another User's Post
```http
DELETE /api/community/posts/{anotherUsersPostId}
Authorization: Bearer <token>
```
**Expected:** 403 Forbidden - Not authorized to delete this post
