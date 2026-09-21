"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/reveal";

/** Plays the page's entrance (see lib/reveal.ts) on load and on every client-side navigation. */
export function PageAnimator({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (root.current) return reveal(root.current, { pageLevel: true });
    },
    // Layouts persist across navigation, so replay for each new page.
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  // `contents` keeps this wrapper out of the frame's flex layout.
  return (
    <div ref={root} className="contents">
      {children}
    </div>
  );
}
