# 💓 Health Pulse - Personal Health & Wellness Tracker

A cutting-edge web application designed to help users track fitness activities, monitor vital signs, and receive personalized health recommendations. 🏃‍♂️💪📊

## 🚀 Quick Start

### 📋 Prerequisites
- 🟢 Node.js (v18 or higher)
- 🍃 MongoDB (v5.0 or higher)
- 🔧 Git

### ⚙️ Installation

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd health_pulse
   ```

2. **🔧 Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthpulse
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=7d
   ```

3. **🎨 Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Health Pulse
   ```

4. **🍃 Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **🚀 Run the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **🌐 Access the Application**
   - 🎨 Frontend: http://localhost:5173
   - ⚡ Backend API: http://localhost:5000/api

## 🛠️ Technology Stack

### 🔧 Backend
- **⚡ Runtime**: Node.js with TypeScript
- **🚀 Framework**: Express.js
- **🍃 Database**: MongoDB with Mongoose ODM
- **✅ Validation**: Zod schemas
- **🔐 Authentication**: JWT tokens

### 🎨 Frontend
- **⚛️ Framework**: React 18 with TypeScript
- **⚡ Build Tool**: Vite
- **🎨 Styling**: Tailwind CSS + Material UI 3
- **📊 State Management**: React Query (TanStack Query)

### 🧪 Testing
- **🔬 Component Testing**: Vitest
- **🎭 E2E Testing**: Playwright

## 📁 Project Structure

```
💓 health_pulse/
├── 🔧 backend/
│   ├── 📁 src/
│   │   ├── 🎮 controllers/     # Route handlers
│   │   ├── 📊 models/         # Database models
│   │   ├── 🛣️ routes/         # API routes
│   │   ├── 🔒 middleware/     # Custom middleware
│   │   ├── ⚙️ services/       # Business logic
│   │   ├── 🛠️ utils/          # Helper functions
│   │   └── 📝 types/          # TypeScript types
│   └── 📦 package.json
├── 🎨 frontend/
│   ├── 📁 src/
│   │   ├── 🧩 components/     # React components
│   │   │   └── 🎨 ui/         # Atomic design structure
│   │   ├── 📄 pages/          # Page components
│   │   ├── 🪝 hooks/          # Custom React hooks
│   │   ├── 🌐 services/       # API services
│   │   └── 📝 types/          # TypeScript types
│   └── 📦 package.json
└── 🧪 tests/                  # Test files
```

## 🧪 Testing

### 🔬 Component Tests
```bash
cd frontend
npm run test
```

### 🎭 E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

## 🔧 Development Scripts

### 🔧 Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
```

### 🎨 Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run component tests
npm run test:e2e     # Run E2E tests
```

## 📊 Features

### 🎯 Core Functionality
- **👤 User Profile Management**: Personal information, health data import
- **🏃‍♂️ Fitness Activity Tracking**: Workout logging, goal setting, progress monitoring
- **💓 Vital Signs Monitoring**: Blood pressure, heart rate, weight tracking with alerts
- **🤖 Health Recommendations**: AI-driven personalized suggestions
- **📚 Educational Resources**: Searchable library of health content
- **🏥 Healthcare Connectivity**: Provider directory, appointment scheduling
- **📊 Dashboard**: Comprehensive health overview with visualizations

### ⚡ Technical Features
- 🌐 RESTful API with proper MVC architecture
- 📝 TypeScript throughout the stack
- 📱 Responsive design with Material Design 3
- ⚡ Real-time data updates
- 🔐 Secure authentication with JWT
- ✅ Form validation with Zod schemas
- 🚨 Error handling and logging

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - 📝 User registration
- `POST /api/auth/login` - 🔑 User login
- `GET /api/auth/me` - 👤 Get current user

### 👤 User Profile
- `GET /api/users/profile` - 📋 Get user profile
- `PUT /api/users/profile` - ✏️ Update user profile

### 🏃‍♂️ Fitness Activities
- `GET /api/fitness/activities` - 📋 Get activities
- `POST /api/fitness/activities` - ➕ Log new activity
- `PUT /api/fitness/activities/:id` - ✏️ Update activity

### 💓 Vital Signs
- `GET /api/vitals` - 📊 Get vital signs history
- `POST /api/vitals` - ➕ Add vital signs entry

### 🤖 Recommendations
- `GET /api/recommendations` - 💡 Get personalized recommendations

## 🚀 Deployment

### 🌍 Environment Setup
1. ⚙️ Set `NODE_ENV=production`
2. 🍃 Configure production MongoDB URI
3. 🔐 Set secure JWT secret
4. 🔒 Enable SSL/TLS
5. 🌐 Configure CORS for production domains

### 🏭 Production Considerations
- 📊 Database indexing and optimization
- 🚦 API rate limiting
- 📝 Error logging and monitoring
- 🌐 CDN integration for static assets
- ⚖️ Load balancing for scalability

## 🤝 Contributing

1. 📁 Follow the established project structure
2. 🧪 Write comprehensive tests for new features
3. 📝 Ensure TypeScript compliance
4. 🚨 Implement proper error handling
5. ✅ Validate all user inputs
6. ♿ Maintain accessibility standards (WCAG 2.1 AA)
7. 📚 Update documentation for API changes

## 📄 License

This project is developed as part of a capstone project for educational purposes. 🎓

## 🆘 Troubleshooting

### ⚠️ Common Issues

**🍃 MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongosh
# If not running, start MongoDB service
```

**🔌 Port Already in Use**
```bash
# Kill process on port 5000
npx kill-port 5000
# Or change PORT in .env file
```

**📦 Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 💬 Support
For issues and questions, please check the project documentation or create an issue in the repository. 🤝