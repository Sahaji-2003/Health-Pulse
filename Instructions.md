# Health Pulse - Capstone Project

## Project Overview

Health Pulse is a cutting-edge web application designed to help users track fitness activities, monitor vital signs, and receive personalized health recommendations. This production-grade application empowers individuals to take charge of their health and wellness.

## Technology Stack

### Backend
- **Database**: MongoDB
- **ODM**: Mongoose
- **Framework**: Express.js
- **Runtime**: Node.js
- **Language**: TypeScript
- **Validation**: Zod
- **Architecture**: RESTful API with proper MVC structure

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material UI 3
- **Design**: Figma-based implementation
- **State Management**: React Query (TanStack Query)

### Testing
- **Component Testing**: Vitest
- **E2E Testing**: Playwright

## Project Structure

```
health-pulse/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── fitness.controller.ts
│   │   │   ├── vitals.controller.ts
│   │   │   └── recommendations.controller.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   ├── Fitness.model.ts
│   │   │   ├── Vitals.model.ts
│   │   │   └── Recommendation.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── fitness.routes.ts
│   │   │   ├── vitals.routes.ts
│   │   │   └── recommendations.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── recommendation.service.ts
│   │   ├── utils/
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── atoms/
│   │   │   │   ├── molecules/
│   │   │   │   └── organisms/
│   │   │   └── layout/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Fitness.tsx
│   │   │   ├── Vitals.tsx
│   │   │   └── Resources.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFitness.ts
│   │   │   └── useVitals.ts
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── auth.api.ts
│   │   │   │   ├── user.api.ts
│   │   │   │   ├── fitness.api.ts
│   │   │   │   ├── vitals.api.ts
│   │   │   │   └── recommendations.api.ts
│   │   │   ├── apiBuilder.ts
│   │   │   └── apiExecutor.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── tests/
│   ├── e2e/
│   │   └── playwright.config.ts
│   └── components/
│       └── vitest.config.ts
└── README.md
```

## User Stories & Features

### 1. User Profile Creation and Management
- Personal information management (name, age, gender, height, weight, medical conditions)
- Profile editing and validation
- Health app data import (currently not to be implemented)
- Duplicate prevention

### 2. Fitness Activity Logging and Monitoring
- Workout logging (running, cycling, gym workouts)
- Goal setting and progress tracking
- Workout history with filtering
- Calorie calculation

### 3. Vital Signs Entry and Alerts
- Manual vital signs entry (blood pressure, heart rate, weight)
- Device integration for data import (currently not to be implemented)
- Measurement reminders
- Abnormal value alerts
- Historical data visualization

### 4. Personalized Health Recommendations
- AI-driven recommendations based on user profile (use seed or dummy random data)
- Recommendation filtering and categorization
- Progress tracking for recommendations
- Conflict detection with medical history 

### 5. Educational Resources Library
- Searchable resource library (articles, videos, podcasts)
- Personal library for saved resources
- Discussion forums
- Rating and review system

### 6. Healthcare Provider & Insurance Connectivity
- Provider/insurer directory (seed data)
- Appointment scheduling
- Secure messaging and video chat (normal chatting (use dummy chat responses currently), for video chat give the google meet link and mark calender)
- Health data sharing with consent (dummy or seed data)

### 7. Health & Wellness Dashboard
- Comprehensive health overview
- Customizable dashboard layout
- Progress visualization
- Alert system for abnormal metrics
- Gamification elements

## Development Guidelines

### Code Quality Requirements
- Clean, maintainable, and well-documented code
- No spelling or grammatical errors
- Proper TypeScript typing throughout
- Comprehensive error handling
- Form validation with Zod schemas

### Version Control
- Git for all code management
- Minimum one commit per team member daily
- Feature branch workflow
- Descriptive commit messages

### Frontend Component Structure
- **Atoms**: Contains the smallest elements like buttons, labels, icons and their variants
- **Molecules**: Contains bigger elements made from groups of atoms
- **Organisms**: Contains entire parts of components

### UI/UX Requirements
- Implement Figma design specifications
- Material Design 3 system compliance
- Uniform color theme and styling
- Web accessibility (WCAG 2.1 AA compliance)
- Responsive design for all devices

### Testing Strategy
- Component testing with Vitest
- E2E testing with Playwright
- API endpoint testing
- Accessibility testing
- Performance testing

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Testing Setup
```bash
# Component tests
npm run test

# E2E tests
npx playwright install
npm run test:e2e
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthpulse
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Health Pulse
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Fitness Activities
- `GET /api/fitness/activities` - Get user activities
- `POST /api/fitness/activities` - Log new activity
- `PUT /api/fitness/activities/:id` - Update activity
- `DELETE /api/fitness/activities/:id` - Delete activity

### Vital Signs
- `GET /api/vitals` - Get vital signs history
- `POST /api/vitals` - Add vital signs entry
- `PUT /api/vitals/:id` - Update vital signs
- `DELETE /api/vitals/:id` - Delete vital signs

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `PUT /api/recommendations/:id/status` - Update recommendation status

## Deployment Considerations

### Production Requirements
- Environment-specific configurations
- Database optimization and indexing
- API rate limiting
- Security headers and CORS configuration
- SSL/TLS encryption
- Error logging and monitoring
- Performance optimization
- CDN integration for static assets

### Scalability Features
- Database connection pooling
- Caching strategies (Redis)
- Load balancing considerations
- Microservices architecture potential
- API versioning strategy

## Contributing Guidelines

1. Follow the established code structure
2. Write comprehensive tests for new features
3. Ensure accessibility compliance
4. Update documentation for API changes
5. Follow TypeScript best practices
6. Implement proper error handling
7. Validate all user inputs
8. Maintain consistent code formatting

## License

This project is developed as part of a capstone project for educational purposes.