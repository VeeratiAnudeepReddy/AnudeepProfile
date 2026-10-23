"use client";
import { useEffect, useRef, type CSSProperties } from "react";

/** A title whose authored lines rise out of a mask once it scrolls into view. */
export default function HeadLines({ lines, className = "sec-title" }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { node.classList.add("is-in"); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <h2 ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="mask" key={i}><span style={{ "--i": i } as CSSProperties}>{l}</span></span>
      ))}
    </h2>
  );
}
