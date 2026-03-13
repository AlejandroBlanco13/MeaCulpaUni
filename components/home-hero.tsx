"use client";

import { useState, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
// Imagen 1 (fondo): se ve completa siempre
import heroImageBase from "@/app/IMG/Homepage/fantasy-style-character-fire.jpg";
// Imagen 2 (detalle ojo): se REVELA poco a poco con el mouse
import heroImageReveal from "@/app/IMG/Homepage/dragons-fantasy-artificial-intelligence-image (1).jpg";

interface HomeHeroProps {
  loggedIn: boolean;
}

export function HomeHero({ loggedIn }: HomeHeroProps) {
  // Máscara inicial: todo transparente (no se ve la imagen 2)
  const [mask, setMask] = useState<string>(
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)"
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    const x = Math.min(100, Math.max(0, relativeX * 100));
    const y = Math.min(100, Math.max(0, relativeY * 100));

    const radiusInner = 18;
    const radiusOuter = 40;

    const gradient = `radial-gradient(circle at ${x}% ${y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${radiusInner}%, rgba(0,0,0,0) ${radiusOuter}%)`;
    setMask(gradient);
  }

  function handleMouseLeave() {
    // Al salir, volvemos a ocultar completamente la imagen 2
    setMask(
      "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)"
    );
  }

  return (
    <section
      className="relative flex items-center justify-center min-h-screen overflow-hidden snap-start"
      aria-label="Presentación"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen base: la primera que se ve */}
      <Image
        src={heroImageBase}
        alt="Dragón en una cueva oscura con luz de fuego al fondo"
        fill
        priority
        className="object-cover"
      />

      {/* Imagen que se va revelando donde pasa el mouse */}
      <div
        className="absolute inset-0 transition-[mask-image,webkit-mask-image] duration-200"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        <Image
          src={heroImageReveal}
          alt="Versión detallada del dragón en un entorno de fantasía"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Capa oscura para mejorar legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"
        aria-hidden
      />

      {/* Contenido */}
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="font-medieval text-dnd-gold text-sm uppercase tracking-widest mb-3">
          <span className="text-highlight-hover cursor-default">
            Tu campamento para Dungeons &amp; Dragons
          </span>
        </p>
        <h1 className="font-medieval text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          <span className="text-highlight-hover cursor-default">Mea Culpa</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_0_18px_rgba(0,0,0,0.85)]">
          <span className="text-highlight-hover cursor-default">
            Inventario, gremios, tiendas y economía en un solo lugar. Organiza
            tu partida sin perder la magia.
          </span>
        </p>
        {!loggedIn && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/registro"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-5 h-5" />
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/70 text-white/90 px-6 py-3 rounded font-medium hover:bg-white/10 hover:border-white transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}