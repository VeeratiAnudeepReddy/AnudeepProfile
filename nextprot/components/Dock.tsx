"use client";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { isReduced } from "@/lib/motion";

const BASE = 46;        // resting size of an icon, px
const PEAK = 86;        // size of the icon right under the pointer
const SIGMA = 74;       // how far the swell reaches, px

/**
 * A dock at the bottom of the screen. Icons swell toward the pointer and ease back, the active section
 * is marked, and a label floats above the icon you point at. On touch it stays a plain, compact row.
 */
export default function Dock() {
  const [active, setActive] = useState("home");
  const dockRef = useRef<HTMLElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);

  // which section is in the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach((n) => { const s = document.getElementById(n.id); if (s) io.observe(s); });
    return () => io.disconnect();
  }, []);

  // magnification: each icon eases toward the size its distance from the pointer asks for
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const sizes = nav.map(() => BASE);
    let mouseX: number | null = null, raf = 0;

    const apply = () => {
      let moving = false;
      items.current.forEach((el, i) => {
        if (!el) return;
        let target = BASE;
        if (mouseX !== null) {
          const r = el.getBoundingClientRect(), c = r.left + r.width / 2;
          target = BASE + (PEAK - BASE) * Math.exp(-((mouseX - c) ** 2) / (2 * SIGMA * SIGMA));
        }
        sizes[i] += (target - sizes[i]) * (isReduced() ? 1 : 0.22);
        if (Math.abs(target - sizes[i]) > 0.3) moving = true; else sizes[i] = target;
        el.style.setProperty("--size", `${sizes[i].toFixed(1)}px`);
      });
      raf = moving || mouseX !== null ? requestAnimationFrame(apply) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const move = (e: PointerEvent) => { mouseX = e.clientX; kick(); };
    const leave = () => { mouseX = null; kick(); };
    dock.addEventListener("pointermove", move);
    dock.addEventListener("pointerleave", leave);
    return () => { dock.removeEventListener("pointermove", move); dock.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) scrollTo({ top: id === "home" ? 0 : t.getBoundingClientRect().top + scrollY - 40, behavior: "smooth" });
  };

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <nav className="dock" ref={dockRef} aria-label="Sections">
        {nav.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            ref={(el) => { items.current[i] = el; }}
            className={`dock-item ${active === n.id ? "active" : ""}`}
            onClick={go(n.id)}
            aria-label={n.label}
            aria-current={active === n.id ? "page" : undefined}
          >
            <span className="dock-label">{n.label}</span>
            <i className={n.icon} />
          </a>
        ))}
      </nav>
    </>
  );
}
