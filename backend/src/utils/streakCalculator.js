/**
 * Streak Calculator
 * Calculates real consecutive daily completion streak from actual completion logs.
 * 
 * Rules:
 * 1. Completing >= 1 task on day N marks day N as active.
 * 2. If the user completed a task today, the streak includes today.
 * 3. If no task was completed today yet, but one was completed yesterday, the streak is still alive!
 * 4. If the user missed yesterday and today, streak is 0.
 */

export const calculateStreak = (completions = []) => {
  if (!completions || completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeToday: false, completionDays: [] };
  }

  // Extract unique active dates in 'YYYY-MM-DD' format
  const activeDateSet = new Set();
  completions.forEach((item) => {
    const rawDate = item.completed_at || item;
    if (rawDate) {
      const dateStr = new Date(rawDate).toISOString().split('T')[0];
      activeDateSet.add(dateStr);
    }
  });

  const sortedDates = Array.from(activeDateSet).sort((a, b) => new Date(b) - new Date(a));
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeToday: false, completionDays: [] };
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const activeToday = activeDateSet.has(todayStr);
  const activeYesterday = activeDateSet.has(yesterdayStr);

  let currentStreak = 0;

  // Determine starting point for current streak
  let checkDate = new Date();
  if (!activeToday && !activeYesterday) {
    currentStreak = 0;
  } else {
    // If completed today, start counting from today backwards
    // If not completed today but completed yesterday, start from yesterday backwards
    let cursor = activeToday ? new Date(today) : new Date(yesterday);
    
    while (true) {
      const cursorStr = cursor.toISOString().split('T')[0];
      if (activeDateSet.has(cursorStr)) {
        currentStreak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest historical streak
  let longestStreak = 0;
  let runningCount = 0;
  
  // Sort ascending for chronological calculation
  const ascDates = Array.from(activeDateSet).sort((a, b) => new Date(a) - new Date(b));
  let prevDate = null;

  for (const dateStr of ascDates) {
    const curr = new Date(dateStr);
    if (!prevDate) {
      runningCount = 1;
    } else {
      const diffDays = Math.round((curr - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningCount++;
      } else {
        runningCount = 1;
      }
    }
    if (runningCount > longestStreak) {
      longestStreak = runningCount;
    }
    prevDate = curr;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    activeToday,
    completionDays: sortedDates
  };
};
