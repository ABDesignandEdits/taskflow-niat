import { supabaseClient, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

// In-memory fallback storage for local development
const mockUsers = [];
const mockProfiles = [];

export const UserModel = {
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return mockUsers.find(u => u.email === normalizedEmail) || null;
  },

  async findById(id) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return mockUsers.find(u => u.id === id) || null;
  },

  async create({ email, password_hash, name }) {
    const normalizedEmail = email.toLowerCase().trim();
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabaseClient) {
      // 1. Insert User
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .insert([{ id: userId, email: normalizedEmail, password_hash }])
        .select()
        .single();
      if (userError) throw userError;

      // 2. Insert Profile
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .insert([{ user_id: userId, name: name.trim(), grade_or_role: 'High School Student' }])
        .select()
        .single();
      if (profileError) console.error('Error creating profile:', profileError);

      return { ...userData, profile: profileData };
    }

    const newUser = { id: userId, email: normalizedEmail, password_hash, created_at: now, updated_at: now };
    const newProfile = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: name.trim(),
      grade_or_role: 'High School Student',
      bio: 'Ready to stay organized and crush my goals! 🚀',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      timezone: 'UTC',
      theme_preference: 'dark',
      sound_effects_enabled: true,
      created_at: now,
      updated_at: now
    };

    mockUsers.push(newUser);
    mockProfiles.push(newProfile);

    return { ...newUser, profile: newProfile };
  },

  async getProfile(userId) {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
    return mockProfiles.find(p => p.user_id === userId) || null;
  },

  async updateProfile(userId, updates) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({ ...updates, updated_at: now })
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const idx = mockProfiles.findIndex(p => p.user_id === userId);
    if (idx !== -1) {
      mockProfiles[idx] = { ...mockProfiles[idx], ...updates, updated_at: now };
      return mockProfiles[idx];
    }
    return null;
  }
};
