import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient = null;
let isSupabaseConfigured = false;

if (config.supabaseUrl && config.supabaseKey && config.supabaseUrl.startsWith('http')) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    isSupabaseConfigured = true;
    console.log('✅ Supabase PostgreSQL Client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not detected in .env. Running with local development data store.');
}

export { supabaseClient, isSupabaseConfigured };
