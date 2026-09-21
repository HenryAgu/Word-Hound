"use client";

import { useRef, type ReactNode } from "react";
import { useSelfReveal } from "@/lib/reveal";

/**
 * Wraps content that only exists once fetched data arrives, and plays the
 * entrance animation for it when it mounts. The page-wide animator skips
 * anything inside `[data-anim-self]`, so nothing is animated twice.
 * `contents` keeps the box out of the surrounding flex/grid layout.
 */
export function RevealBox({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useSelfReveal(ref);
  return (
    <div ref={ref} data-anim-self className="contents">
      {children}
    </div>
  );
}
