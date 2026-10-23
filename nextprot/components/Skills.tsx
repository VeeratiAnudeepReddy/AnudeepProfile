"use client";
import { useState } from "react";
import { skillLayers, usedIn } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

/**
 * The stack drawn as layers of a system, from the interface down to the foundations, with the data flow between them.
 * Point at a skill to see which of my projects used it.
 */
export default function Skills() {
  const [picked, setPicked] = useState<{ layer: string; item: string } | null>(null);
  const total = skillLayers.reduce((n, l) => n + l.groups.reduce((m, g) => m + g.items.length, 0), 0);

  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <SectionHead kicker="Skills" lines={["The stack,", "layer by layer"]} lead={`${total} skills, sorted by the layer of a system they work in. Point at one to see where I have used it.`} />
        <div className="stack">
          {skillLayers.map((l, li) => {
            const mine = picked?.layer === l.id ? picked.item : null;
            const where = mine ? usedIn(mine) : [];
            const count = l.groups.reduce((m, g) => m + g.items.length, 0);
            return (
              <div className="stack-row" key={l.id}>
                <Reveal variant={li % 2 ? "right" : "left"} delay={60} className={`layer glass layer--${l.id}`}>
                  <div className="layer-id">
                    <span className="icon-badge spin-in"><i className={l.icon} /></span>
                    <div>
                      <h3>{l.title}</h3>
                      <span className="layer-tag">{l.tag}</span>
                    </div>
                    <span className="layer-count">{count}</span>
                  </div>
                  <div className="layer-body">
                    <p className="layer-text">{l.text}</p>
                    <div className="layer-groups">
                      {l.groups.map((g) => (
                        <div className="layer-group" key={g.label}>
                          <h4>{g.label}</h4>
                          <div className="layer-chips pop-in">
                            {g.items.map((it) => {
                              const n = usedIn(it).length;
                              return (
                                <button
                                  key={it}
                                  className={`chip-skill ${mine === it ? "on" : ""}`}
                                  onMouseEnter={() => setPicked({ layer: l.id, item: it })}
                                  onMouseLeave={() => setPicked(null)}
                                  onFocus={() => setPicked({ layer: l.id, item: it })}
                                  onBlur={() => setPicked(null)}
                                  onClick={() => setPicked(mine === it ? null : { layer: l.id, item: it })}
                                >
                                  {it}
                                  {n > 0 && <i className="dots" aria-label={`used in ${n} projects`}>{Array.from({ length: Math.min(n, 4) }, (_, k) => <b key={k} />)}</i>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`layer-used ${mine ? "show" : ""}`} aria-live="polite">
                      {mine && (where.length
                        ? <><strong>{mine}</strong><span>used in</span>{where.map((w) => <span className="pill" key={w}>{w}</span>)}</>
                        : <><strong>{mine}</strong><span>is part of my everyday toolkit</span></>)}
                    </div>
                  </div>
                </Reveal>
                {li < skillLayers.length - 1 && <span className="flow" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
