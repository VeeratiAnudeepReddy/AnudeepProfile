import { projects } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Sim from "./Sim";
import ProjectMap from "./ProjectMap";

export default function Projects() {
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <SectionHead kicker="Projects" lines={["Featured work"]} lead="Six products across IoT, computer vision, AI agents, logistics and civic tech. Every one has a live demo beside it: read what it does, then try it." />
        <div className="proj-list">
          <ProjectMap titles={projects.map((p) => p.title.split(" – ")[0])} />
          {projects.map((p, i) => {
            const simSide = i % 2 ? "right" : "left";
            const bodySide = i % 2 ? "left" : "right";
            return (
              <article className="proj" id={`proj-${i}`} key={p.title}>
                <Reveal variant={simSide} className="proj-sim glass">
                  <div className="demo-bar"><span className="demo-tag">Live demo</span><span>{p.simTitle}</span></div>
                  <Sim name={p.sim} title={p.simTitle} />
                  <p className="try"><i className="fa-solid fa-hand-pointer" /><span><b>Try it.</b> {p.tryIt}</span></p>
                </Reveal>
                <Reveal variant={bodySide} delay={140} className="proj-body">
                  <h3>{p.title}</h3>
                  <p className="proj-summary">{p.summary}</p>
                  <div className="how-wrap">
                    <span className="mini-label">How it works</span>
                    <ol className="how">{p.flow.map((f) => <li key={f}>{f}</li>)}</ol>
                  </div>
                  <span className="mini-label">Highlights</span>
                  <ul className="proj-points cascade">{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
                  <div className="tags pop-in">{p.tags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
                  {p.link && (
                    <a href={p.link.href} className="btn-ghost proj-link" data-magnetic {...(p.link.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                      <i className={p.link.icon} /> {p.link.label}
                    </a>
                  )}
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
