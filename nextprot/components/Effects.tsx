"use client";
import { useEffect, useRef } from "react";
import { isReduced } from "@/lib/motion";

/**
 * Pointer polish through one set of delegated listeners: card spotlight, hero tilt, magnetic buttons,
 * the light that follows the pointer across the grid, depth parallax variables and a trailing aura.
 */
export default function Effects() {
  const aura = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    let magnet: HTMLElement | null = null;
    let px = -400, py = -400, ax = -400, ay = -400, raf = 0, awake = false;

    const loop = () => {
      raf = 0;
      const full = !isReduced();
      // the grid light and parallax follow the pointer directly; the aura trails behind it
      root.style.setProperty("--px", `${px}px`);
      root.style.setProperty("--py", `${py}px`);
      root.style.setProperty("--nx", full ? ((px / innerWidth) * 2 - 1).toFixed(3) : "0");
      root.style.setProperty("--ny", full ? ((py / innerHeight) * 2 - 1).toFixed(3) : "0");
      if (aura.current) {
        ax += (px - ax) * 0.16; ay += (py - ay) * 0.16;
        aura.current.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
        aura.current.style.opacity = full && awake ? "1" : "0";
      }
      if (Math.abs(px - ax) > 0.3 || Math.abs(py - ay) > 0.3) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const move = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const calm = isReduced();
      px = e.clientX; py = e.clientY; awake = true; kick();

      aura.current?.classList.toggle("hot", !!t.closest("a, button, [role=tab], input, textarea, select"));

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
    const out = () => { awake = false; if (aura.current) aura.current.style.opacity = "0"; };
    const down = () => aura.current?.classList.add("press");
    const up = () => aura.current?.classList.remove("press");

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", out);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", out);
    };
  }, []);

  return <div ref={aura} className="aura" aria-hidden="true" />;
}
