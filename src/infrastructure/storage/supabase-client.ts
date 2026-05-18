import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — menggunakan anon key, tunduk pada RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
