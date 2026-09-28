/**
 * Productivity Insight & Smart Suggestions Generator
 * Analyzes real task and completion records to provide personalized, factual observations.
 */

export const generateProductivityInsights = ({
  tasks = [],
  completions = [],
  streakData = { currentStreak: 0 },
  categories = []
}) => {
  const insights = [];
  const suggestions = [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayStr);

  // 1. Streak Insights
  if (streakData.currentStreak >= 7) {
    insights.push({
      type: 'streak',
      icon: 'Flame',
      title: 'Major Consistency Streak 🔥',
      description: `You have completed tasks for ${streakData.currentStreak} consecutive days! Consistency is your superpower.`
    });
  } else if (streakData.currentStreak >= 3) {
    insights.push({
      type: 'streak',
      icon: 'Zap',
      title: 'Building Momentum',
      description: `You're on a ${streakData.currentStreak}-day streak. Keep it going by checking off today's goal!`
    });
  }

  // 2. Overdue & Workload Insights
  if (overdueTasks.length > 0) {
    insights.push({
      type: 'warning',
      icon: 'AlertCircle',
      title: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`,
      description: `You have ${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} past due date. Tackling the oldest one first will clear mental clutter.`
    });
    suggestions.push({
      title: 'Clear Overdue Backlog',
      text: 'Start your next work session with your oldest overdue high-priority task before taking on new items.'
    });
  }

  // 3. Category Distribution Analysis
  const categoryCount = {};
  tasks.forEach(task => {
    const catName = task.category?.name || 'General';
    categoryCount[catName] = (categoryCount[catName] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const topCat = sortedCategories[0];
    const percentage = Math.round((topCat[1] / Math.max(totalTasks, 1)) * 100);
    insights.push({
      type: 'category',
      icon: 'PieChart',
      title: `${topCat[0]} is your top focus`,
      description: `${percentage}% of all your tasks belong to the ${topCat[0]} category.`
    });
  }

  // 4. Time Management & Estimation Suggestions
  const largeTasks = tasks.filter(t => t.estimated_minutes && t.estimated_minutes >= 60 && t.status !== 'Completed');
  if (largeTasks.length > 0) {
    suggestions.push({
      title: 'Break Down 60+ Min Tasks',
      text: `You have ${largeTasks.length} large task${largeTasks.length > 1 ? 's' : ''} (1+ hr). Split them into 20-30 min subtasks for easier completion.`
    });
  }

  // 5. High Priority Focus
  const highPriorityPending = pendingTasks.filter(t => t.priority === 'High' || t.priority === 'Urgent');
  if (highPriorityPending.length > 0) {
    insights.push({
      type: 'priority',
      icon: 'Star',
      title: `${highPriorityPending.length} High-Priority Items Pending`,
      description: `Focusing on ${highPriorityPending[0].title} first will give you the biggest sense of accomplishment.`
    });
  } else if (completedTasks.length > 0) {
    insights.push({
      type: 'success',
      icon: 'CheckCircle2',
      title: 'High Priority Clear',
      description: 'You have cleared your top urgent tasks. Great job staying ahead of deadlines!'
    });
  }

  // Default suggestions if list is short
  if (suggestions.length < 3) {
    suggestions.push({
      title: 'Use Time Blocking',
      text: 'Schedule challenging homework for morning or afternoon when your focus is highest.'
    });
    suggestions.push({
      title: 'Review at End of Day',
      text: 'Spend 3 minutes each evening reviewing tomorrow’s schedule to wake up with clarity.'
    });
  }

  return {
    insights: insights.slice(0, 5),
    suggestions: suggestions.slice(0, 4)
  };
};
