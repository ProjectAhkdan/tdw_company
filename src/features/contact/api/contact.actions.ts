"use server";
import { headers } from 'next/headers'
import { supabase } from "@/infrastructure/storage/supabase-client";
import { rateLimit } from "@shared/lib/rate-limit";
import type { ContactSchema } from "@/entities/contact/model/contact.schema";
import type { ApiResponse } from "@/shared/types/api.types";

export async function submitContact(
  data: ContactSchema
): Promise<ApiResponse<null>> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim()
    ?? headersList.get('x-real-ip')
    ?? 'unknown'

  const { ok } = await rateLimit(ip, 'contact', 5, 60)
  if (!ok) return { data: null, error: 'Terlalu banyak permintaan. Coba lagi nanti.' }

  try {
    const { error } = await supabase.from("contacts").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject,
      message: data.message,
      status: "unread",
    });

    if (error) return { data: null, error: error.message };
    return { data: null, error: null, message: "Pesan berhasil dikirim" };
  } catch {
    return { data: null, error: "Terjadi kesalahan, coba lagi" };
  }
}
