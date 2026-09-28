import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { config } from './config/env.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: config.clientUrl || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Request Logging & Body Parsing
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Rate Limiting (Protects API from brute force & abuse)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api', generalLimiter);

// 5. Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    version: '1.0.0',
    description: 'Teenager To-Do & Productivity Tracker Backend REST API',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      categories: '/api/categories',
      goals: '/api/goals',
      analytics: '/api/analytics/overview',
      user: '/api/user'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

// 6. Mount API Routes
app.use('/api', routes);

// 7. Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;