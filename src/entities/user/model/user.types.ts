import type { WithTimestamps } from "@/shared/types/common.types";

export type UserRole = "user" | "admin";

export type User = WithTimestamps & {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  affiliate_code: string | null;
  referred_by: string | null;
};
