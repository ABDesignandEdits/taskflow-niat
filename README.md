# 🚀 TaskFlow — Teenager To-Do & Productivity Tracker

> **Turn Your Plans Into Progress.**  
> A full-stack personal productivity, homework, and habit tracking web application designed specifically for teenagers, high school students, and self-learners.

![TaskFlow Hero](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features at a Glance

* **🎯 Dynamic Dashboard:** Time-aware greeting (*Good Morning / Afternoon / Evening*), daily progress meter, metric cards, today's focus tasks, and urgent backlog alerts.
* **📋 Complete Task CRUD:** Create, read, edit, delete, and check off tasks with subtask checklists, priorities (*Low, Medium, High, Urgent*), estimated durations, and tags.
* **⏰ Daily Time Planner:** Structure study sessions with dedicated time blocks:
  * 🌅 **Morning Focus** (06:00 – 12:00)
  * ☀️ **Afternoon Homework** (12:00 – 17:00)
  * 🌙 **Evening Coding & Review** (17:00 – 22:00)
  * ⏳ **Anytime / Floating Tasks**
* **📅 Interactive Calendar:** Monthly grid view with day-specific task counts and quick-schedule agenda panel.
* **🎯 Long-Term Goals:** Set semester targets (*e.g., "Master JavaScript", "Ace Physics Final"*), adjust interactive progress sliders, and earn achievement badges.
* **🔥 Real Habit Streaks:** Consecutive daily completion streaks calculated strictly from actual task submission logs (no fake numbers).
* **📊 Visual Analytics (Recharts):**
  * Weekly Task Completion Bar Chart (last 7 days).
  * Category Distribution Donut Chart.
  * Overall Completion Velocity Ring.
  * Daily Productivity Score breakdown ($0 - 100$ pts) with transparent point allocations.
* **💡 Smart Productivity Suggestions:** Personalized tips generated from actual workload patterns (*e.g., breaking down 60+ min tasks, clearing overdue items*).
* **🌙 Dark & Light Themes:** Modern glassmorphic theme with instant toggle, persisted across sessions.
* **🚀 1-Click Demo Mode:** Instant sample teenager data seeding (*Physics homework, Biology revision, LeetCode algorithms, fitness runs, and semester goals*).

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vite + SPA)                │
│  - React Router DOM  - Recharts  - Lucide Icons - CSS   │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP / REST API (JSON)
                             │  Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────┐
│            Node.js + Express.js REST API                │
│  - MVC Architecture   - Centralized Error Handling      │
│  - Bcrypt Password Hashing  - JWT Authentication        │
│  - Helmet + Rate Limiting  - Input Validation           │
└────────────────────────────┬────────────────────────────┘
                             │  SQL Queries / Client SDK
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Supabase PostgreSQL DB                    │
│  - users, profiles, tasks, categories, subtasks,        │
│    goals, task_completions, reminders                   │
│  - Cascade Deletion + Performance B-Tree Indexes        │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Clean Folder Structure

