import { z } from "zod";

export const seminarSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  content: z.string().nullable(),
  image_url: z.string().url().nullable(),
  date: z.string(),
  location: z.string().nullable(),
  price: z.number().nonnegative(),
  quota: z.number().int().positive(),
  status: z.enum(["draft", "published", "cancelled"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SeminarSchema = z.infer<typeof seminarSchema>;


