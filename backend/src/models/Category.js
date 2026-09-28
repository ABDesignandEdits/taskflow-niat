import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

const defaultCategories = [
  { id: 'cat-1', user_id: null, name: 'School', description: 'School classes & lectures', icon: 'BookOpen', color: '#3b82f6' },
  { id: 'cat-2', user_id: null, name: 'Homework', description: 'Daily assignments & worksheets', icon: 'FileEdit', color: '#6366f1' },
  { id: 'cat-3', user_id: null, name: 'Exams & Tests', description: 'Exam preparation & quizzes', icon: 'GraduationCap', color: '#ef4444' },
  { id: 'cat-4', user_id: null, name: 'Coding', description: 'Programming, web apps & projects', icon: 'Code', color: '#10b981' },
  { id: 'cat-5', user_id: null, name: 'Personal', description: 'Personal chores, health & routines', icon: 'User', color: '#ec4899' },
  { id: 'cat-6', user_id: null, name: 'Fitness', description: 'Sports, gym, runs & activities', icon: 'Activity', color: '#f59e0b' },
  { id: 'cat-7', user_id: null, name: 'Projects', description: 'Group projects & long-term builds', icon: 'FolderGit2', color: '#8b5cf6' },
  { id: 'cat-8', user_id: null, name: 'Hobbies', description: 'Music, drawing, reading & gaming', icon: 'Smile', color: '#06b6d4' },
  { id: 'cat-9', user_id: null, name: 'Other', description: 'General to-dos', icon: 'CheckSquare', color: '#64748b' }
];

let mockCategories = [...defaultCategories];

export const CategoryModel = {
  async getAll(userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data && data.length > 0 ? data : defaultCategories;
    }
    return mockCategories.filter(c => c.user_id === null || c.user_id === userId);
  },

  async findById(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .eq('id', id)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return mockCategories.find(c => c.id === id && (c.user_id === null || c.user_id === userId)) || null;
  },

  async create(userId, { name, description, icon = 'Folder', color = '#6366f1' }) {
    const id = crypto.randomUUID();
    const newCat = {
      id,
      user_id: userId,
      name: name.trim(),
      description: description || '',
      icon,
      color,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('categories')
        .insert([newCat])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    mockCategories.push(newCat);
    return newCat;
  },

  async update(id, userId, updates) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const idx = mockCategories.findIndex(c => c.id === id && c.user_id === userId);
    if (idx !== -1) {
      mockCategories[idx] = { ...mockCategories[idx], ...updates };
      return mockCategories[idx];
    }
    return null;
  },

  async delete(id, userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const idx = mockCategories.findIndex(c => c.id === id && c.user_id === userId);
    if (idx !== -1) {
      mockCategories.splice(idx, 1);
      return true;
    }
    return false;
  }
};
