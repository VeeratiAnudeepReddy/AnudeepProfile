/**
 * Motion mode. The page starts in the mode the visitor's system asks for (reduced or full) unless they have
 * chosen one with the Motion switch in the dock. The mode lives on <html data-motion="full|reduced">, and the
 * stylesheet and scripts both read it from there.
 */
export type Motion = "full" | "reduced";

export const isReduced = (): boolean => typeof document !== "undefined" && document.documentElement.dataset.motion === "reduced";
export const osReduced = (): boolean => typeof document !== "undefined" && document.documentElement.dataset.os === "reduced";

export function setMotion(mode: Motion, remember = true) {
  document.documentElement.dataset.motion = mode;
  if (remember) { try { localStorage.setItem("motion", mode); } catch {} }
  window.dispatchEvent(new CustomEvent("motionchange", { detail: mode }));
}

/** Runs in <head> before first paint so the right mode is on the page from the start. */
export const motionBootScript =
  "(function(){var d=document.documentElement;d.classList.add('js');try{var os=matchMedia('(prefers-reduced-motion: reduce)').matches;var p=localStorage.getItem('motion');d.dataset.os=os?'reduced':'full';d.dataset.motion=(p==='full'||p==='reduced')?p:(os?'reduced':'full');}catch(e){d.dataset.motion='full';d.dataset.os='full';}})();";
