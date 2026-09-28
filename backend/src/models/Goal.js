import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

let mockGoals = [];

export const GoalModel = {
  async getAll(userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return mockGoals.filter(g => g.user_id === userId);
  },

  async findById(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return mockGoals.find(g => g.id === id && g.user_id === userId) || null;
  },

  async create(userId, goalData) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newGoal = {
      id,
      user_id: userId,
      title: goalData.title.trim(),
      description: goalData.description || '',
      category: goalData.category || 'Academic',
      target_date: goalData.target_date || null,
      progress: Number(goalData.progress) || 0,
      status: goalData.status || (Number(goalData.progress) === 100 ? 'Achieved' : 'In Progress'),
      color: goalData.color || '#8b5cf6',
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('goals')
        .insert([newGoal])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    mockGoals.unshift(newGoal);
    return newGoal;
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    let status = updates.status || existing.status;
    if (updates.progress !== undefined) {
      if (Number(updates.progress) >= 100) status = 'Achieved';
      else if (Number(updates.progress) > 0 && status === 'Not Started') status = 'In Progress';
    }

    const cleanedUpdates = {
      ...updates,
      status,
      updated_at: now
    };

    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('goals')
        .update(cleanedUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = mockGoals.findIndex(g => g.id === id && g.user_id === userId);
    if (idx !== -1) {
      mockGoals[idx] = { ...mockGoals[idx], ...cleanedUpdates };
      return mockGoals[idx];
    }
    return null;
  },

  async delete(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const idx = mockGoals.findIndex(g => g.id === id && g.user_id === userId);
    if (idx !== -1) {
      mockGoals.splice(idx, 1);
      return true;
    }
    return false;
  }
};
