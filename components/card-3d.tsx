"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useCallback } from "react";

/**
 * Tarjeta 3D interactiva con efecto hover:
 * - Inclinación 3D según posición del cursor (rotateX, rotateY, perspective)
 * - Brillo/reflejo que sigue el cursor
 * - Parallax suave en capas internas
 * - Glassmorphism, borde con glow, transiciones suaves
 * Las variables --mouse-x y --mouse-y (0-1) se actualizan por JS; el resto es CSS.
 */
export function Card3D() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--mouse-x", String(x));
    card.style.setProperty("--mouse-y", String(y));
    card.classList.add("card-3d--hover");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mouse-x", "0.5");
    card.style.setProperty("--mouse-y", "0.5");
    card.classList.remove("card-3d--hover");
  }, []);

  return (
    <section className="card-3d-section" aria-label="Tarjeta destacada del reino">
      {/* Fondo: imagen fantasía/fuego + gradiente encima */}
      <div className="card-3d-section-bg">
        <Image
          src="/IMG/Homepage/fantasy-style-character-fire.jpg"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="card-3d-section-bg-overlay" aria-hidden />
      </div>

      <div className="card-3d-wrapper">
        <div
          ref={cardRef}
          className="card-3d"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={
            {
              "--mouse-x": "0.5",
              "--mouse-y": "0.5",
            } as React.CSSProperties
          }
        >
          {/* Capa de fondo: imagen del dragón */}
          <div className="card-3d-bg">
            <Image
              src="/IMG/Homepage/dragons-fantasy-artificial-intelligence-image.jpg"
              alt=""
              fill
              className="card-3d-bg-img"
              sizes="(max-width: 768px) 100vw, 480px"
              priority={false}
            />
            <div className="card-3d-bg-overlay" />
          </div>

          {/* Brillo/reflejo que sigue el cursor */}
          <div className="card-3d-shine" aria-hidden />

          {/* Capa de contenido con parallax suave */}
          <div className="card-3d-content">
            <h3 className="card-3d-title">El Campamento del Dragón</h3>
            <p className="card-3d-desc">
              Donde la aventura cobra vida. Gestiona tu partida con estilo.
            </p>
            <Link href="/login" className="card-3d-btn">
              Entrar al reino
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
