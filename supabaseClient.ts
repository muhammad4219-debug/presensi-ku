
import { createClient } from '@supabase/supabase-js';

// Ganti URL dan KEY ini di file .env.local atau di dashboard Netlify nantinya
// Fix: Cast import.meta to any to resolve TypeScript error 'Property env does not exist on type ImportMeta'
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
