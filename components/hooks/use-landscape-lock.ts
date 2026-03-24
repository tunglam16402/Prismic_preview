"use client";

import { useEffect } from "react";

export function useLandscapeLock() {
  useEffect(() => {
    // Cast to unknown first để bypass TypeScript's incomplete ScreenOrientation type.
    // screen.orientation.lock() tồn tại trên Chrome/Android nhưng chưa có trong TS lib.
    const orientation = screen?.orientation as unknown as {
      lock?: (orientation: string) => Promise<void>;
    };

    if (typeof orientation?.lock === "function") {
      // void operator: explicitly marks the promise as intentionally ignored (fixes ESLint warning)
      void orientation.lock("landscape").catch(() => {
        // Browser denied lock (expected in regular browsers) — CSS fallback in LandscapeGuard handles it
      });
    }
  }, []);
}
