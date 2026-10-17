"use client";

import { useEffect } from "react";

/**
 * `.reveal` elements are visible by default. The inline script in the root layout sets
 * `data-js` on <html> only when IntersectionObserver exists and motion is allowed; the CSS hides
 * `[data-js] .reveal` until this observer marks it revealed. Revealed elements stay revealed.
 */
export function RevealObserver() {
  useEffect(() => {
    if (!("js" in document.documentElement.dataset)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll(".reveal:not(.is-revealed)").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
