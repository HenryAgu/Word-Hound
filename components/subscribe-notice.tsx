"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const STORAGE_KEY = "word-hoard:subscription";
const CHANGE_EVENT = "word-hoard:subscription-change";

type Status = "idle" | "subscribed" | "blocked" | "unsupported";

function subscribeToChanges(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Returns a primitive so React sees a stable snapshot between renders.
function readStatus(): Status {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  if (Notification.permission === "granted" && localStorage.getItem(STORAGE_KEY)) {
    return "subscribed";
  }
  return "idle";
}

const readServerStatus = (): Status => "idle";

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** The "Notices to the Reader" card: asks the browser for leave to send the daily word. */
export function SubscribeNotice() {
  const stored = useSyncExternalStore(subscribeToChanges, readStatus, readServerStatus);
  const [asking, setAsking] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousView = useRef<string | null>(null);

  const view = asking ? "asking" : stored;

  // When the card changes state (ask → awaiting → subscribed…), the new copy
  // settles in line by line, and the tick draws itself.
  useGSAP(
    () => {
      const previous = previousView.current;
      previousView.current = view;
      if (previous === null || previous === view) return; // first paint: the page animator handles it
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

      gsap.from(contentRef.current!.children, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]", contentRef.current).forEach((shape, i) => {
        const length = shape.getTotalLength();
        gsap.fromTo(
          shape,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.6, delay: 0.25 + i * 0.4, ease: "power2.inOut" },
        );
      });
    },
    { scope: contentRef, dependencies: [view] },
  );

  async function subscribe() {
    setAsking(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            // The 9am delivery is scheduled against the reader's own clock.
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            subscribedAt: new Date().toISOString(),
          }),
        );
      }
    } finally {
      setAsking(false);
      notifyChange();
    }
  }

  function unsubscribe() {
    localStorage.removeItem(STORAGE_KEY);
    notifyChange();
  }

  return (
    <section
      data-anim="rise"
      aria-labelledby="notice-title"
      className="flex flex-col gap-3 border-2 border-ink bg-[rgba(255,250,235,0.35)] px-4 py-5 text-center"
    >
      <div ref={contentRef} aria-live="polite" className="flex flex-col gap-3">
        {asking ? (
          <>
            <Title>Awaiting Thy Leave</Title>
            <Text>
              Thy browser is asking whether this gazette may send thee notices. Answer it, that we
              may proceed.
            </Text>
          </>
        ) : stored === "subscribed" ? (
          <>
            <div className="flex justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="text-accent"
              >
                <circle data-draw cx="17" cy="17" r="14" />
                <path data-draw d="M10 17.5l5 5 9-10.5" />
              </svg>
            </div>
            <Title>Thou Art Subscribed</Title>
            <Text>
              Thy word shall arrive at nine of the clock, thy local time. Thy time zone hath been
              recorded.
            </Text>
            <button type="button" onClick={unsubscribe} className="btn btn-outline min-h-11 px-3 text-[17px]">
              Unsubscribe
            </button>
          </>
        ) : stored === "blocked" ? (
          <>
            <Title>Leave Was Denied</Title>
            <Text>
              Notices are blocked for this site. Allow them in thy browser’s site settings, then try
              once more.
            </Text>
            <button type="button" onClick={subscribe} className="btn btn-outline min-h-11 px-3 text-[17px]">
              Try again
            </button>
          </>
        ) : stored === "unsupported" ? (
          <>
            <Title>No Post-Rider Here</Title>
            <Text>
              This browser cannot receive notices from a gazette. Try another, and thy daily word
              shall find thee.
            </Text>
          </>
        ) : (
          <>
            <Title>Have a Word Sent Daily</Title>
            <Text>
              One word from a far tongue or a far age, brought to thy door each morning at nine.
            </Text>
            <button type="button" onClick={subscribe} className="btn btn-solid px-3 text-lg">
              Send me a word daily
            </button>
            <p className="text-[15px] leading-[1.35] text-ink-soft italic">
              Thy browser shall first ask leave. Cancel at any time.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 id="notice-title" className="text-[27px] leading-[1.1] italic">
      {children}
    </h2>
  );
}

function Text({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-[1.4]">{children}</p>;
}
