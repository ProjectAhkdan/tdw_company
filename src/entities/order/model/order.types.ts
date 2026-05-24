import type { WithTimestamps } from "@/shared/types/common.types";

export type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "refunded"
  | "expired";

export type Order = WithTimestamps & {
  id: string;
  user_id: string;
  seminar_id: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  payment_token: string | null;
  payment_url: string | null;
  affiliate_code: string | null;
};


