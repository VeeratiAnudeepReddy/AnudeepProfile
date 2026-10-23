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
          <p className="hero-kicker hero-load" style={d(0)}>Full-Stack &amp; AI Engineer</p>
          <h1 aria-label="Anudeep Reddy Veerati">
            <span className="mask"><span style={{ "--i": 0 } as CSSProperties}>Anudeep Reddy</span></span>
            <span className="mask"><span style={{ "--i": 1 } as CSSProperties}>Veerati</span></span>
          </h1>
          <p className="hero-tag hero-load" style={d(380)}>
            <span>Ideas into systems.</span>
            <span>Systems into impact.</span>
          </p>
          <div className="hero-text hero-load" style={d(480)}>
            <p>I build full-stack software end to end, from polished web and mobile interfaces to the APIs, data models and algorithms that power them.</p>
            <p>I turn complex problems into products people use, and I have taken one idea all the way to a patent application.</p>
          </div>
          <div className="hero-follow hero-load" style={d(560)}>
            <span>Find me on</span>
            <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><i className="fa-regular fa-envelope" /></a>
          </div>
        </div>
        <div className="hero-visual" data-tilt>
          <div className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anudeep.jpg" alt="Portrait of Anudeep Reddy Veerati" width={1080} height={1080} fetchPriority="high" />
            <div className="portrait-cap">
              <strong>Anudeep Reddy Veerati</strong>
              <span>Hyderabad, India</span>
            </div>
          </div>
          <span className="float-chip float-chip--status">Open to internships &amp; SDE roles</span>
          <span className="float-chip float-chip--edu"><i className="fa-solid fa-graduation-cap" />B.Tech CSE · VNRVJIET</span>
        </div>
      </div>
    </section>
  );
}
