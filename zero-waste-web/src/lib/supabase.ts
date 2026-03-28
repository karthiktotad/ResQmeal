import { createClient } from '@supabase/supabase-js';

// Use environment variables for URL and Key.
// Fallback to empty strings so build doesn't crash during initial preview.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
