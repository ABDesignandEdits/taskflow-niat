import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { config } from './config/env.js';

const app = express();

// 1. Security Headers (configured to allow cross-origin requests)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Dynamic Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5001',
  config.clientUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel and Render deployments (*.vercel.app, *.onrender.com)
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.includes('localhost')) {
      return callback(null, true);
    }

    // Fallback: Allow during development/hackathon deployment
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Explicitly handle preflight OPTIONS for all routes
app.options('*', cors());

// 3. Request Logging & Body Parsing
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Rate Limiting (Protects API from brute force & abuse)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Generous limit for dashboard interactions
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after a few minutes.'
  }
});
app.use('/api', generalLimiter);

// 5. Root & Health Check Endpoints
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

// 6. Mount API Routes under both /api and root /
// This guarantees that BOTH /api/auth/register and /auth/register work without 404
app.use('/api', routes);
app.use('/', routes);

// 7. Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;