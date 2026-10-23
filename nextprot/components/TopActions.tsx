"use client";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

/**
 * Hire me and Download CV, fixed in the top-right corner. They slip out of the way while you read downward
 * and come back as soon as you scroll up, so they never sit on top of the text.
 */
export default function TopActions() {
  const [away, setAway] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      if (Math.abs(y - last) > 6) { setAway(y > last && y > 360); last = y; }
      if (y < 120) setAway(false);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`top-actions ${away ? "away" : ""}`}>
      <a className="btn-solid" href={`mailto:${profile.email}`} data-magnetic><i className="fa-solid fa-arrow-right" /><span className="ta-label">Hire me</span></a>
      <a className="btn-ghost" href={profile.resume} download data-magnetic aria-label="Download CV"><i className="fa-solid fa-download" /><span className="ta-label">Download CV</span></a>
    </div>
  );
}
