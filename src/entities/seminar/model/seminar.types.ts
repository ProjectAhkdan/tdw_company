import type { WithTimestamps } from "@/shared/types/common.types";

export type SeminarStatus = "draft" | "published" | "cancelled";

export type Seminar = WithTimestamps & {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  date: string;
  location: string | null;
  price: number;
  quota: number;
  status: SeminarStatus;
};

export type SeminarTicket = WithTimestamps & {
  id: string;
  seminar_id: string;
  user_id: string;
  order_id: string;
  ticket_code: string;
  eticket_url: string | null;
};


