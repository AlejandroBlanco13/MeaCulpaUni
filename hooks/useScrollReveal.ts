import { useEffect } from "react";

type ScrollRevealOptions = {
  rootMargin?: string;
  threshold?: number;
};

/**
 * Hook global para activar animaciones de elementos `.scroll-reveal`
 * cuando entran en el viewport usando IntersectionObserver.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal")
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("visible");
            observer.unobserve(target);
          }
        }
      },
      {
        root: null,
        rootMargin: options.rootMargin ?? "0px 0px -10% 0px",
        threshold: options.threshold ?? 0.15,
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);
}

