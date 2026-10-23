"use client";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Digits roll up to their value once. Each column is an empty element whose digit strip is drawn by CSS,
 * so the page text holds the real number once (for screen readers, copy and search) and nothing else.
 */
export default function RollingNumber({ value, suffix = "", plain }: { value: string; suffix?: string; plain: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { node.classList.add("is-in"); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  let i = 0;
  return (
    <span ref={ref} className="roll">
      <span className="sr-only">{plain}</span>
      <span className="roll__digits" aria-hidden="true">
        {value.split("").map((ch, k) =>
          /\d/.test(ch) ? (
            <span className="roll__col" key={k}><span className="roll__strip" style={{ "--d": ch, "--i": i++ } as CSSProperties} /></span>
          ) : (
            <span className="roll__sym" data-ch={ch} key={k} />
          )
        )}
        {suffix && <em data-ch={suffix} />}
      </span>
    </span>
  );
}
