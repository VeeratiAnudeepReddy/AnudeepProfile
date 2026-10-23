"use client";
import { useState } from "react";
import { profile } from "@/lib/content";
import Reveal from "./Reveal";
import HeadLines from "./HeadLines";

const icon = {
  mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone: "M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  gh: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
  li: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};
const Svg = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
);

export default function Contact() {
  const [toast, setToast] = useState("");
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1800); };

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); say("Email copied"); } catch { location.href = `mailto:${profile.email}`; }
  };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    const subject = encodeURIComponent(`Portfolio enquiry from ${v("user_name")}`);
    const body = encodeURIComponent(`${v("message")}\n\n- ${v("user_name")} (${v("user_email")})`);
    location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="sec">
      <div className="wrap">
        <Reveal as="p" variant="left" className="kicker">Contact</Reveal>
        <HeadLines className="contact-title" lines={["Let's build", "something together"]} />
        <div className="contact-grid" style={{ marginTop: "clamp(36px, 5vw, 64px)" }}>
          <Reveal variant="left" className="contact-info">
            <p>I am always open to discussing exciting projects, internships and new opportunities. Write to me and I will reply quickly.</p>
            <div className="contact-item"><Svg d={icon.mail} /><button className="email-copy" onClick={copy} title="Copy email"><span>{profile.email}</span><i className="fa-regular fa-copy" /></button></div>
            <div className="contact-item"><Svg d={icon.phone} /><span>{profile.phone}</span></div>
            <div className="contact-item"><Svg d={icon.pin} /><span>{profile.location}</span></div>
            <div className="socials">
              <a href={profile.github} className="social" aria-label="GitHub" target="_blank" rel="noopener" data-magnetic><Svg d={icon.gh} size={22} /></a>
              <a href={profile.linkedin} className="social" aria-label="LinkedIn" target="_blank" rel="noopener" data-magnetic><Svg d={icon.li} size={22} /></a>
              <a href={`mailto:${profile.email}`} className="social" aria-label="Email" data-magnetic><Svg d={icon.mail} size={22} /></a>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120} className="contact-form glass">
            <form onSubmit={submit}>
              <div className="field"><input type="text" placeholder="Your name" required name="user_name" /></div>
              <div className="field"><input type="email" placeholder="Your email" required name="user_email" /></div>
              <div className="field"><textarea name="message" placeholder="Your message" rows={5} required /></div>
              <button type="submit" className="btn-solid" data-magnetic>Send message <i className="fa-solid fa-arrow-right" /></button>
            </form>
          </Reveal>
        </div>
      </div>
      <footer className="footer wrap" style={{ marginTop: "clamp(72px, 9vw, 130px)" }}>
        <div className="footer-mark" aria-hidden="true">Anudeep Reddy Veerati</div>
        <div className="footer-row">
          <span>© 2026 Anudeep Reddy Veerati</span>
          <span className="footer-links">
            <a href={profile.github} target="_blank" rel="noopener">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </span>
          <a href="#home" className="to-top" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <i className="fa-solid fa-arrow-up" /></a>
        </div>
      </footer>
      <div className={`toast ${toast ? "on" : ""}`} role="status">{toast}</div>
    </section>
  );
}
