"use client";
import { useEffect } from "react";
import { isReduced } from "@/lib/motion";

/**
 * Pointer polish through one set of delegated listeners: card spotlight, hero tilt, magnetic buttons,
 * the light that follows the pointer across the grid and depth parallax variables.
 */
export default function Effects() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    let magnet: HTMLElement | null = null;
    let px = -400, py = -400, raf = 0;

    const loop = () => {
      raf = 0;
      const full = !isReduced();
      // the grid light and the depth parallax follow the pointer
      root.style.setProperty("--px", `${px}px`);
      root.style.setProperty("--py", `${py}px`);
      root.style.setProperty("--nx", full ? ((px / innerWidth) * 2 - 1).toFixed(3) : "0");
      root.style.setProperty("--ny", full ? ((py / innerHeight) * 2 - 1).toFixed(3) : "0");
      raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const move = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const calm = isReduced();
      px = e.clientX; py = e.clientY; kick();

      const card = t.closest<HTMLElement>(".glass, .hero-visual");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const tilt = calm ? null : t.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        tilt.classList.add("tilting");
        tilt.style.setProperty("--ry", `${(nx * 10).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-ny * 10).toFixed(2)}deg`);
      }
      const mag = calm ? null : t.closest<HTMLElement>("[data-magnetic]");
      if (mag) {
        magnet = mag;
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px)`;
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
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
    };
  }, []);

  return null;
}
