import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Load environment variables
dotenv.config();

// Import utilities
// amazonq-ignore-next-line
import { connectDatabase } from './utils/database';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import fitnessRoutes from './routes/fitness.routes';
import vitalsRoutes from './routes/vitals.routes';
import recommendationsRoutes from './routes/recommendations.routes';
import resourcesRoutes from './routes/resources.routes';
import providersRoutes from './routes/providers.routes';
import remindersRoutes from './routes/reminders.routes';
import communityRoutes from './routes/community.routes';
import notificationsRoutes from './routes/notifications.routes';

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware';

// Initialize express app
const app: Application = express();

// Connect to database
connectDatabase().catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// Rate limiting - General API limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // amazonq-ignore-next-line
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for polling)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin access to static files (avatars)
  })
); // Security headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://health-pulse.vercel.app',
        process.env.CORS_ORIGIN, // Custom origin from env
      ].filter(Boolean); // Remove undefined values

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')); // Logging
app.use('/api', limiter); // Apply rate limiting to all API routes

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health Pulse API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationsRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
// amazonq-ignore-next-line
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // amazonq-ignore-next-line
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   Health Pulse API Server Started     ║
    ╠═══════════════════════════════════════╣
    ║   Environment: ${process.env.NODE_ENV?.padEnd(23) || 'development'.padEnd(23)}║
    ║   Port: ${PORT.toString().padEnd(30)}║
    ║   URL:http://localhost:${PORT.toString().padEnd(17)}║
    ╚═══════════════════════════════════════╝
  `);
});

export default app;
