 "use client";

import { useEffect, useRef } from "react";

export function FireDivider() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let W = 0;
    let H = 0;

    const resizeCanvas = () => {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const COLS = 80;
    const ROWS = 20;
    const fire: number[][] = Array.from({ length: ROWS }, () =>
      new Array(COLS).fill(0)
    );

    function spreadFire() {
      for (let x = 0; x < COLS; x++) {
        fire[ROWS - 1][x] = Math.random() > 0.3 ? 255 : 0;
      }
      for (let y = 0; y < ROWS - 1; y++) {
        for (let x = 0; x < COLS; x++) {
          const rand = Math.floor(Math.random() * 3) - 1;
          const nx = Math.max(0, Math.min(COLS - 1, x + rand));
          fire[y][nx] = Math.max(0, fire[y + 1][x] - Math.random() * 40);
        }
      }
    }

    function renderFire() {
      if (!context) return;

      context.clearRect(0, 0, W, H);
      const cw = W / COLS;
      const ch = H / ROWS;

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const v = fire[y][x];
          if (v < 5) continue;
          const alpha = v / 255;
          const r = Math.min(255, v * 2.5);
          const g = Math.max(0, v - 80);
          context.fillStyle = `rgba(${r},${g},0,${alpha * 0.85})`;
          context.fillRect(x * cw, y * ch, cw + 1, ch + 1);
        }
      }

      const fade = context.createLinearGradient(0, 0, 0, H);
      fade.addColorStop(0, "rgba(26,16,8,1)");
      fade.addColorStop(0.3, "rgba(26,16,8,0)");
      fade.addColorStop(0.7, "rgba(26,16,8,0)");
      fade.addColorStop(1, "rgba(26,16,8,1)");
      context.fillStyle = fade;
      context.fillRect(0, 0, W, H);
    }

    let frameId: number;

    const loop = () => {
      spreadFire();
      renderFire();
      frameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="dnd-divider-fire">
      <canvas ref={canvasRef} className="dnd-fire-canvas" />
    </div>
  );
}

