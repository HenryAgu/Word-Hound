"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
// Pages without a stamp or a split headword simply have nothing to animate.
gsap.config({ nullTargetWarn: false });

/**
 * Choreographs the whole page from `data-anim` attributes, so the server
 * components only mark up what should move:
 *
 *   title  the masthead name, dropped in from above
 *   stamp  the language stamp, slammed down like a rubber stamp
 *   word   a headword rendered as `[data-char]` letters, which rise in turn
 *   rule   a hairline that draws itself outward
 *   rise   anything else: fades up as it scrolls into view, staggered
 *
 * Elements start hidden through CSS (see globals.css), and only under
 * `prefers-reduced-motion: no-preference`, so nothing flashes before this
 * runs and reduced-motion readers get a static page.
 */
export function PageAnimator({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: (() => void)[] = [];

        // Opening sequence: name, then stamp, then the headword letter by letter.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            q('[data-anim="title"]'),
            { opacity: 0, y: -18, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          )
          .fromTo(
            q('[data-anim="stamp"]'),
            { opacity: 0, scale: 1.7, rotation: -12 },
            { opacity: 1, scale: 1, rotation: -2, duration: 0.55, ease: "back.out(1.8)" },
            0.25,
          )
          .fromTo(
            q('[data-anim="word"] [data-char]'),
            { opacity: 0, y: 48, rotation: () => gsap.utils.random(-8, 8) },
            {
              opacity: 1,
              y: 0,
              rotation: 0,
              duration: 0.75,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            0.5,
          );

        // Everything else waits to be scrolled into view, then arrives in a staggered wave.
        const reveal = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars) => {
          const targets = q(selector);
          if (!targets.length) return;
          gsap.set(targets, from);
          ScrollTrigger.batch(targets, {
            // Fire a little before the element's top edge enters the viewport's bottom.
            // Anything nearer the bottom (the footer on a page that can't scroll)
            // would otherwise never reach a stricter trigger line.
            start: "top bottom-=24",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { ...to, delay: 0.2, stagger: 0.09, overwrite: true }),
          });
        };
        reveal('[data-anim="rise"]', { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        });
        reveal('[data-anim="rule"]', { opacity: 1, scaleX: 0 }, {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
        });

        // Hovering the headword makes its letters hop in a wave.
        q('[data-anim="word"]').forEach((word) => {
          const chars = word.querySelectorAll("[data-char]");
          let hop: gsap.core.Tween | undefined;
          const onEnter = () => {
            if (hop?.isActive()) return;
            hop = gsap.to(chars, {
              y: -14,
              duration: 0.16,
              yoyo: true,
              repeat: 1,
              stagger: 0.04,
              ease: "power2.out",
            });
          };
          word.addEventListener("pointerenter", onEnter);
          cleanups.push(() => word.removeEventListener("pointerenter", onEnter));
        });

        // Archive links slide toward the reader on hover or keyboard focus.
        q('[data-hover="nudge"]').forEach((el) => {
          const move = (x: number) => () =>
            gsap.to(el, { x, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          const events: [string, () => unknown][] = [
            ["pointerenter", move(8)],
            ["focus", move(8)],
            ["pointerleave", move(0)],
            ["blur", move(0)],
          ];
          for (const [name, fn] of events) el.addEventListener(name, fn);
          cleanups.push(() => {
            for (const [name, fn] of events) el.removeEventListener(name, fn);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });
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
