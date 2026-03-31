"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollAnimation =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "scale"
  | "slide-left"
  | "slide-right";

interface ScrollSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  background?: ReactNode;
  animation?: ScrollAnimation;
  sticky?: boolean;
  minHeightClass?: string;
  /** Clase para el contenedor interior (ej. max-w-7xl para más ancho) */
  innerClassName?: string;
}

export function ScrollSection({
  id,
  className,
  children,
  background,
  animation = "fade-up",
  sticky = false,
  minHeightClass = "min-h-screen",
  innerClassName,
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.2, 1, 0.4]);

  const variants = {
    hidden: {
      opacity: animation === "fade" ? 0 : 0,
      y: animation === "fade-up" ? 40 : animation === "fade-down" ? -40 : 0,
      x: animation === "slide-left" ? 40 : animation === "slide-right" ? -40 : 0,
      scale: animation === "scale" ? 0.92 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden scroll-mt-20",
        minHeightClass,
        className,
      )}
    >
      {background && (
        <motion.div
          style={{ y: bgY, opacity: bgOpacity }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {background}
        </motion.div>
      )}

      {background && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      )}

      <div
        className={cn(
          "relative flex w-full",
          sticky ? "items-stretch" : "items-center",
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={variants}
          className={cn(
            "mx-auto flex w-full items-center justify-center py-16 lg:py-24",
            sticky ? "sticky top-16 lg:top-20" : "",
            innerClassName ?? "max-w-4xl px-6",
          )}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

