import type { WithTimestamps } from "@/shared/types/common.types";

export type ContactStatus = "unread" | "read" | "replied";

export type Contact = WithTimestamps & {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
};


