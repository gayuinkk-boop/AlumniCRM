import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Detect if placeholder or empty
export const isMock = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-project-url.supabase.co') || 
  supabaseUrl.includes('placeholder.supabase.co') || 
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseAnonKey.includes('placeholder_key');

// Safeguard URL/Key to avoid Supabase createClient crash
const activeUrl = isMock ? 'https://placeholder.supabase.co' : supabaseUrl;
const activeKey = isMock ? 'placeholder_key' : supabaseAnonKey;

export const supabase = createClient(activeUrl, activeKey);

