import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';
import { CategoryModel } from './Category.js';
import crypto from 'crypto';

let mockTasks = [];
let mockCompletions = [];
let mockSubtasks = [];

export const TaskModel = {
  async getAll(userId, options = {}) {
    const { status, category_id, priority, date, search, sortBy = 'due_date', sortOrder = 'asc' } = options;

    if (isSupabaseConfigured && supabaseClient) {
      let query = supabaseClient
        .from('tasks')
        .select(`
          *,
          category:categories(*),
          subtasks(*)
        `)
        .eq('user_id', userId);

      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (priority) {
        query = query.eq('priority', priority);
      }
      if (date) {
        query = query.eq('due_date', date);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const ascending = sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Local in-memory filtering
    let results = mockTasks.filter(t => t.user_id === userId);

    if (status && status !== 'All') {
      if (status === 'Overdue') {
        const todayStr = new Date().toISOString().split('T')[0];
        results = results.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayStr);
      } else if (status === 'Today') {
        const todayStr = new Date().toISOString().split('T')[0];
        results = results.filter(t => t.due_date === todayStr);
      } else if (status === 'Upcoming') {
        const todayStr = new Date().toISOString().split('T')[0];
        results = results.filter(t => t.due_date && t.due_date > todayStr && t.status !== 'Completed');
      } else {
        results = results.filter(t => t.status === status);
      }
    }

    if (category_id) {
      results = results.filter(t => t.category_id === category_id);
    }
    if (priority) {
      results = results.filter(t => t.priority === priority);
    }
    if (date) {
      results = results.filter(t => t.due_date === date);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Attach category and subtasks
    const categories = await CategoryModel.getAll(userId);
    results = results.map(t => ({
      ...t,
      category: categories.find(c => c.id === t.category_id) || null,
      subtasks: mockSubtasks.filter(s => s.task_id === t.id)
    }));

    // Sorting
    results.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (sortBy === 'priority') {
        const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        valA = pOrder[a.priority] || 0;
        valB = pOrder[b.priority] || 0;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return results;
  },

  async findById(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('tasks')
        .select(`
          *,
          category:categories(*),
          subtasks(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const task = mockTasks.find(t => t.id === id && t.user_id === userId);
    if (!task) return null;

    const categories = await CategoryModel.getAll(userId);
    return {
      ...task,
      category: categories.find(c => c.id === task.category_id) || null,
      subtasks: mockSubtasks.filter(s => s.task_id === task.id)
    };
  },

  async create(userId, taskData) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newTask = {
      id,
      user_id: userId,
      category_id: taskData.category_id || null,
      title: taskData.title.trim(),
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      due_date: taskData.due_date || null,
      due_time: taskData.due_time || null,
      time_block: taskData.time_block || 'Morning',
      estimated_minutes: Number(taskData.estimated_minutes) || 30,
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      is_recurring: Boolean(taskData.is_recurring),
      recurrence_rule: taskData.recurrence_rule || null,
      completed_at: taskData.status === 'Completed' ? now : null,
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('tasks')
        .insert([newTask])
        .select()
        .single();
      if (error) throw error;

      // Create subtasks if provided
      if (taskData.subtasks && Array.isArray(taskData.subtasks) && taskData.subtasks.length > 0) {
        const subtaskRows = taskData.subtasks.map((st, i) => ({
          task_id: id,
          title: typeof st === 'string' ? st : st.title,
          completed: typeof st === 'object' ? Boolean(st.completed) : false,
          order_index: i
        }));
        await supabaseClient.from('subtasks').insert(subtaskRows);
      }

      return this.findById(id, userId);
    }

    mockTasks.unshift(newTask);

    // Add subtasks if any
    if (taskData.subtasks && Array.isArray(taskData.subtasks)) {
      taskData.subtasks.forEach((st, i) => {
        mockSubtasks.push({
          id: crypto.randomUUID(),
          task_id: id,
          title: typeof st === 'string' ? st : st.title,
          completed: typeof st === 'object' ? Boolean(st.completed) : false,
          order_index: i,
          created_at: now,
          updated_at: now
        });
      });
    }

    if (newTask.status === 'Completed') {
      mockCompletions.push({
        id: crypto.randomUUID(),
        task_id: id,
        user_id: userId,
        completed_at: now
      });
    }

    return this.findById(id, userId);
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    let completed_at = existing.completed_at;

    if (updates.status === 'Completed' && existing.status !== 'Completed') {
      completed_at = now;
    } else if (updates.status && updates.status !== 'Completed') {
      completed_at = null;
    }

    const cleanedUpdates = {
      ...updates,
      completed_at,
      updated_at: now
    };
    delete cleanedUpdates.category;
    delete cleanedUpdates.subtasks;

    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('tasks')
        .update(cleanedUpdates)
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;

      if (updates.status === 'Completed' && existing.status !== 'Completed') {
        await supabaseClient.from('task_completions').insert([{
          task_id: id,
          user_id: userId,
          completed_at: now
        }]);
      }

      return this.findById(id, userId);
    }

    const idx = mockTasks.findIndex(t => t.id === id && t.user_id === userId);
    if (idx !== -1) {
      mockTasks[idx] = { ...mockTasks[idx], ...cleanedUpdates };

      if (updates.status === 'Completed' && existing.status !== 'Completed') {
        mockCompletions.push({
          id: crypto.randomUUID(),
          task_id: id,
          user_id: userId,
          completed_at: now
        });
      }

      return this.findById(id, userId);
    }

    return null;
  },

  async delete(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const idx = mockTasks.findIndex(t => t.id === id && t.user_id === userId);
    if (idx !== -1) {
      mockTasks.splice(idx, 1);
      mockSubtasks = mockSubtasks.filter(s => s.task_id !== id);
      mockCompletions = mockCompletions.filter(c => c.task_id !== id);
      return true;
    }
    return false;
  },

  async getCompletions(userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('task_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return mockCompletions.filter(c => c.user_id === userId);
  },

  async logCompletion(taskId, userId) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabaseClient) {
      await supabaseClient.from('task_completions').insert([{
        task_id: taskId,
        user_id: userId,
        completed_at: now
      }]);
      return;
    }
    mockCompletions.push({
      id: crypto.randomUUID(),
      task_id: taskId,
      user_id: userId,
      completed_at: now
    });
  }
};

export { mockTasks, mockSubtasks, mockCompletions };
