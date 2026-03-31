"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo global: capas CSS (pergamino, grunge, viñeta, niebla, marco) + partículas canvas opcionales.
 * pointer-events: none, detrás del contenido (z-0). Respeta prefers-reduced-motion.
 */
export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const c = canvas;
    const g = ctx;

    const count = 32;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }[] = [];

    let raf = 0;
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.1 + 0.25,
          a: Math.random() * 0.06 + 0.015,
        });
      }
    }

    function onResize() {
      resize();
      initParticles();
    }

    onResize();
    window.addEventListener("resize", onResize);

    function tick() {
      g.clearRect(0, 0, w, h);
      g.fillStyle = "rgba(249, 245, 233, 1)";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -2) p.x = w + 2;
        if (p.x > w + 2) p.x = -2;
        if (p.y < -2) p.y = h + 2;
        if (p.y > h + 2) p.y = -2;
        g.globalAlpha = p.a;
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="global-bg-stack pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="global-bg-layer global-bg-base" />
      <div className="global-bg-layer global-bg-parchment" />
      <div className="global-bg-layer global-bg-grunge" />
      <div className="global-bg-layer global-bg-vignette" />
      <div className="global-bg-layer global-bg-fog" />
      <div className="global-bg-layer global-bg-manuscript" />
      <canvas ref={canvasRef} className="global-bg-canvas" />
    </div>
  );
}
