import { supabase } from "@/infrastructure/storage/supabase-client";

export async function getUserById(id: string) {
  return supabase.from("users").select("*").eq("id", id).single();
}

export async function getUserByEmail(email: string) {
  return supabase.from("users").select("*").eq("email", email).single();
}
