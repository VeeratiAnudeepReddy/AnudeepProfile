import { profile } from "@/lib/content";

/** The two main actions, fixed in the top-right corner so they stay in reach on every section. */
export default function TopActions() {
  return (
    <div className="top-actions">
      <a className="btn-solid" href={`mailto:${profile.email}`} data-magnetic><i className="fa-solid fa-arrow-right" /><span className="ta-label">Hire me</span></a>
      <a className="btn-ghost" href={profile.resume} download data-magnetic aria-label="Download CV"><i className="fa-solid fa-download" /><span className="ta-label">Download CV</span></a>
    </div>
  );
}
