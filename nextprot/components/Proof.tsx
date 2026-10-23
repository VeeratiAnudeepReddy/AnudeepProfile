import { stats } from "@/lib/content";
import Reveal from "./Reveal";
import RollingNumber from "./RollingNumber";

/** Four numbers from the projects, directly under the hero, so the claim has evidence before any detail. */
export default function Proof() {
  return (
    <section className="proof" aria-label="Results at a glance">
      <div className="wrap proof-grid">
        {stats.map((s, i) => (
          <Reveal key={s.label} className="stat glass" variant={i === 0 ? "left" : i === stats.length - 1 ? "right" : "up"} delay={i * 100}>
            <b><RollingNumber value={s.value} suffix={s.suffix} plain={s.plain} /></b>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
