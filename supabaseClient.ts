import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan Anon Key dari environment variables
// Jika tidak ada, aplikasi akan tetap berjalan dengan mode LocalStorage saja
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
