"use client";
import { Toaster } from "@/shared/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
