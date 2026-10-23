"use client";
import { useEffect, useRef } from "react";

/** One statement that fills from part ink to full ink word by word as it rises (CSS scroll timeline). */
export default function InkFill({ text, className = "statement" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !CSS.supports("animation-timeline: view()")) return;
    const words = text.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.textContent = w;
      el.append(s, i < words.length - 1 ? " " : "");
    });
    el.classList.add("is-filling");
    return () => { el.textContent = text; el.classList.remove("is-filling"); };
  }, [text]);
  return <p ref={ref} className={className}>{text}</p>;
}
