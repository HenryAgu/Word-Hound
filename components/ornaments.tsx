import type { CSSProperties, ElementType, ReactNode } from "react";

/** Small-caps heading set between two hairlines, e.g. "In Brief". */
export function SectionHeading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      data-anim="rise"
      className={`border-y border-ink py-1.5 text-center font-sc text-lg tracking-[0.12em] lg:text-xl ${className}`}
    >
      {children}
    </Tag>
  );
}

/** A rule broken by a fleuron. */
export function Fleuron({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3.5 lg:gap-4 ${className}`}>
      <div data-anim="rule" className="grow origin-right border-t border-ink-soft" />
      <span data-anim="rise" className="text-xl text-accent lg:text-[22px]">
        ❦
      </span>
      <div data-anim="rule" className="grow origin-left border-t border-ink-soft" />
    </div>
  );
}

/**
 * A headword that scales down to fit its column. `maxClass` sets the largest
 * size, per breakpoint, via the --max custom property.
 */
export function WordDisplay({
  word,
  as: Tag = "p",
  maxClass,
  charWidth,
  split = false,
  className = "",
}: {
  word: string;
  as?: ElementType;
  maxClass: string;
  /** Approximate glyph width in em; raise it for tighter columns. */
  charWidth?: number;
  /** Render each letter separately so the page animator can play it in letter by letter. */
  split?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`word-fit w-full ${maxClass} ${className}`}
      style={
        {
          "--chars": word.length,
          ...(charWidth ? { "--cw": charWidth } : {}),
        } as CSSProperties
      }
    >
      {split ? (
        // The label keeps the word intact for screen readers; the letters are decoration.
        <Tag data-anim="word" aria-label={word}>
          {[...word].map((char, i) => (
            <span key={i} data-char aria-hidden className="inline-block">
              {char}
            </span>
          ))}
        </Tag>
      ) : (
        <Tag>{word}</Tag>
      )}
    </div>
  );
}

/** The word's example sentence, ruled top and bottom like a pull-quote. */
export function ExampleQuote({
  label,
  example,
  size = "lg",
  className = "",
}: {
  label: string;
  example: { text: string; translation?: string; source: string };
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <figure
      data-anim="rise"
      className={`border-y-[3px] border-double border-ink px-1.5 pt-3.5 pb-4 lg:px-3.5 lg:pt-4 lg:pb-5 ${className}`}
    >
      <figcaption className="font-sc text-[15px] tracking-[0.18em] text-ink-soft lg:text-base">
        {label}
      </figcaption>
      <blockquote
        className={`mt-1 italic leading-tight ${size === "lg" ? "text-2xl lg:text-[32px]" : "text-2xl lg:text-[28px]"}`}
      >
        {example.text}
      </blockquote>
      {example.translation && (
        <p className="mt-1 text-[19px] leading-snug lg:text-[22px]">{example.translation}</p>
      )}
      <p className="mt-1.5 text-[15px] tracking-[0.04em] text-ink-soft lg:text-[17px]">
        {example.source}
      </p>
    </figure>
  );
}
