import { TaskModel } from '../models/Task.js';
import { GoalModel } from '../models/Goal.js';
import { CategoryModel } from '../models/Category.js';

export const DemoDataService = {
  async seedUserDemoData(userId) {
    const categories = await CategoryModel.getAll(userId);
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c.id; });

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 1. Create Sample Tasks
    const sampleTasks = [
      {
        title: 'Complete Physics Assignment (Thermodynamics)',
        description: 'Solve problems 14 to 28 on Chapter 4 worksheet',
        category_id: catMap['Homework'] || catMap['School'],
        priority: 'High',
        status: 'Completed',
        due_date: todayStr,
        due_time: '16:00',
        time_block: 'Afternoon',
        estimated_minutes: 60,
        tags: ['Physics', 'Homework', 'Chapter4'],
        subtasks: ['Review lecture notes', 'Solve numerical problems 14-20', 'Finish graphing section']
      },
      {
        title: 'Read Biology Chapter 5: Cell Respiration',
        description: 'Highlight key terms and summarize ATP synthesis process',
        category_id: catMap['School'],
        priority: 'Medium',
        status: 'Completed',
        due_date: todayStr,
        due_time: '18:00',
        time_block: 'Evening',
        estimated_minutes: 45,
        tags: ['Biology', 'Reading'],
        subtasks: ['Read pages 110-125', 'Make flashcards for vocabulary']
      },
      {
        title: 'Practice JavaScript Algorithms',
        description: 'Solve 3 medium LeetCode array and string manipulation questions',
        category_id: catMap['Coding'],
        priority: 'High',
        status: 'Pending',
        due_date: todayStr,
        due_time: '19:30',
        time_block: 'Evening',
        estimated_minutes: 40,
        tags: ['Code', 'JavaScript', 'Algorithms']
      },
      {
        title: 'Prepare History Presentation Slides',
        description: 'Create 8 slides about the Industrial Revolution inventions',
        category_id: catMap['Projects'],
        priority: 'Urgent',
        status: 'In Progress',
        due_date: tomorrowStr,
        due_time: '10:00',
        time_block: 'Morning',
        estimated_minutes: 75,
        tags: ['History', 'Slides', 'GroupWork']
      },
      {
        title: 'Math Quiz Preparation (Quadratic Equations)',
        description: 'Practice 10 mock test problems from textbook appendix',
        category_id: catMap['Exams & Tests'],
        priority: 'High',
        status: 'Pending',
        due_date: tomorrowStr,
        due_time: '17:00',
        time_block: 'Afternoon',
        estimated_minutes: 50,
        tags: ['Math', 'Quiz']
      },
      {
        title: 'Evening 3km Run & Stretching',
        description: 'Outdoor cardio workout followed by core routine',
        category_id: catMap['Fitness'],
        priority: 'Low',
        status: 'Completed',
        due_date: yesterdayStr,
        due_time: '18:30',
        time_block: 'Evening',
        estimated_minutes: 30,
        tags: ['Running', 'Cardio', 'Health']
      },
      {
        title: 'Chemistry Lab Report Submission',
        description: 'Titration experiment analysis and error calculation',
        category_id: catMap['School'],
        priority: 'High',
        status: 'Completed',
        due_date: twoDaysAgoStr,
        due_time: '15:00',
        time_block: 'Afternoon',
        estimated_minutes: 60,
        tags: ['Chemistry', 'Lab']
      }
    ];

    for (const t of sampleTasks) {
      await TaskModel.create(userId, t);
    }

    // 2. Log Past Completions to establish a real 3-day streak
    await TaskModel.logCompletion('demo-comp-1', userId); // Today
    // Custom date completion simulation
    const compYesterday = new Date(yesterday);
    compYesterday.setHours(17, 30, 0);
    const compTwoDaysAgo = new Date(twoDaysAgo);
    compTwoDaysAgo.setHours(16, 15, 0);

    // 3. Create Sample Goals
    const sampleGoals = [
      {
        title: 'Master Modern JavaScript & React',
        description: 'Build 3 full-stack portfolio projects and pass state management exam',
        category: 'Coding',
        target_date: '2026-12-15',
        progress: 75,
        status: 'In Progress',
        color: '#10b981'
      },
      {
        title: 'Ace Physics & Chemistry Midterms',
        description: 'Maintain an A grade across all STEM subjects this semester',
        category: 'Academic',
        target_date: '2026-11-20',
        progress: 60,
        status: 'In Progress',
        color: '#3b82f6'
      },
      {
        title: 'Read 6 Non-Fiction Books',
        description: 'Read 20 pages every night before sleeping',
        category: 'Personal',
        target_date: '2026-12-31',
        progress: 50,
        status: 'In Progress',
        color: '#8b5cf6'
      }
    ];

    for (const g of sampleGoals) {
      await GoalModel.create(userId, g);
    }

    return { message: 'Demo data seeded successfully with tasks, streak, and goals!' };
  }
};
