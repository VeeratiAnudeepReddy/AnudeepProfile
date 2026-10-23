"use client";
import { useEffect, useRef, useState } from "react";

/**
 * A path that runs down between the project slides. It lights up as you scroll, a bright head travels along it,
 * and every project has a node on it: nodes behind the head are lit, the one in front of you pulses, and any node
 * can be clicked to jump to its project.
 */
export default function ProjectMap({ titles }: { titles: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ys, setYs] = useState<number[]>([]);
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    const map = ref.current!;
    const list = map.parentElement as HTMLElement;
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".proj"));
    let centers: number[] = [];
    let raf = 0;

    const measure = () => {
      const top = list.getBoundingClientRect().top + scrollY;
      centers = rows.map((r) => r.getBoundingClientRect().top + scrollY - top + r.offsetHeight / 2);
      setYs(centers);
      map.style.setProperty("--len", `${list.offsetHeight}px`);
      update();
    };
    const update = () => {
      raf = 0;
      const top = list.getBoundingClientRect().top;
      const mid = innerHeight * 0.52;                                   // the line the head follows
      const p = Math.max(0, Math.min(list.offsetHeight, mid - top));
      map.style.setProperty("--p", `${p.toFixed(1)}px`);
      let a = 0, d = Infinity, l = -1;
      centers.forEach((c, i) => {
        if (Math.abs(c - p) < d) { d = Math.abs(c - p); a = i; }
        if (c <= p + 8) l = i;
      });
      setActive((v) => (v === a ? v : a));
      setLit((v) => (v === l ? v : l));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    measure();
    const ro = new ResizeObserver(measure); ro.observe(list); rows.forEach((r) => ro.observe(r));
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("scroll", onScroll); removeEventListener("resize", measure); };
  }, []);

  const go = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const t = document.getElementById(`proj-${i}`);
    if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - Math.max(80, (innerHeight - t.offsetHeight) / 2), behavior: "smooth" });
  };

  return (
    <div ref={ref} className="proj-map" role="navigation" aria-label="Project path">
      <span className="proj-map__track" />
      <span className="proj-map__fill" />
      <span className="proj-map__head" />
      {ys.map((y, i) => (
        <a
          key={i}
          href={`#proj-${i}`}
          onClick={go(i)}
          className={`proj-map__node ${i <= lit ? "on" : ""} ${i === active ? "now" : ""}`}
          style={{ top: y }}
          aria-label={`Go to ${titles[i]}`}
        >
          <span className="proj-map__tip">{titles[i]}</span>
        </a>
      ))}
    </div>
  );
}
