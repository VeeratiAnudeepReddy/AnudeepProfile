"use client";
import { useEffect, useRef } from "react";
import { isReduced } from "@/lib/motion";

type Star = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; ovx: number; ovy: number; r: number; z: number; ph: number; period: number; rose: boolean; born: number; life: number };
type Ring = { x: number; y: number; t0: number };

/**
 * A sparse silver star field, living inside the hero only.
 *  - Few stars, each on its own depth layer, drifting through a slow flow field so the sky is always moving.
 *  - Each star joins only its one or two nearest neighbours, and those joins breathe in and out.
 *  - The pointer disturbs them: stars are shoved away from it, swirl a little, and spring back to their drift.
 *    A small rose constellation joins the nearest ones to the pointer, with a fading trail behind it.
 *  - A click sends a shockwave through the sky that scatters the stars.
 */
export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const hero = cv.closest(".hero") as HTMLElement;
    let visible = true;
    let reduce = isReduced();
    const onMotion = () => { reduce = isReduced(); };
    window.addEventListener("motionchange", onMotion);
    const coarse = matchMedia("(pointer: coarse)").matches;

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, stars: Star[] = [];
    let rings: Ring[] = [];
    let scrollV = 0, lastScrollY = scrollY;
    const ptr = { x: -9999, y: -9999, on: false, speed: 0 };
    const trail: { x: number; y: number; t: number }[] = [];
    let releaseTimer = 0;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const LINK = () => (w < 700 ? 130 : 175);
    const REACH = () => (w < 700 ? 150 : 230);

    const make = (x?: number, y?: number): Star => ({
      x: x ?? Math.random() * w, y: y ?? Math.random() * h, vx: 0, vy: 0, ox: 0, oy: 0, ovx: 0, ovy: 0,
      r: 0.5 + Math.random() * 1.15, z: 0.25 + Math.random() * 0.75,
      ph: Math.random() * 6.283, period: 1400 + Math.random() * 2800, rose: Math.random() < 0.09, born: 0, life: Infinity,
    });

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = hero.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = clamp(Math.round((w * h) / (coarse ? 26000 : 20000)), 26, 68);
      const base = stars.filter((s) => s.life === Infinity);
      stars = [...base.slice(0, want), ...stars.filter((s) => s.life !== Infinity)];
      while (stars.filter((s) => s.life === Infinity).length < want) stars.push(make());
    };

    const shock = (x: number, y: number, now: number) => {
      rings.push({ x, y, t0: now });
      for (const s of stars) {                         // push everything near the click outward
        const dx = s.x + s.ox - x, dy = s.y + s.oy - y, d = Math.hypot(dx, dy) || 1;
        if (d < 380) { const f = (1 - d / 380) * 16 * (0.5 + s.z * 0.5); s.ovx += (dx / d) * f; s.ovy += (dy / d) * f; }
      }
      for (let i = 0; i < 5; i++) {                    // a few bright, short-lived stars
        const a = Math.random() * 6.283, sp = 1.2 + Math.random() * 2.2;
        const s = make(x, y);
        s.vx = Math.cos(a) * sp; s.vy = Math.sin(a) * sp; s.r = 1.1 + Math.random(); s.z = 1; s.born = now; s.life = 3800; s.rose = i % 2 === 0;
        stars.push(s);
      }
      const temp = stars.filter((s) => s.life !== Infinity);
      if (temp.length > 30) stars = stars.filter((s) => s.life === Infinity || temp.indexOf(s) >= temp.length - 30);
    };

    const frame = (now: number, dtRaw: number) => {
      const dt = clamp(dtRaw, 0, 40) / 16.67;           // 1 at 60fps
      ctx.clearRect(0, 0, w, h);

      // scroll speed, smoothed, drives the streaks and the parallax
      const sy = scrollY;
      const dy = 0; lastScrollY = sy;
      if (!reduce) scrollV += (clamp(dy, -80, 80) - scrollV) * 0.18;

      ptr.speed *= 0.9;
      const link = LINK(), reach = REACH();
      const t = now;
      type P = { x: number; y: number; a: number; r: number; s: Star };
      const pts: P[] = [];

      for (const s of stars) {
        {
          // flow field: slow rivers of movement that change over time
          const fx = Math.cos(s.y * 0.0036 + t * 0.00021 + s.ph) * 0.34 + 0.06;
          const fy = Math.sin(s.x * 0.0031 + t * 0.00017) * 0.28 - 0.04;
          const sp = (0.35 + s.z * 0.9) * (reduce ? 0.45 : 1);
          s.vx += (fx * sp - s.vx) * 0.02 * dt;
          s.vy += (fy * sp - s.vy) * 0.02 * dt;

          // the pointer disturbs the stars: they are shoved away from it, swirl a little, then spring back to their drift
          if (ptr.on) {
            const px = s.x + s.ox - ptr.x, py = s.y + s.oy - ptr.y, d = Math.hypot(px, py), push = reach * 0.95;
            if (d < push && d > 0.5) {
              const k = 1 - d / push;
              const f = k * k * (2.2 + Math.min(ptr.speed, 45) * 0.12);
              s.ovx += ((px / d) * f + (-py / d) * k * 0.35) * dt;
              s.ovy += ((py / d) * f + (px / d) * k * 0.35) * dt;
            }
          }
          s.ovx += -s.ox * 0.017 * dt; s.ovy += -s.oy * 0.017 * dt;
          const damp = Math.pow(0.93, dt); s.ovx *= damp; s.ovy *= damp;
          s.ox += s.ovx * dt; s.oy += s.ovy * dt;
          s.x += s.vx * dt; s.y += s.vy * dt - scrollV * 0.16 * s.z;
          if (s.x < -20) s.x += w + 40; else if (s.x > w + 20) s.x -= w + 40;
          if (s.y < -20) s.y += h + 40; else if (s.y > h + 20) s.y -= h + 40;
        }
        let fade = 1;
        if (s.life !== Infinity) { const age = (now - s.born) / s.life; if (age >= 1) continue; fade = 1 - age * age; }
        const tw = 0.5 + 0.5 * Math.sin(t / s.period * 6.283 + s.ph);
        pts.push({ x: s.x + s.ox, y: s.y + s.oy, a: (0.25 + tw * 0.75) * (0.3 + s.z * 0.7) * fade, r: s.r * (0.7 + s.z * 0.6), s });
      }

      // joins: each star reaches only for its one or two nearest neighbours
      ctx.lineWidth = 0.8;
      const seen = new Set<number>();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let b1 = -1, d1 = link, b2 = -1, d2 = link;
        for (let j = 0; j < pts.length; j++) {
          if (j === i) continue;
          const dx = p.x - pts[j].x; if (dx > link || dx < -link) continue;
          const dyy = p.y - pts[j].y; if (dyy > link || dyy < -link) continue;
          const d = Math.hypot(dx, dyy);
          if (d < d1) { b2 = b1; d2 = d1; b1 = j; d1 = d; } else if (d < d2) { b2 = j; d2 = d; }
        }
        for (const [j, d] of [[b1, d1], [b2, d2]] as [number, number][]) {
          if (j < 0) continue;
          const key = i < j ? i * 1000 + j : j * 1000 + i;
          if (seen.has(key)) continue; seen.add(key);
          const q = pts[j];
          const breathe = 0.55 + 0.45 * Math.sin(t * 0.0011 + i * 1.7 + j);
          const a = (1 - d / link) * 0.3 * Math.min(p.a, q.a) * 1.7 * breathe;
          if (a < 0.012) continue;
          ctx.strokeStyle = `rgba(215,221,235,${a.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }

      // the stars: a point, a soft halo on the bigger ones, and a streak while the page is scrolling
      const streak = clamp(Math.abs(scrollV), 0, 60);
      for (const p of pts) {
        const col = p.s.rose ? "229,196,120" : "232,236,247";
        if (!reduce && streak > 2.5) {
          const len = streak * p.s.z * 0.9;
          const dir = scrollV > 0 ? 1 : -1;               // stars slide up while scrolling down, so the streak trails below
          const g = ctx.createLinearGradient(p.x, p.y, p.x, p.y + dir * len);
          g.addColorStop(0, `rgba(${col},${(p.a * 0.75).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`);
          ctx.strokeStyle = g; ctx.lineWidth = Math.max(0.8, p.r * 0.9);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + dir * len); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${col},${p.a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        if (p.r > 1.05 && p.a > 0.55) {
          ctx.fillStyle = `rgba(${col},${(p.a * 0.1).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4.2, 0, 6.283); ctx.fill();
        }
      }

      {
        // pointer: a small constellation to the nearest stars, plus a fading trail
        if (ptr.on) {
          const near = pts.map((p) => ({ p, d: Math.hypot(p.x - ptr.x, p.y - ptr.y) })).filter((o) => o.d < reach).sort((a, b) => a.d - b.d).slice(0, 5);
          ctx.lineWidth = 0.9;
          for (const { p, d } of near) {
            const a = (1 - d / reach) * 0.75;
            ctx.strokeStyle = `rgba(224,190,110,${a.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(ptr.x, ptr.y); ctx.lineTo(p.x, p.y); ctx.stroke();
            ctx.fillStyle = `rgba(240,218,160,${(a * 0.9).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 0.9, 0, 6.283); ctx.fill();
          }
          for (let i = 0; i + 1 < near.length; i++) {      // the neighbours join each other too
            const a = near[i].p, b = near[i + 1].p, d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < link * 1.3) { ctx.strokeStyle = "rgba(235,238,248,.22)"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
          const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 54);
          g.addColorStop(0, "rgba(229, 205, 143, .24)"); g.addColorStop(1, "rgba(229, 205, 143, 0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 54, 0, 6.283); ctx.fill();
        }
        while (trail.length && now - trail[0].t > 150) trail.shift();
        if (trail.length > 1) {
          for (let i = 1; i < trail.length; i++) {
            const age = (now - trail[i].t) / 150, a = (1 - age) * 0.3;
            ctx.strokeStyle = `rgba(224,190,110,${a.toFixed(3)})`; ctx.lineWidth = 1.1 * (1 - age) + 0.2;
            ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
          }
        }

        // click shockwaves
        rings = rings.filter((r) => now - r.t0 < 900);
        for (const r of rings) {
          const k = (now - r.t0) / 900, e = 1 - Math.pow(1 - k, 3);
          ctx.strokeStyle = `rgba(235,238,248,${((1 - k) * 0.5).toFixed(3)})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(r.x, r.y, 8 + e * 180, 0, 6.283); ctx.stroke();
          ctx.strokeStyle = `rgba(213,175,77,${((1 - k) * 0.35).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(r.x, r.y, 4 + e * 120, 0, 6.283); ctx.stroke();
        }
      }
      stars = stars.filter((s) => s.life === Infinity || now - s.born < s.life);
    };

    const loop = (now: number) => {
      const dt = last ? now - last : 16.67;
      last = now;
      if (visible) frame(now, dt);
      raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top - 20 && e.clientY <= r.bottom + 20 };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (!p.inside) { ptr.on = false; return; }
      if (ptr.on) ptr.speed = Math.max(ptr.speed, Math.hypot(p.x - ptr.x, p.y - ptr.y));
      ptr.x = p.x; ptr.y = p.y; ptr.on = true; clearTimeout(releaseTimer);
      trail.push({ x: p.x, y: p.y, t: performance.now() });
      if (trail.length > 8) trail.shift();
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      if (!p.inside) return;
      ptr.x = p.x; ptr.y = p.y; ptr.on = true; clearTimeout(releaseTimer);
      shock(p.x, p.y, performance.now());
    };
    const onUp = (e: PointerEvent) => { if (e.pointerType !== "mouse") releaseTimer = window.setTimeout(() => (ptr.on = false), 900); };
    const onLeave = () => { ptr.on = false; };
    const onVis = () => {
      cancelAnimationFrame(raf); last = 0;
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize); ro.observe(hero);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(hero);
    resize();
    document.addEventListener("visibilitychange", onVis);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
      window.removeEventListener("motionchange", onMotion);
      ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
