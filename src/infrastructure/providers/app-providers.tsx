"use client";
import { useEffect } from "react";
import { Toaster } from "@/shared/ui/sonner";
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client";

function BFCacheOptimizer() {
  useEffect(() => {
    // 1. Map 'unload' to 'pagehide' to prevent 3rd party libs from breaking BFCache
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (
      this: Window,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      let mappedType = type;
      if (type === 'unload') {
        mappedType = 'pagehide';
      }
      return originalAddEventListener.call(this, mappedType, listener, options);
    };

    // 2. Close active connections on pagehide
    const handlePageHide = (event: PageTransitionEvent) => {
      // If the page is being cached, we should close active websockets
      if (event.persisted) {
        const supabase = createSupabaseBrowser();
        supabase.removeAllChannels(); // Close realtime connections
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BFCacheOptimizer />
      {children}
      <Toaster />
    </>
  );
}


