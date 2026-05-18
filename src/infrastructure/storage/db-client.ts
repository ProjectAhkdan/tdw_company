import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client dengan service role (bypass RLS) — hanya untuk server actions & API routes
const globalForSupabase = globalThis as unknown as { supabaseAdmin: ReturnType<typeof createClient> }

export const supabaseAdmin =
  globalForSupabase.supabaseAdmin ?? createClient(supabaseUrl, supabaseServiceKey)

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabaseAdmin = supabaseAdmin
