import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';
import { mockSubtasks } from './Task.js';
import crypto from 'crypto';

export const SubtaskModel = {
  async getByTaskId(taskId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('subtasks')
        .select('*')
        .eq('task_id', taskId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data || [];
    }
    return mockSubtasks.filter(s => s.task_id === taskId);
  },

  async create(taskId, { title, completed = false }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('subtasks')
        .insert([{ task_id: taskId, title: title.trim(), completed }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newSubtask = {
      id,
      task_id: taskId,
      title: title.trim(),
      completed: Boolean(completed),
      order_index: mockSubtasks.filter(s => s.task_id === taskId).length,
      created_at: now,
      updated_at: now
    };
    mockSubtasks.push(newSubtask);
    return newSubtask;
  },

  async toggle(id) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data: current } = await supabaseClient
        .from('subtasks')
        .select('completed')
        .eq('id', id)
        .single();
      
      const newStatus = !current?.completed;
      const { data, error } = await supabaseClient
        .from('subtasks')
        .update({ completed: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const sub = mockSubtasks.find(s => s.id === id);
    if (sub) {
      sub.completed = !sub.completed;
      sub.updated_at = new Date().toISOString();
      return sub;
    }
    return null;
  },

  async delete(id) {
    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('subtasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }
    const idx = mockSubtasks.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockSubtasks.splice(idx, 1);
      return true;
    }
    return false;
  }
};
