"use client";

import { useEffect, useState } from "react";
import { useLandscapeLock } from "./hooks/use-landscape-lock";

/**
 * LandscapeGuard
 *
 * Wraps your app content and ensures it always renders in landscape.
 *
 * Strategy:
 * 1. Try native screen.orientation.lock("landscape") — works for PWA / Android Chrome
 * 2. CSS/JS rotate fallback — rotates the entire page 90° when portrait is detected
 *    (works in all regular mobile browsers)
 */

export default function LandscapeGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  useLandscapeLock();

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Only apply rotation on mobile/tablet (width < 1024px when portrait)
      const portrait =
        window.innerHeight > window.innerWidth && window.innerWidth < 1024;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) {
    // Desktop or already landscape — render normally
    return <>{children}</>;
  }

  // Portrait mobile/tablet — rotate content to simulate landscape
  return (
    <>
      <style>{`
        body, html {
          overflow: hidden;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100svh",
          height: "100svw",
          transform: `rotate(90deg) translateY(-100%)`,
          transformOrigin: "top left",
          overflow: "auto",
          zIndex: 9999,
          backgroundColor: "var(--background, #fff)",
        }}
      >
        {children}
      </div>
    </>
  );
}
