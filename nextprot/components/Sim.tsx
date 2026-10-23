"use client";
import { useEffect, useRef } from "react";
import { initPond, initPrivacy, initTraffic, initCivix, initRail, initRecover } from "@/lib/sims";
import type { Sim as SimName } from "@/lib/content";

const inits = { pond: initPond, privacy: initPrivacy, traffic: initTraffic, civix: initCivix, rail: initRail, recover: initRecover };

export default function Sim({ name, title }: { name: SimName; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const dispose = inits[name](root);
    return () => { dispose(); root.innerHTML = ""; };
  }, [name]);
  return <div ref={ref} className="sim" id={`sim-${name}`} data-title={title} />;
}
