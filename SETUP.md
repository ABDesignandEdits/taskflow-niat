# TaskFlow Setup & Deployment Guide

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Deployment](#deployment)

---

## Local Development Setup

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** for version control
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

### Step 1: Clone the Repository

```bash
cd your-projects-folder
git clone <repository-url>
cd TaskFlow
```

### Step 2: Supabase Configuration

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - **Project Name**: TaskFlow (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Select closest to you
4. Click "Create new project" and wait 1-2 minutes

#### Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. You should see success messages for each table

#### Get Your Credentials

1. Go to **Settings > API**
2. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ IMPORTANT:** Never share these credentials publicly!

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### Step 3: Start Backend Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║       TaskFlow Backend Server Started       ║
╠════════════════════════════════════════════╣
║  Port: 5000                                  ║
║  Environment: development                   ║
║  API: http://localhost:5000/api             ║
╚════════════════════════════════════════════╝
```

Test the backend:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "TaskFlow API is running",
  "timestamp": "2026-09-28T07:39:58.203Z"
}
```

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 247 ms

  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173/ in your browser!

---

## Running the Application

### Terminal Setup (Recommended)

Open **3 separate terminal windows**:

#### Terminal 1: Backend
```bash
cd TaskFlow/backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd TaskFlow/frontend
npm run dev
```

#### Terminal 3: Optional - Monitoring
```bash
# You can use this to check API responses
curl http://localhost:5000/health
```

### Now You Can:
1. Open http://localhost:5173/
2. Click "Get Started" or "Sign Up"
3. Create an account
4. Start adding tasks!

---

## API Reference

All API endpoints require `Authorization: Bearer <token>` header (except auth endpoints)

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id", "email", "name" },
    "token": "eyJhbGc..."
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Tasks

#### Get All Tasks
```bash
GET /api/tasks?status=pending&priority=high
Authorization: Bearer <token>

Query Parameters:
- status: pending, in_progress, completed, cancelled
- priority: low, medium, high, urgent
- category_id: UUID
- sort_by: created_at, due_date, priority
- sort_order: asc, desc
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Physics Assignment",
  "description": "Due Monday morning",
  "category_id": "uuid...",
  "priority": "high",
  "due_date": "2026-09-29",
  "due_time": "09:00",
  "estimated_minutes": 120,
  "subtasks": [
    { "title": "Read chapter 5" },
    { "title": "Solve problems" }
  ]
}
```

#### Complete Task
```bash
PATCH /api/tasks/:id/complete
Authorization: Bearer <token>

Updates task status to "completed" and records completion time
```

#### Update Task
```bash
PUT /api/tasks/:id
Authorization: Bearer <token>

{
  "title": "New title",
  "status": "in_progress"
}
```

#### Delete Task
```bash
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Search Tasks
```bash
GET /api/tasks/search?q=physics
Authorization: Bearer <token>
```

### Categories

#### Get All Categories
```bash
GET /api/categories
Authorization: Bearer <token>
```

#### Create Category
```bash
POST /api/categories
Authorization: Bearer <token>

{
  "name": "Physics",
  "color": "#FF6B6B",
  "icon": "book",
  "description": "Physics assignments"
}
```

### Goals

#### Get All Goals
```bash
GET /api/goals
Authorization: Bearer <token>
```

#### Create Goal
```bash
POST /api/goals
Authorization: Bearer <token>

{
  "title": "Learn JavaScript",
  "description": "Complete ES6 course",
  "target_date": "2026-12-31",
  "progress": 0,
  "status": "active"
}
```

#### Update Goal Progress
```bash
PATCH /api/goals/:id/progress
Authorization: Bearer <token>

{
  "progress": 50
}
```

### Analytics

#### Get Dashboard Data
```bash
GET /api/analytics/dashboard
Authorization: Bearer <token>

Returns:
{
  "overview": { "total", "completed", "pending", "overdue", "completionRate" },
  "weekly": [ { "day", "count" }, ... ],
  "categories": [ { "name", "percentage" }, ... ],
  "streak": 5,
  "score": { "score": 85, "breakdown": {...} },
  "insights": [ "string insights..." ],
  "today": { "dueToday", "completedToday" }
}
```

---

## Troubleshooting

### Backend Issues

#### Port 5000 Already in Use
```bash
# Kill the process using port 5000
# On Mac/Linux:
lsof -i :5000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Supabase Connection Error
```
Error: Missing Supabase configuration
```

**Solution:**
- Check `.env` file has both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Ensure values don't have extra spaces
- Verify credentials in Supabase dashboard

#### JWT Token Error
```
Invalid authentication token
```

**Solution:**
- Regenerate a new token by logging in again
- Clear browser localStorage: `localStorage.clear()`
- Check `JWT_SECRET` is consistent

### Frontend Issues

#### Cannot connect to API
```
GET http://localhost:5000/api/... 404 (Not Found)
```

**Solution:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Check CORS is enabled in backend

#### Tasks not loading
**Solution:**
- Check network tab in DevTools
- Verify JWT token is being sent
- Check browser console for errors

#### Theme not persisting
**Solution:**
- Clear browser storage: `localStorage.clear()`
- Check if cookies are enabled

---

## Deployment

### Deploy Backend (Vercel, Railway, Render)

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# In backend folder
vercel

# Follow prompts, set environment variables in Vercel dashboard
```

#### Option 2: Railway

1. Push code to GitHub
2. Connect GitHub to Railway
3. Create new project
4. Add environment variables
5. Deploy

#### Option 3: Render

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm run start`
5. Add environment variables

### Deploy Frontend (Vercel, Netlify)

#### Option 1: Vercel

```bash
cd frontend
vercel
```

#### Option 2: Netlify

1. Build locally: `npm run build`
2. Deploy `dist` folder
3. Set `VITE_API_URL` environment variable

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Update `CLIENT_URL` in backend `.env`
- [ ] Update `VITE_API_URL` in frontend `.env`
- [ ] Test all authentication flows
- [ ] Test with production Supabase URL
- [ ] Enable password reset flow (optional)
- [ ] Set up error logging (optional)
- [ ] Configure rate limiting

---

## Database Maintenance

### Backup Your Data

```bash
# Export from Supabase dashboard
# Settings > Database > Backups
```

### Reset Database (Development Only)

1. Go to Supabase Settings > Danger Zone
2. Click "Reset Database"
3. Re-run schema.sql

### Monitor Usage

- Go to **Analytics** in Supabase
- Check disk usage, API calls, etc.
- Free tier includes up to 500MB database

---

## Performance Tips

1. **Optimize Images**: Use WebP format where possible
2. **Lazy Load Components**: Use React.lazy() for pages
3. **Database Indexes**: Already included in schema.sql
4. **Cache API Responses**: Implement service worker (future)
5. **Pagination**: Add to task lists for large datasets

---

## Getting Help

1. Check [README.md](../README.md) for feature overview
2. Review API responses in browser DevTools
3. Check backend logs in terminal
4. Check Supabase SQL error messages
5. Enable verbose logging: `DEBUG=taskflow:*`

---

**Happy Coding! 🚀**