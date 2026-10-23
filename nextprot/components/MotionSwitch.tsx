"use client";
import { useEffect, useState } from "react";
import { isReduced, osReduced, setMotion, type Motion } from "@/lib/motion";

/**
 * The Motion switch at the end of the dock. The page follows the system's reduced-motion setting until the
 * visitor chooses. If the system asks for reduced motion, a small prompt says so once and offers full animations.
 */
export default function MotionSwitch() {
  const [mode, setMode] = useState<Motion>("full");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setMode(isReduced() ? "reduced" : "full");
    const sync = () => setMode(isReduced() ? "reduced" : "full");
    window.addEventListener("motionchange", sync);
    let asked = false;
    try { asked = localStorage.getItem("motion-hint") === "1" || localStorage.getItem("motion") !== null; } catch {}
    const t = osReduced() && !asked ? window.setTimeout(() => setHint(true), 2600) : 0;
    return () => { window.removeEventListener("motionchange", sync); clearTimeout(t); };
  }, []);

  const dismiss = () => { setHint(false); try { localStorage.setItem("motion-hint", "1"); } catch {} };
  const toggle = () => { const next: Motion = mode === "full" ? "reduced" : "full"; setMotion(next); setMode(next); dismiss(); };
  const enable = () => { setMotion("full"); setMode("full"); dismiss(); };

  return (
    <>
      <button type="button" className={`dock-item dock-motion ${mode === "full" ? "active" : ""}`} onClick={toggle} aria-pressed={mode === "full"} aria-label={mode === "full" ? "Animations on. Turn off" : "Animations off. Turn on"}>
        <span className="dock-label">{mode === "full" ? "Animations: on" : "Animations: off"}</span>
        <i className="fa-solid fa-wand-magic-sparkles" />
      </button>
      {hint && (
        <div className="motion-hint" role="dialog" aria-label="Animations">
          <p>Your system asks for reduced motion, so the animations are toned down.</p>
          <div>
            <button type="button" className="btn-solid" onClick={enable}>Turn on full animations</button>
            <button type="button" className="btn-ghost" onClick={dismiss}>Keep it calm</button>
          </div>
        </div>
      )}
    </>
  );
}
