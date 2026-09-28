import { TaskModel } from '../models/Task.js';
import { CategoryService } from './categoryService.js';
import { calculateStreak } from '../utils/streakCalculator.js';
import { calculateProductivityScore } from '../utils/scoreCalculator.js';
import { generateProductivityInsights } from '../utils/insightGenerator.js';

export const AnalyticsService = {
  async getDashboardOverview(userId) {
    const allTasks = await TaskModel.getAll(userId);
    const completions = await TaskModel.getCompletions(userId);
    const categories = await CategoryService.getCategories(userId);

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter today's tasks
    const todayTasks = allTasks.filter(t => t.due_date === todayStr);
    const completedToday = allTasks.filter(t => 
      (t.status === 'Completed' && t.completed_at && t.completed_at.startsWith(todayStr)) ||
      (t.status === 'Completed' && t.due_date === todayStr)
    );
    const pendingToday = todayTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
    const overdueTasks = allTasks.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayStr);

    const totalTasks = allTasks.length;
    const totalCompleted = allTasks.filter(t => t.status === 'Completed').length;
    const totalPending = allTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    
    // Calculate real streak
    const streakData = calculateStreak(completions);

    // Calculate daily productivity score
    const productivityScore = calculateProductivityScore({
      todayTasks,
      completedTodayTasks: completedToday,
      overdueTasks,
      currentStreak: streakData.currentStreak
    });

    // Generate Weekly Completion Chart data (last 7 days)
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const completedOnDay = completions.filter(c => c.completed_at && c.completed_at.startsWith(dStr)).length;
      const scheduledOnDay = allTasks.filter(t => t.due_date === dStr).length;

      weeklyData.push({
        date: dStr,
        day: dayName,
        completed: completedOnDay,
        scheduled: scheduledOnDay
      });
    }

    // Category Distribution
    const catMap = {};
    allTasks.forEach(task => {
      const catName = task.category?.name || 'General';
      const catColor = task.category?.color || '#6366f1';
      if (!catMap[catName]) {
        catMap[catName] = { name: catName, count: 0, color: catColor };
      }
      catMap[catName].count++;
    });
    const categoryDistribution = Object.values(catMap);

    // Dynamic Insights & Suggestions
    const { insights, suggestions } = generateProductivityInsights({
      tasks: allTasks,
      completions,
      streakData,
      categories
    });

    const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    const todayCompletionRate = todayTasks.length > 0 ? Math.round((completedToday.length / todayTasks.length) * 100) : (completedToday.length > 0 ? 100 : 0);

    return {
      summary: {
        totalTasks,
        totalCompleted,
        totalPending,
        totalOverdue: overdueTasks.length,
        completionRate,
        todayTasksCount: todayTasks.length,
        completedTodayCount: completedToday.length,
        pendingTodayCount: pendingToday.length,
        todayCompletionRate
      },
      streak: streakData,
      productivityScore,
      weeklyChart: weeklyData,
      categoryChart: categoryDistribution,
      insights,
      suggestions,
      upcomingTasks: allTasks
        .filter(t => t.status !== 'Completed' && (!t.due_date || t.due_date >= todayStr))
        .slice(0, 5)
    };
  }
};