import { z } from "zod";

export const orderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  seminar_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  total_price: z.number().nonnegative(),
  status: z.enum(["pending", "paid", "cancelled", "refunded", "expired"]),
  payment_token: z.string().nullable(),
  payment_url: z.string().url().nullable(),
  affiliate_code: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

