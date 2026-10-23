import { patent, podium, competitive, certifications, leadership } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const side = (i: number, n: number) => (i === 0 ? "left" : i === n - 1 ? "right" : "up") as "left" | "right" | "up";

function GroupTitle({ icon, title, note }: { icon: string; title: string; note: string }) {
  return (
    <Reveal variant="left" className="group-title">
      <span className="icon-badge"><i className={icon} /></span>
      <h3>{title}</h3>
      <span>{note}</span>
    </Reveal>
  );
}

export default function Awards() {
  const firsts = podium.filter((p) => p.rank === "1st");
  const runners = podium.filter((p) => p.rank !== "1st");

  return (
    <section className="sec" id="awards">
      <div className="wrap">
        <SectionHead kicker="Recognition" lines={["Patent, wins", "and leadership"]} lead="A published patent application, first-place finishes, competitive programming and the communities I help run." />

        {/* ---- patent ---- */}
        <GroupTitle icon="fas fa-file-shield" title="Patent" note="Intellectual property" />
        <Reveal variant="left" className="patent glass">
          <div className="patent-main">
            <div className="tags pop-in"><span className="pill">Published</span><span className="pill">Awaiting examination</span></div>
            <h3>{patent.title}</h3>
            <p>{patent.summary}</p>
            <dl className="patent-facts">
              <div><dt>Application no.</dt><dd>{patent.number}</dd></div>
              <div><dt>Filed</dt><dd>{patent.filed}</dd></div>
              <div><dt>Applicant</dt><dd>{patent.applicant}</dd></div>
            </dl>
          </div>
          <ol className="steps" aria-label="Patent status">
            {patent.steps.map((st) => (
              <li key={st.label} className={st.done ? "done" : "next"}>
                <span className="step-dot" />
                <strong>{st.label}</strong>
                <span>{st.note}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ---- podium ---- */}
        <GroupTitle icon="fas fa-trophy" title="First places" note="Hackathons and contests" />
        <div className="podium">
          {firsts.map((p, i) => (
            <Reveal key={p.event} variant={side(i, firsts.length)} delay={i * 80} className="win glass">
              <span className="win-rank" aria-hidden="true">{p.rank}</span>
              <span className="pill win-place">First place</span>
              <h4>{p.event}</h4>
              {p.scale && <span className="win-scale">{p.scale}</span>}
              {p.project && <p className="win-project"><i className="fas fa-diagram-project" /> {p.project}</p>}
              <p className="win-detail">{p.detail}</p>
              {p.note && <p className="win-note"><i className="fas fa-newspaper" /> {p.note}</p>}
              <div className="tags pop-in">{p.tags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
            </Reveal>
          ))}
        </div>

        <GroupTitle icon="fas fa-medal" title="Runner-up finishes" note="Against large fields" />
        <div className="duo">
          {runners.map((p, i) => (
            <Reveal key={p.event} variant={i % 2 ? "right" : "left"} delay={i * 80} className="win win--runner glass">
              <span className="pill win-place">{p.rank}</span>
              <h4>{p.event}</h4>
              {p.scale && <span className="win-scale">{p.scale}</span>}
              <p className="win-detail">{p.detail}</p>
            </Reveal>
          ))}
        </div>

        {/* ---- competitive programming ---- */}
        <GroupTitle icon="fas fa-terminal" title="Competitive programming" note="Algorithms under the clock" />
        <div className="duo">
          {competitive.map((c, i) => (
            <Reveal key={c.title} variant={i % 2 ? "right" : "left"} delay={i * 80} className="item glass">
              <span className="icon-badge spin-in"><i className={c.icon} /></span>
              <div><h4>{c.title}</h4><span className="item-meta">{c.meta}</span><p>{c.detail}</p></div>
            </Reveal>
          ))}
        </div>

        {/* ---- certifications ---- */}
        <GroupTitle icon="fas fa-certificate" title="Certifications" note="Verified learning" />
        <div className="trio">
          {certifications.map((c, i) => (
            <Reveal key={c.title} variant={side(i, certifications.length)} delay={i * 80} className="item item--stack glass">
              <span className="icon-badge spin-in"><i className={c.icon} /></span>
              <div><h4>{c.title}</h4><span className="item-meta">{c.issuer}</span><p>{c.detail}</p></div>
            </Reveal>
          ))}
        </div>

        {/* ---- leadership ---- */}
        <GroupTitle icon="fas fa-users" title="Leadership" note="Communities I help run" />
        <div className="trio">
          {leadership.map((c, i) => (
            <Reveal key={c.title} variant={side(i, leadership.length)} delay={i * 80} className="item item--stack glass">
              <span className="icon-badge spin-in"><i className={c.icon} /></span>
              <div><h4>{c.title}</h4><span className="item-meta">{c.org}</span><p>{c.detail}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