```
TaskFlow/
├── backend/
│   ├── database/
│   │   └── schema.sql              # Supabase PostgreSQL schema & indexes
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js              # Centralized environment configs
│   │   │   └── supabase.js         # Supabase PostgreSQL connector
│   │   ├── controllers/            # Request handlers (MVC Controller)
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   ├── categoryController.js
│   │   │   ├── goalController.js
│   │   │   ├── analyticsController.js
│   │   │   └── userController.js
│   │   ├── middleware/             # Security & validation middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/                 # Database data access layer (MVC Model)
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   ├── Category.js
│   │   │   ├── Subtask.js
│   │   │   ├── Goal.js
│   │   │   └── TaskCompletion.js
│   │   ├── routes/                 # REST API Route declarations
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── goalRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── index.js
│   │   ├── services/               # Core business & analytics logic
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── categoryService.js
│   │   │   ├── goalService.js
│   │   │   ├── analyticsService.js
│   │   │   └── demoDataService.js
│   │   ├── utils/                  # Helper algorithms
│   │   │   ├── hashUtils.js        # bcrypt hashing
│   │   │   ├── jwtUtils.js         # JWT signing/verification
│   │   │   ├── responseHandler.js  # Unified JSON envelopes
│   │   │   ├── streakCalculator.js # Consecutive day streak engine
│   │   │   ├── scoreCalculator.js  # Productivity score engine
│   │   │   └── insightGenerator.js # Dynamic productivity insights
│   │   ├── app.js                  # Express middleware setup
│   │   └── server.js               # Server bootstrap entry point
│   ├── tests/
│   │   └── run-tests.js            # Automated test suite (20 tests)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalModal.jsx
│   │   │   ├── CategoryModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication state & token management
│   │   │   └── ThemeContext.jsx    # Dark/Light theme switching
│   │   ├── pages/                  # Application views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── DailyPlannerPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── GoalsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/               # Frontend API client services
│   │   │   ├── api.js              # Axios with JWT request interceptor
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── categoryService.js
│   │   │   ├── goalService.js
│   │   │   └── analyticsService.js
│   │   ├── App.jsx                 # Routes & global modal coordinator
│   │   ├── index.css               # Design tokens, variables & animations
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** (v18 or newer recommended)
* **npm** (comes bundled with Node.js)

---

### Step 1: Install Dependencies

Open a terminal in the root `TaskFlow` directory:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

---

### Step 2: Configure Environment Variables

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Your `.env` file contains:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=super-secret-taskflow-jwt-key-for-teenagers-2026
   JWT_EXPIRES_IN=7d

   # Supabase Configuration (Optional for initial offline test drive)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   CLIENT_URL=http://localhost:5173
   ```

> 💡 **Note for Learners:** TaskFlow comes with an **automatic smart developer store**. If you run the project before setting up Supabase, it will work 100% out of the box so you can explore immediately, and then seamlessly connect to your Supabase PostgreSQL tables whenever you add your credentials!

---

### Step 3: Run the Backend Server

```bash
cd backend
npm run dev
```

* Backend REST API will start on: **`http://localhost:5000`**
* Health check: **`http://localhost:5000/api/health`**

---

### Step 4: Run the Frontend Application

In a second terminal window:

```bash
cd frontend
npm run dev
```

* Open your browser at: **`http://localhost:5173`**
* Click **"🚀 1-Click Teenager Demo Login"** on the login screen to instantly experience TaskFlow with sample tasks, streaks, and analytics!

---

## 🗄️ Supabase PostgreSQL Setup Guide

If you'd like to link your own live Supabase cloud database:

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**, name it `TaskFlow`, set a database password, and select your nearest region.
3. Once created, go to the **SQL Editor** tab on the left sidebar.
4. Open `TaskFlow/backend/database/schema.sql` in your code editor, copy its contents, paste into the Supabase SQL Editor, and click **"Run"**.
5. Go to **Project Settings** ⚙️ -> **API**:
   * Copy the **Project URL** -> paste into `SUPABASE_URL` in `backend/.env`.
   * Copy the **service_role key** (or anon key) -> paste into `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`.
6. Restart your backend server (`npm run dev`). Your app is now connected to PostgreSQL!

---

## 🧪 Automated Testing

TaskFlow includes a test suite verifying password cryptography, token validation, task CRUD, streak calculation, score weighting, and security isolation:

```bash
cd backend
npm test
```

Expected output:
```
🧪 ========================================================
   RUNNING TASKFLOW BACKEND AUTOMATED TEST SUITE
========================================================

🔐 1. Cryptography & Security Tests:
  ✅ PASS: Bcrypt hashes the plain-text password
  ✅ PASS: Bcrypt correctly verifies valid password
  ✅ PASS: Bcrypt correctly rejects invalid password

🎫 2. JWT Authentication Token Tests:
  ✅ PASS: JWT Token generated successfully
  ✅ PASS: JWT Token verified with payload intact
  ✅ PASS: Invalid JWT token returns null

👤 3. Authentication & User Flow:
  ✅ PASS: User registered with token and profile
  ✅ PASS: User logged in successfully
  ✅ PASS: Duplicate email registration is blocked with 409 Conflict

📋 4. Task Management & User Ownership Isolation:
  ✅ PASS: Task created successfully for User A
  ✅ PASS: SECURITY: User B is strictly BLOCKED from reading User A task
  ✅ PASS: Subtask added to task
  ✅ PASS: Subtask completed flag toggles
  ✅ PASS: Task status updated to Completed with timestamp

🔥 5. Streak Algorithm Tests:
  ✅ PASS: Consecutive 3-day completions correctly compute 3-day streak
  ✅ PASS: Correctly flags that task was completed today

📊 6. Productivity Score Algorithm Tests:
  ✅ PASS: Productivity score calculated in expected range (72/100)
  ✅ PASS: Score rating generated

🎯 7. Goals Feature Tests:
  ✅ PASS: Goal created successfully
  ✅ PASS: Goal progress 100% auto-marks as Achieved

========================================================
🏁 TEST RESULTS: 20 PASSED, 0 FAILED
========================================================
```

