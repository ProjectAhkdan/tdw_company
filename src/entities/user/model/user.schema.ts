import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: z.enum(["user", "admin"]),
  affiliate_code: z.string().nullable(),
  referred_by: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserSchema = z.infer<typeof userSchema>;


