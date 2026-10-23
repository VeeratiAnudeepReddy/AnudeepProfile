import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import StarField from "./StarField";

const d = (ms: number) => ({ "--d": `${ms}ms` } as CSSProperties);

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <StarField />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="status hero-load" style={d(0)}>Open to internships &amp; SDE roles</p>
          <p className="hero-name hero-load" style={d(120)} aria-label="Anudeep Reddy Veerati">
            <span className="hero-name__first">Anudeep</span>
            <span className="hero-name__rest">Reddy Veerati</span>
          </p>
          <h1>
            <span className="mask"><span style={{ "--i": 0 } as CSSProperties}>Ideas into</span></span>
            <span className="mask"><span style={{ "--i": 1 } as CSSProperties}>systems.</span></span>
            <span className="mask"><span style={{ "--i": 2 } as CSSProperties}>Systems into</span></span>
            <span className="mask"><span style={{ "--i": 3 } as CSSProperties}>impact.</span></span>
          </h1>
          <div className="hero-text hero-load" style={d(500)}>
            <p>I build full-stack software end to end, from polished web and mobile interfaces to the APIs, data models and algorithms that power them.</p>
            <p>I turn complex problems into products people use, and I have taken one idea all the way to a patent application.</p>
          </div>
          <div className="hero-meta hero-load" style={d(580)}>
            <span><i className="fa-solid fa-briefcase" />Full-Stack &amp; AI Engineer</span>
            <span><i className="fa-solid fa-location-dot" />Hyderabad, India</span>
          </div>
          <div className="hero-actions hero-load" style={d(660)}>
            <a className="btn-solid" href={`mailto:${profile.email}`} data-magnetic><i className="fa-solid fa-arrow-right" /> Hire me</a>
            <a className="btn-ghost" href={profile.resume} download data-magnetic><i className="fa-solid fa-download" /> Download CV</a>
          </div>
          <div className="hero-follow hero-load" style={d(730)}>
            <span>Find me on</span>
            <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><i className="fa-regular fa-envelope" /></a>
          </div>
        </div>
        <div className="hero-visual glass" data-tilt>
          <div className="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anudeep.jpg" alt="Portrait of Anudeep Reddy Veerati" width={1080} height={1080} fetchPriority="high" />
          </div>
          <div className="hv-caption">
            <strong>Anudeep Reddy Veerati</strong>
            <span>B.Tech CSE · VNRVJIET · 2024 – 2028</span>
            <span><i className="fa-solid fa-location-dot" /> Hyderabad, India</span>
          </div>
        </div>
      </div>
    </section>
  );
}
