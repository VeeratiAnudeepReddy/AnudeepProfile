import { timeline } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Experience() {
  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <SectionHead kicker="Experience" lines={["Where I've", "built things"]} />
        <div className="timeline">
          <div className="tl-spine" aria-hidden="true" />
          {timeline.map((t, i) => (
            <div className="tl-row" key={t.title}>
              <Reveal variant={i % 2 ? "right" : "left"} className="tl-card glass" delay={80}>
                <div className="tl-head"><h3>{t.title}</h3><span className="pill">{t.date}</span></div>
                <div className="tl-org">{t.org}</div>
                <ul className="proj-points cascade">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
