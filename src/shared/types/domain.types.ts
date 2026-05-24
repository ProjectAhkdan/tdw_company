// ─── Enums ────────────────────────────────────────────────────────────────────
export type Role             = 'USER' | 'AFFILIATE' | 'ADMIN'
export type SeminarStatus    = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type OrderStatus      = 'PENDING' | 'PAID' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus    = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED'
export type PaymentMethod    = 'BANK_TRANSFER' | 'QRIS' | 'CREDIT_CARD' | 'GOPAY'
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'
export type WithdrawalStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'

// ─── Core domain types ────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface Ticket {
  id: string
  name: string
  price: number
  early_bird_price: number | null
  early_bird_until: string | null
  quota: number
  sold: number
}

export interface ScheduleItem {
  id: string
  start_date: string
  end_date: string
  city: string
  venue: string
  address: string | null
  tickets: Ticket[]
}

export interface Seminar {
  id: string
  slug: string
  title: string
  short_desc: string
  description: string
  thumbnail_url: string | null
  status: SeminarStatus
  is_featured: boolean
  created_at: string
  category: Category | null
  schedules: ScheduleItem[]
}

export interface UserProfile {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  city: string | null
  occupation: string | null
  notify_email: boolean
  notify_wa: boolean
}

export interface BankAccount {
  id: string
  bank_name: string
  account_no: string
  account_name: string
}

export interface ServerSession {
  id: string
  role: Role
  email: string
  profiles: UserProfile | UserProfile[] | null
}

// ─── Server Action return type ────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { error: string }
  | (T extends void ? { success: true } : T & { error?: never })
