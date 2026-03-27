 "use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Velocidad de la animación: por defecto "normal" */
  speed?: "slow" | "normal" | "fast";
};

export function Reveal({ children, className = "", speed = "normal" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const speedClass =
    speed === "slow"
      ? "reveal-slow"
      : speed === "fast"
      ? "reveal-fast"
      : "reveal-normal";

  return (
    <div
      ref={ref}
      className={`reveal ${speedClass} ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