---

## 📚 Concepts Explained for Beginners

### 1. What is MVC (Model-View-Controller)?
* **Model (`backend/src/models/`):** Manages data structures and database operations (talking to Supabase).
* **View (`frontend/`):** The React user interface that the teenager sees on screen.
* **Controller (`backend/src/controllers/`):** The coordinator that receives HTTP requests from React, validates inputs, asks the Model/Service for data, and returns JSON responses.

### 2. How Does Bcrypt Password Hashing Work?
* Plain-text passwords (*e.g., `Secret123!`*) are **never stored in the database**.
* Bcrypt generates a random cryptographic **Salt** and runs $2^{10}$ hashing rounds (`SALT_ROUNDS = 10`).
* Even if an attacker saw the database, they could never reverse the hash back into the password.
* When logging in, `bcrypt.compare()` hashes the incoming password with the salt from the stored hash and checks for equality in constant time.

### 3. How Does JWT Authentication Work?
* Upon successful login, the server signs a **JSON Web Token (JWT)** containing `{ id: userId, email: userEmail }` using a secret key.
* The React frontend saves this token in `localStorage` and automatically attaches it in an HTTP header: `Authorization: Bearer <token>`.
* The `authMiddleware.js` verifies the token on every private request to ensure the user can **only access their own tasks**.

### 4. How is the Productivity Score Calculated?
The score ($0 - 100$) is calculated from four transparent factors:
$$\text{Score} = \text{Completion Pts (up to 50)} + \text{Priority Bonus (up to 30)} + \text{Streak Bonus (up to 20)} - \text{Overdue Penalty (-5 per task)}$$

---

## 🌐 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/tasks` | Get all tasks (supports search, filters, sort) | Yes |
| `POST` | `/api/tasks` | Create a new task with subtasks & tags | Yes |
| `PUT` | `/api/tasks/:id` | Update task details | Yes |
| `PATCH` | `/api/tasks/:id/status` | Mark task Completed / Pending | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |
| `GET` | `/api/categories` | Get system + custom user categories | Yes |
| `POST` | `/api/categories` | Create custom category with color/icon | Yes |
| `GET` | `/api/goals` | Get long-term student goals | Yes |
| `POST` | `/api/goals` | Create goal with target date & progress | Yes |
| `PUT` | `/api/goals/:id` | Update goal or adjust progress slider | Yes |
| `DELETE` | `/api/goals/:id` | Delete goal | Yes |
| `GET` | `/api/analytics/overview` | Get 7-day chart data, streak, & scores | Yes |
| `POST` | `/api/user/seed-demo` | Seed sample teenager tasks & goals | Yes |

---

## 🛡️ Security Highlights

* 🔒 **Zero Hardcoded Secrets:** Configured via `.env`.
* 🛡️ **Helmet Security Headers:** Protects from common web vulnerabilities (XSS, clickjacking).
* 🚦 **Express Rate Limiting:** Mitigates brute-force attacks and API spam.
* 🛡️ **Strict Ownership Isolation:** All queries are filtered by `req.user.id` derived from the verified JWT.
* 📦 **Input Validation:** Reject malformed or empty payloads with clean HTTP 400 responses before hitting models.

---

## 📄 License
MIT License © 2026 TaskFlow Team. Free to use for educational and productivity purposes!