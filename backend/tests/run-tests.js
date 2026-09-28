/**
 * TaskFlow Automated Backend Test Suite
 * Validates MVC business logic, security constraints, streak algorithms, and auth isolation.
 */

import { AuthService } from '../src/services/authService.js';
import { TaskService } from '../src/services/taskService.js';
import { GoalService } from '../src/services/goalService.js';
import { CategoryService } from '../src/services/categoryService.js';
import { calculateStreak } from '../src/utils/streakCalculator.js';
import { calculateProductivityScore } from '../src/utils/scoreCalculator.js';
import { hashPassword, comparePassword } from '../src/utils/hashUtils.js';
import { generateToken, verifyToken } from '../src/utils/jwtUtils.js';

let passed = 0;
let failed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
};

const runAllTests = async () => {
  console.log('\n🧪 ========================================================');
  console.log('   RUNNING TASKFLOW BACKEND AUTOMATED TEST SUITE');
  console.log('========================================================\n');

  // TEST 1: Password Hashing & Comparison
  console.log('🔐 1. Cryptography & Security Tests:');
  const password = 'TeenagerSecretPass2026!';
  const hashed = await hashPassword(password);
  assert(hashed !== password, 'Bcrypt hashes the plain-text password');
  assert(await comparePassword(password, hashed), 'Bcrypt correctly verifies valid password');
  assert(!(await comparePassword('WrongPassword', hashed)), 'Bcrypt correctly rejects invalid password');

  // TEST 2: JWT Token Operations
  console.log('\n🎫 2. JWT Authentication Token Tests:');
  const mockPayload = { id: 'usr-12345', email: 'alex@taskflow.dev' };
  const token = generateToken(mockPayload);
  assert(typeof token === 'string' && token.length > 20, 'JWT Token generated successfully');
  const decoded = verifyToken(token);
  assert(decoded && decoded.id === mockPayload.id && decoded.email === mockPayload.email, 'JWT Token verified with payload intact');
  assert(verifyToken('invalid.garbage.token') === null, 'Invalid JWT token returns null');

  // TEST 3: User Registration & Login
  console.log('\n👤 3. Authentication & User Flow:');
  const timestamp = Date.now();
  const testEmailA = `teen_${timestamp}@example.com`;
  const testEmailB = `student_b_${timestamp}@example.com`;

  const regUser = await AuthService.register({
    name: 'Anirban',
    email: testEmailA,
    password: 'securePassword123'
  });
  assert(regUser && regUser.token && regUser.user.name === 'Anirban', 'User registered with token and profile');

  const loginRes = await AuthService.login({
    email: testEmailA,
    password: 'securePassword123'
  });
  assert(loginRes && loginRes.user.email === testEmailA, 'User logged in successfully');

  let duplicateBlocked = false;
  try {
    await AuthService.register({
      name: 'Anirban Duplicate',
      email: testEmailA,
      password: 'anotherPassword'
    });
  } catch (err) {
    duplicateBlocked = err.statusCode === 409;
  }
  assert(duplicateBlocked, 'Duplicate email registration is blocked with 409 Conflict');

  // TEST 4: Task CRUD & Security Isolation
  console.log('\n📋 4. Task Management & User Ownership Isolation:');
  const userIdA = regUser.user.id;

  // Register User B
  const userB = await AuthService.register({
    name: 'Student B',
    email: testEmailB,
    password: 'securePasswordB123'
  });
  const userIdB = userB.user.id;

  // User A creates task
  const taskA = await TaskService.createTask(userIdA, {
    title: 'Complete Physics Assignment',
    description: 'Solve chapter 4 questions',
    priority: 'High',
    due_date: new Date().toISOString().split('T')[0],
    estimated_minutes: 45,
    tags: ['Physics', 'School']
  });
  assert(taskA && taskA.title === 'Complete Physics Assignment', 'Task created successfully for User A');

  // User B tries to access User A's task -> MUST FAIL!
  let unauthorizedBlocked = false;
  try {
    await TaskService.getTaskById(taskA.id, userIdB);
  } catch (err) {
    unauthorizedBlocked = err.statusCode === 404;
  }
  assert(unauthorizedBlocked, 'SECURITY: User B is strictly BLOCKED from reading User A task');

  // Subtasks
  const subtask = await TaskService.addSubtask(taskA.id, userIdA, 'Step 1: Read formula sheet');
  assert(subtask && subtask.title === 'Step 1: Read formula sheet', 'Subtask added to task');

  const toggled = await TaskService.toggleSubtask(subtask.id, userIdA);
  assert(toggled && toggled.completed === true, 'Subtask completed flag toggles');

  // Complete Task
  const completedTask = await TaskService.updateTaskStatus(taskA.id, userIdA, 'Completed');
  assert(completedTask && completedTask.status === 'Completed' && completedTask.completed_at !== null, 'Task status updated to Completed with timestamp');

  // TEST 5: Streak Calculation Logic
  console.log('\n🔥 5. Streak Algorithm Tests:');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const mockHistory = [
    { completed_at: today.toISOString() },
    { completed_at: yesterday.toISOString() },
    { completed_at: twoDaysAgo.toISOString() }
  ];

  const streakResult = calculateStreak(mockHistory);
  assert(streakResult.currentStreak === 3, 'Consecutive 3-day completions correctly compute 3-day streak');
  assert(streakResult.activeToday === true, 'Correctly flags that task was completed today');

  // TEST 6: Productivity Score Calculator
  console.log('\n📊 6. Productivity Score Algorithm Tests:');
  const scoreResult = calculateProductivityScore({
    todayTasks: [completedTask],
    completedTodayTasks: [completedTask],
    overdueTasks: [],
    currentStreak: 3
  });
  assert(scoreResult.score >= 70 && scoreResult.score <= 100, `Productivity score calculated in expected range (${scoreResult.score}/100)`);
  assert(typeof scoreResult.rating === 'string' && scoreResult.rating.length > 0, 'Score rating generated');

  // TEST 7: Goals
  console.log('\n🎯 7. Goals Feature Tests:');
  const goal = await GoalService.createGoal(userIdA, {
    title: 'Master React & Node.js',
    progress: 40,
    category: 'Coding'
  });
  assert(goal && goal.title === 'Master React & Node.js', 'Goal created successfully');

  const updatedGoal = await GoalService.updateGoal(goal.id, userIdA, { progress: 100 });
  assert(updatedGoal && updatedGoal.progress === 100 && updatedGoal.status === 'Achieved', 'Goal progress 100% auto-marks as Achieved');

  // Summary
  console.log('\n========================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
};

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
