"use client";

import { useState, MouseEvent, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
// Imagen 1 (fondo): se ve completa siempre
import heroImageBase from "@/app/IMG/Homepage/fantasy-style-character-fire.jpg";
// Imagen 2 (detalle ojo): se REVELA poco a poco con el mouse
import heroImageReveal from "@/app/IMG/Homepage/dragons-fantasy-artificial-intelligence-image (1).jpg";

interface HomeHeroProps {
  loggedIn: boolean;
}

export function HomeHero({ loggedIn }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end center"],
  });

  // La imagen se va ocultando y alejando al hacer scroll
  const imageOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  // El contenido sube y se reduce ligeramente mientras avanzamos hacia la siguiente sección
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

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
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden snap-start"
      aria-label="Presentación"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fondo: envuelto en motion.div para desvanecer + ligero zoom/parallax al hacer scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: imageOpacity, scale: imageScale, y: imageY }}
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
      </motion.div>

      {/* Capa oscura para mejorar legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"
        aria-hidden
      />

      {/* Contenido */}
      <motion.div
        className="relative max-w-3xl mx-auto px-4 text-center"
        style={{ y: contentY, scale: contentScale }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p
          className="font-medieval text-dnd-gold text-sm uppercase tracking-widest mb-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-highlight-hover cursor-default">
            Tu campamento para Dungeons &amp; Dragons
          </span>
        </motion.p>
        <motion.h1
          className="font-medieval text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-highlight-hover cursor-default">Mea Culpa</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_0_18px_rgba(0,0,0,0.85)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-highlight-hover cursor-default">
            Inventario, gremios, tiendas y economía en un solo lugar. Organiza
            tu partida sin perder la magia.
          </span>
        </motion.p>
        {!loggedIn && (
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
          >
            <Link
              href="/login"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-5 h-5" />
              Iniciar sesión
            </Link>
          </motion.div>
        )}
        <motion.p
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            href="/leyenda"
            className="text-white/70 text-sm hover:text-dnd-gold transition-colors underline underline-offset-2"
          >
            Vive la leyenda D&amp;D
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}