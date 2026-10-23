"use client";
import { useEffect, useState } from "react";

/** Template splash, kept. It lifts like a curtain, can be skipped with a click, and shows once per session. */
export default function Intro() {
  const [phase, setPhase] = useState<"show" | "leaving" | "gone">("show");

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try { seen = sessionStorage.getItem("intro-seen") === "1"; } catch {}
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) { root.classList.add("ready"); setPhase("gone"); return; }
    const timers: number[] = [];
    const leave = () => {
      setPhase("leaving");
      timers.push(window.setTimeout(() => root.classList.add("ready"), 420));
      timers.push(window.setTimeout(() => setPhase("gone"), 1050));
      try { sessionStorage.setItem("intro-seen", "1"); } catch {}
    };
    timers.push(window.setTimeout(leave, 2800));
    (window as any).__skipIntro = leave;
    return () => { timers.forEach(clearTimeout); delete (window as any).__skipIntro; };
  }, []);

  if (phase === "gone") return null;
  return (
    <div id="intro" className={phase === "leaving" ? "leaving" : ""} onClick={() => (window as any).__skipIntro?.()} role="presentation">
      <div className="main">
        <div className="card">
          <div className="top-tags">
            <span className="dot">● SYSTEM READY</span>
            <span>PORTFOLIO 2026</span>
            <span>UI LOADING</span>
          </div>
          <div className="content">
            <div className="left">
              <h1>
                <span className="mask"><span style={{ "--i": 0 } as any}>Ideas into</span></span>
                <span className="mask"><span style={{ "--i": 1 } as any}>systems.</span></span>
                <span className="mask"><span style={{ "--i": 2 } as any}>Systems into</span></span>
                <span className="mask"><span style={{ "--i": 3 } as any}>impact.</span></span>
              </h1>
              <p className="desc">I&rsquo;m Anudeep, a full-stack and AI engineer building full-stack, AI-powered and algorithmic software that ships and scales.</p>
              <div className="live-line"><span>LIVE STATUS</span></div>
              <div className="buttons">
                <div className="btn"><i className="fa-solid fa-code" /> CODE</div>
                <div className="btn"><i className="fa-solid fa-user" /> PROFILE</div>
                <div className="btn"><i className="fa-brands fa-github" /> SOURCE</div>
              </div>
              <div className="site-link"><i className="fa-solid fa-globe" /> github.com/VeeratiAnudeepReddy</div>
            </div>
            <div className="right">
              <div className="right-head"><span>CORE UI</span><span className="online">ONLINE</span></div>
              <div className="orbit-box">
                <div className="orbit">
                  <i className="fa-solid fa-layer-group i1" />
                  <i className="fa-solid fa-bolt i2" />
                  <i className="fa-solid fa-code i3" />
                  <i className="fa-solid fa-wifi i4" />
                </div>
                <div className="core"><span>WELCOME</span></div>
              </div>
              <div className="stats">
                <div><h4>Web</h4><p>&amp; mobile</p></div>
                <div><h4>AI</h4><p>&amp; algorithms</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="intro-skip">Click to skip</span>
    </div>
  );
}
