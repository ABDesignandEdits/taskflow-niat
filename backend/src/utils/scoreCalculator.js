/**
 * Daily Productivity Score Calculator
 * Generates an intuitive 0-100 metric for teenagers to track daily momentum.
 * 
 * Formula factors:
 * 1. Daily Completion Rate (Up to 50 pts)
 * 2. Priority Weighting of Completed Work (Up to 30 pts)
 * 3. Streak Consistency Bonus (Up to 20 pts)
 * 4. Overdue Task Penalty (-5 pts per overdue task)
 */

export const calculateProductivityScore = ({
  todayTasks = [],
  completedTodayTasks = [],
  overdueTasks = [],
  currentStreak = 0
}) => {
  // If no tasks exist for today, give a friendly baseline if streak exists
  if (todayTasks.length === 0 && completedTodayTasks.length === 0) {
    if (currentStreak > 0) {
      return {
        score: Math.min(60 + currentStreak * 5, 80),
        rating: 'Rest & Ready',
        feedback: 'No tasks scheduled today. Enjoy your break or plan ahead for tomorrow!',
        breakdown: { completionPoints: 0, priorityPoints: 0, streakBonus: Math.min(currentStreak * 5, 20), overduePenalty: 0 }
      };
    }
    return {
      score: 50,
      rating: 'Ready to Start',
      feedback: 'Plan your first task for today to begin building momentum!',
      breakdown: { completionPoints: 0, priorityPoints: 0, streakBonus: 0, overduePenalty: 0 }
    };
  }

  // 1. Completion rate points (0 - 50)
  const totalDueToday = Math.max(todayTasks.length, completedTodayTasks.length);
  const completionRatio = totalDueToday > 0 ? (completedTodayTasks.length / totalDueToday) : 0;
  const completionPoints = Math.round(completionRatio * 50);

  // 2. Priority points (0 - 30)
  let rawPriorityPoints = 0;
  completedTodayTasks.forEach(task => {
    switch (task.priority) {
      case 'Urgent': rawPriorityPoints += 15; break;
      case 'High': rawPriorityPoints += 10; break;
      case 'Medium': rawPriorityPoints += 6; break;
      case 'Low': rawPriorityPoints += 3; break;
      default: rawPriorityPoints += 5;
    }
  });
  const priorityPoints = Math.min(rawPriorityPoints, 30);

  // 3. Streak points (0 - 20)
  const streakBonus = Math.min(currentStreak * 4, 20);

  // 4. Overdue penalty (-5 per overdue task, max -20)
  const overduePenalty = Math.min(overdueTasks.length * 5, 20);

  // Total Score clamped between 0 and 100
  let totalScore = Math.max(0, Math.min(100, completionPoints + priorityPoints + streakBonus - overduePenalty));

  // Determine Teen-friendly Rating and Feedback
  let rating = 'Keep Going';
  let feedback = 'You are making steady progress today!';

  if (totalScore >= 90) {
    rating = 'Unstoppable! 🚀';
    feedback = 'Legendary focus! You crushed high priority tasks and maintained an amazing streak.';
  } else if (totalScore >= 75) {
    rating = 'Great Flow ⚡';
    feedback = 'Awesome consistency today! Most of your goals are right on track.';
  } else if (totalScore >= 50) {
    rating = 'Good Momentum 👍';
    feedback = 'Nice effort! Complete a couple more tasks to push your score into the top tier.';
  } else if (totalScore >= 25) {
    rating = 'Getting Started ⏳';
    feedback = 'You have pending tasks. Knock out a quick 15-minute task to build your momentum!';
  } else {
    rating = 'Time to Reset 🎯';
    feedback = 'Pick one small high-priority item and finish it right now to turn today around.';
  }

  return {
    score: totalScore,
    rating,
    feedback,
    breakdown: {
      completionPoints,
      priorityPoints,
      streakBonus,
      overduePenalty
    }
  };
};
