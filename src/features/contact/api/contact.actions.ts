"use server";
import { supabase } from "@/infrastructure/storage/supabase-client";
import type { ContactSchema } from "@/entities/contact/model/contact.schema";
import type { ApiResponse } from "@/shared/types/api.types";

export async function submitContact(
  data: ContactSchema
): Promise<ApiResponse<null>> {
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
