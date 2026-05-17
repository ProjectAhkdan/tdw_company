-- Migration: add eticket_url column to orders
alter table public.orders add column if not exists eticket_url text;
