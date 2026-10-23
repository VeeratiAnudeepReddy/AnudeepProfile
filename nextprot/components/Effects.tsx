"use client";
import { useEffect } from "react";

/** Pointer polish through one set of delegated listeners: card spotlight, hero tilt, magnetic buttons. */
export default function Effects() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const card = t.closest<HTMLElement>(".glass, .hero-visual");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const tilt = t.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        tilt.classList.add("tilting");
        tilt.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-ny * 8).toFixed(2)}deg`);
      }
      const mag = t.closest<HTMLElement>("[data-magnetic]");
      if (mag) {
        magnet = mag;
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.2).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.28).toFixed(1)}px)`;
      } else if (magnet) { magnet.style.transform = ""; magnet = null; }
    };
    const leave = (e: PointerEvent) => {
      const tilt = (e.target as HTMLElement).closest("[data-tilt]") as HTMLElement | null;
      if (tilt && !tilt.contains(e.relatedTarget as Node)) {
        tilt.classList.remove("tilting");
        tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg");
      }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", leave); };
  }, []);
  return null;
}
