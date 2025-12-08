# Health Pulse Backend - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher) - either local or MongoDB Atlas

## Step-by-Step Setup

### 1. Navigate to Backend Directory

```powershell
cd "c:\Users\sahaji.chaurasia\Desktop\Capstone Project\health_pulse\backend"
```

### 2. Install Dependencies

```powershell
npm install
```

This will install all required packages including:
- Express.js
- Mongoose
- TypeScript
- JWT libraries
- Zod validation
- Security packages

### 3. Setup Environment Variables

Create a `.env` file in the backend directory:

```powershell
New-Item -Path .env -ItemType File
```

Add the following content to `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthpulse
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Important:** Change the `JWT_SECRET` to a strong, random value in production.

### 4. Start MongoDB

#### Option A: Local MongoDB
```powershell
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` with your connection string

### 5. Seed Database (Optional)

Populate the database with sample data:

```powershell
npm run seed
```

This will add:
- 5 sample educational resources (articles, videos, podcasts)
- 5 healthcare providers with different specialties

### 6. Start Development Server

```powershell
npm run dev
```

You should see output like:
```
Connected to MongoDB
╔═══════════════════════════════════════╗
║   Health Pulse API Server Started    ║
╠═══════════════════════════════════════╣
║   Environment: development           ║
║   Port: 5000                         ║
║   URL: http://localhost:5000         ║
╚═══════════════════════════════════════╝
```

### 7. Test the API

#### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
```

#### Register a User
```powershell
$body = @{
    email = "test@example.com"
    password = "Test1234"
    firstName = "John"
    lastName = "Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

#### Login
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "iug"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

#### Get User Profile (Authenticated)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" -Method Get -Headers $headers
```

## Common Commands

### Development
```powershell
npm run dev        # Start with hot-reload
```

### Production
```powershell
npm run build      # Compile TypeScript
npm start          # Run compiled code
```

### Database
```powershell
npm run seed       # Seed database with sample data
```

## Testing Endpoints with PowerShell

### Create Fitness Activity
```powershell
$activityBody = @{
    type = "running"
    duration = 30
    distance = 5
    intensity = "medium"
    notes = "Morning run"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/fitness/activities" -Method Post -Body $activityBody -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"}
```

### Record Vital Signs
```powershell
$vitalsBody = @{
    bloodPressureSystolic = 120
    bloodPressureDiastolic = 80
    heartRate = 72
    weight = 70
    temperature = 36.6
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/vitals" -Method Post -Body $vitalsBody -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"}
```

### Get Recommendations
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/recommendations" -Method Get -Headers @{"Authorization"="Bearer $token"}
```

### Browse Resources
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/resources?type=article" -Method Get
```

### Search Providers
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/providers?specialty=Cardiology" -Method Get
```

## Troubleshooting

### MongoDB Connection Error
**Problem:** `Error connecting to MongoDB`
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is listening on port 27017

### Port Already in Use
**Problem:** `Port 5000 is already in use`
**Solution:**
- Change `PORT` in `.env` file to another port (e.g., 5001)
- Or stop the process using port 5000

### Module Not Found Errors
**Problem:** TypeScript compilation errors
**Solution:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### JWT Secret Warning
**Problem:** Using default JWT secret
**Solution:**
- Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Update `JWT_SECRET` in `.env`

## API Documentation

Full API documentation is available in:
- `README.md` - General overview
- `BackendImplementation.md` - Detailed implementation guide

## Development Tips

1. **Use Postman or Insomnia** for easier API testing instead of PowerShell
2. **Install MongoDB Compass** for visual database management
3. **Check logs** in the terminal for error messages
4. **Use TypeScript** types for better development experience
5. **Test endpoints** after each feature implementation

## Next Steps

1. ✅ Backend is running
2. 📱 Develop frontend application
3. 🔗 Connect frontend to backend API
4. 🧪 Test all features end-to-end
5. 🚀 Deploy to production

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Update `CORS_ORIGIN` to production URL
- [ ] Set `NODE_ENV` to `production`
- [ ] Use production MongoDB instance
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Implement CI/CD pipeline

## Support

For issues or questions:
1. Check the error logs in terminal
2. Review `README.md` and `BackendImplementation.md`
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

---

**Happy Coding! 🚀**
