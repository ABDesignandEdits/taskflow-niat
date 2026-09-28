-- ==============================================================================
-- TASKFLOW SUPABASE POSTGRESQL DATABASE SCHEMA
-- Designed for Teenager To-Do & Productivity Tracker
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Stores credentials with secure bcrypt password hashes
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES TABLE
-- Stores user personal details, avatar, timezone & streak milestones
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    grade_or_role VARCHAR(100) DEFAULT 'High School Student',
    bio TEXT,
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme_preference VARCHAR(20) DEFAULT 'dark',
    sound_effects_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
-- Stores task categories (default + user-custom categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL means global system default
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Folder',
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TASKS TABLE
-- Core task entity with due date/time, priority, category, tags, and estimation
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    due_date DATE,
    due_time TIME,
    time_block VARCHAR(20) DEFAULT 'Morning' CHECK (time_block IN ('Morning', 'Afternoon', 'Evening', 'Anytime')),
    estimated_minutes INTEGER DEFAULT 30,
    tags TEXT[] DEFAULT '{}',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule VARCHAR(50),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SUBTASKS TABLE
-- Checklists inside tasks
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. GOALS TABLE
-- Long term / term goals for students (e.g. "Finish Physics Syllabus", "Read 5 Books")
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Academic',
    target_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'In Progress' CHECK (status IN ('Not Started', 'In Progress', 'Achieved', 'Abandoned')),
    color VARCHAR(20) DEFAULT '#8b5cf6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TASK COMPLETIONS TABLE
-- Historic completion log used for accurate streak, velocity, and analytics calculation
CREATE TABLE IF NOT EXISTS task_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. REMINDERS TABLE
-- In-app notification reminders for pending homework / assignments
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- DATABASE INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_completed_at ON task_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);

-- ==============================================================================
-- DEFAULT CATEGORIES SEED FUNCTION FOR NEW USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION create_default_user_categories(new_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO categories (user_id, name, description, icon, color) VALUES
    (new_user_id, 'School', 'School classes, periods, and attendance', 'BookOpen', '#3b82f6'),
    (new_user_id, 'Homework', 'Daily assignments and problem sets', 'FileEdit', '#6366f1'),
    (new_user_id, 'Exams & Tests', 'Midterms, finals, quizzes and preparation', 'GraduationCap', '#ef4444'),
    (new_user_id, 'Coding', 'Programming, web development, and algorithms', 'Code', '#10b981'),
    (new_user_id, 'Personal', 'Personal chores, health, and routines', 'User', '#ec4899'),
    (new_user_id, 'Fitness', 'Sports, workout, walks and physical activities', 'Activity', '#f59e0b'),
    (new_user_id, 'Projects', 'Science fair, group projects, and coding apps', 'FolderGit2', '#8b5cf6'),
    (new_user_id, 'Hobbies', 'Music, reading, drawing, gaming & passions', 'Smile', '#06b6d4'),
    (new_user_id, 'Other', 'General miscellaneous to-dos', 'CheckSquare', '#64748b');
END;
$$ LANGUAGE plpgsql;
