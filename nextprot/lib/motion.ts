/**
 * Motion mode. The site always runs with its animations on: <html data-motion="full"> is set before first paint
 * and the stylesheet and scripts read it from there.
 */
export const isReduced = (): boolean => false;

/** Runs in <head> before first paint. */
export const motionBootScript =
  "(function(){var d=document.documentElement;d.classList.add('js');d.dataset.motion='full';})();";
