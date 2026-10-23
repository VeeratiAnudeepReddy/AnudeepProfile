import Reveal from "./Reveal";
import HeadLines from "./HeadLines";

/** The same opening for every section: a label, a title that rises from a mask, one supporting sentence. */
export default function SectionHead({ kicker, lines, lead }: { kicker: string; lines: string[]; lead?: string }) {
  return (
    <div className="sec-head">
      <Reveal as="p" variant="left" className="kicker">{kicker}</Reveal>
      <HeadLines lines={lines} />
      {lead && <Reveal as="p" variant="left" delay={220} className="sec-lead">{lead}</Reveal>}
    </div>
  );
}
