// lib/supabase/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Use your Supabase credentials here
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
