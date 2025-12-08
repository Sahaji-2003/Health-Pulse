# Health Pulse Backend API

A comprehensive RESTful API backend for the Health Pulse application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 User authentication and authorization with JWT
- 👤 User profile management
- 🏃‍♂️ Fitness activity tracking
- ❤️ Vital signs monitoring with abnormal value detection
- 💡 AI-generated personalized health recommendations
- 📚 Educational resources library with ratings
- 🏥 Healthcare provider directory
- 📅 Appointment scheduling with video meeting links
- ✅ Input validation with Zod
- 🛡️ Security with Helmet and CORS
- ⚡ Rate limiting for API protection
- 📊 Pagination support for list endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs
- **Utilities**: dotenv, compression, morgan

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utilities and validators
│   ├── types/           # TypeScript type definitions
│   ├── scripts/         # Database seed scripts
│   └── app.ts           # Application entry point
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthpulse
   JWT_SECRET=your_jwt_secret_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Make sure MongoDB is running**:
   ```bash
   # If using local MongoDB
   mongod
   ```

## Usage

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot-reloading enabled.

### Production Build

```bash
npm run build
npm start
```

### Seed Database

Populate the database with sample resources and providers:

```bash
npx ts-node src/scripts/seed.ts
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile

### User Profile (`/api/users`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account

### Fitness Activities (`/api/fitness`)

- `GET /activities` - Get user's fitness activities (with filters)
- `POST /activities` - Log new activity
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity

### Vital Signs (`/api/vitals`)

- `GET /` - Get vital signs history (with filters)
- `POST /` - Record new vital signs
- `PUT /:id` - Update vital signs
- `DELETE /:id` - Delete vital signs record

### Recommendations (`/api/recommendations`)

- `GET /` - Get personalized recommendations
- `PUT /:id/status` - Update recommendation status

### Resources (`/api/resources`)

- `GET /` - Get educational resources (public)
- `GET /:id` - Get resource by ID (public)
- `POST /:id/save` - Save resource to library
- `GET /saved/list` - Get saved resources
- `POST /:id/rate` - Rate and review a resource

### Providers (`/api/providers`)

- `GET /` - Get healthcare providers (public)
- `GET /:id` - Get provider by ID (public)
- `POST /appointments` - Schedule appointment
- `GET /appointments/list` - Get user's appointments
- `PUT /appointments/:id` - Update appointment
- `POST /appointments/:id/cancel` - Cancel appointment

## Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Log Fitness Activity

```bash
POST /api/fitness/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "running",
  "duration": 30,
  "distance": 5,
  "intensity": "medium",
  "notes": "Morning run in the park"
}
```

### Record Vital Signs

```bash
POST /api/vitals
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "heartRate": 72,
  "weight": 70,
  "temperature": 36.6
}
```

## Features in Detail

### Abnormal Vital Signs Detection

The system automatically detects abnormal vital signs values:
- Blood Pressure: Systolic >140 or <90, Diastolic >90 or <60
- Heart Rate: >100 or <60 bpm
- Temperature: >37.5°C or <36°C
- Blood Sugar: >140 or <70 mg/dL
- Oxygen Saturation: <95%

### AI-Generated Recommendations

The system generates personalized health recommendations based on:
- User profile data
- Medical conditions
- Fitness activities
- Vital signs history

Recommendations include conflict detection with medical history.

### Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- CORS configuration
- Input validation with Zod

### Pagination

All list endpoints support pagination:
```
GET /api/fitness/activities?page=1&limit=10&sortBy=date&sortOrder=desc
```

## Error Handling

All errors return consistent JSON responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## Database Models

- **User**: User accounts and profiles
- **FitnessActivity**: Workout and activity logs
- **VitalSigns**: Health metrics tracking
- **Recommendation**: Personalized health recommendations
- **Resource**: Educational content library
- **SavedResource**: User's saved resources
- **Provider**: Healthcare provider directory
- **Appointment**: Appointment scheduling

## Development Guidelines

1. Follow TypeScript best practices
2. Use async/await for asynchronous operations
3. Implement proper error handling
4. Validate all inputs with Zod schemas
5. Add JSDoc comments for complex functions
6. Keep controllers thin, move logic to services
7. Use meaningful variable and function names

## Testing

Currently, the project structure supports testing. To add tests:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create test files alongside source files with `.test.ts` extension.

## License

This project is part of a capstone project for educational purposes.
