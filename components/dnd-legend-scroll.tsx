"use client";

import { useState, useCallback, useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FireDivider } from "@/components/FireDivider";
import heroImageBase from "@/app/IMG/Homepage/fantasy-style-character-fire.jpg";
import heroImageReveal from "@/app/IMG/Homepage/dragons-fantasy-artificial-intelligence-image (1).jpg";

const TOTAL = 5;

function useCurrentRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
const PANELS = [
  { id: "inicio", label: "Inicio", navLabel: "El Inicio" },
  { id: "mundo", label: "El Mundo", navLabel: "El Mundo" },
  { id: "clases", label: "Clases", navLabel: "Las Clases" },
  { id: "codigo", label: "Código", navLabel: "El Código" },
  { id: "llamada", label: "La Llamada", navLabel: "La Llamada" },
];

function CrestIcon() {
  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" className="leyenda-ch-icon-svg">
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="#C9A84C" strokeWidth={1.5} />
      <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="#8B6914" strokeWidth={0.8} />
      <path d="M50 20 L50 80 M25 35 L75 65 M75 35 L25 65" stroke="#C9A84C" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={50} cy={50} r={8} fill="none" stroke="#F0D080" strokeWidth={1.2} />
      <circle cx={50} cy={50} r={3} fill="#C9A84C" />
      <circle cx={50} cy={20} r={3} fill="#C9A84C" />
      <circle cx={80} cy={35} r={2} fill="#8B6914" />
      <circle cx={80} cy={65} r={2} fill="#8B6914" />
      <circle cx={50} cy={80} r={3} fill="#C9A84C" />
      <circle cx={20} cy={65} r={2} fill="#8B6914" />
      <circle cx={20} cy={35} r={2} fill="#8B6914" />
    </svg>
  );
}

function DragonSkullIcon() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" className="leyenda-ch-icon-svg">
      <circle cx={40} cy={35} r={22} fill="none" stroke="#8B1A1A" strokeWidth={1.5} />
      <circle cx={40} cy={35} r={18} fill="none" stroke="#C9A84C" strokeWidth={0.8} strokeDasharray="3,3" />
      <circle cx={33} cy={30} r={4} fill="none" stroke="#C9A84C" strokeWidth={1} />
      <circle cx={47} cy={30} r={4} fill="none" stroke="#C9A84C" strokeWidth={1} />
      <circle cx={33} cy={30} r={1.5} fill="#C9A84C" />
      <circle cx={47} cy={30} r={1.5} fill="#C9A84C" />
      <path d="M34 44 L38 50 L42 44" fill="none" stroke="#C9A84C" strokeWidth={1} strokeLinecap="round" />
      <path d="M29 57 L29 66 M40 57 L40 68 M51 57 L51 66" stroke="#8B6914" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M10 35 Q6 25 12 18" stroke="#8B1A1A" strokeWidth={1.2} strokeLinecap="round" />
      <path d="M70 35 Q74 25 68 18" stroke="#8B1A1A" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function DndLegendScroll() {
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [heroMask, setHeroMask] = useState(
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)"
  );
  const currentRef = useCurrentRef(current);
  const trackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const wheelDeltaRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchXRef = useRef(0);
  const mouseXRef = useRef(0);
  const draggingRef = useRef(false);

  const handleHeroMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    const x = Math.min(100, Math.max(0, relativeX * 100));
    const y = Math.min(100, Math.max(0, relativeY * 100));
    const radiusInner = 18;
    const radiusOuter = 40;
    setHeroMask(
      `radial-gradient(circle at ${x}% ${y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${radiusInner}%, rgba(0,0,0,0) ${radiusOuter}%)`
    );
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setHeroMask(
      "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)"
    );
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goTo = useCallback(
    (n: number) => {
      if (busy) return;
      const next = Math.max(0, Math.min(TOTAL - 1, n));
      if (next === current) return;
      setBusy(true);
      const dir = next > current ? 1 : -1;
      const prevIdx = current;
      setCurrent(next);

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${next * 100}vw)`;
      }

      if (hintRef.current) {
        hintRef.current.style.opacity = next > 0 ? "0" : "";
      }

      const prevContent = document.getElementById(`leyenda-pi-${prevIdx}`);
      const currContent = document.getElementById(`leyenda-pi-${next}`);
      if (prevContent) {
        prevContent.classList.remove("leyenda-state-visible");
        prevContent.classList.add(dir > 0 ? "leyenda-state-hidden-l" : "leyenda-state-hidden-r");
      }
      if (currContent) {
        currContent.classList.remove("leyenda-state-hidden-l", "leyenda-state-hidden-r", "leyenda-state-visible");
        currContent.classList.add(dir > 0 ? "leyenda-state-hidden-r" : "leyenda-state-hidden-l");
      }

      const t = setTimeout(() => {
        if (currContent) {
          currContent.classList.remove("leyenda-state-hidden-l", "leyenda-state-hidden-r");
          currContent.classList.add("leyenda-state-visible");
        }
        setBusy(false);
      }, 200);
      return () => clearTimeout(t);
    },
    [busy, current]
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelDeltaRef.current += e.deltaY;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        if (Math.abs(wheelDeltaRef.current) > 40) {
          const cur = currentRef.current;
          goTo(wheelDeltaRef.current > 0 ? cur + 1 : cur - 1);
        }
        wheelDeltaRef.current = 0;
      }, 80);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchXRef.current;
      if (Math.abs(dx) > 55) {
        const cur = currentRef.current;
        goTo(dx < 0 ? cur + 1 : cur - 1);
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goTo]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      draggingRef.current = true;
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const dx = e.clientX - mouseXRef.current;
      if (Math.abs(dx) > 70) {
        const cur = currentRef.current;
        goTo(dx < 0 ? cur + 1 : cur - 1);
      }
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [goTo]);

  // Particles
  useEffect(() => {
    const containers = [1, 2, 3, 4, 5].map((i) => document.getElementById(`leyenda-ptcl-${i}`));
    const motes: HTMLDivElement[] = [];
    containers.forEach((el) => {
      if (!el) return;
      for (let i = 0; i < 20; i++) {
        const m = document.createElement("div");
        m.className = "leyenda-mote";
        const sz = Math.random() * 2.5 + 0.8;
        m.style.cssText = `
          left: ${Math.random() * 100}%;
          width: ${sz}px;
          height: ${sz}px;
          background: ${Math.random() > 0.45 ? "#C9A84C" : "#FF6B00"};
          animation-duration: ${Math.random() * 12 + 7}s;
          animation-delay: ${Math.random() * 10}s;
        `;
        el.appendChild(m);
        motes.push(m);
      }
    });
    return () => motes.forEach((m) => m.remove());
  }, []);

  const progressWidth = ((current + 1) / TOTAL) * 100;

  return (
    <div className="leyenda-scroll fixed inset-0 w-full h-full overflow-hidden bg-[var(--leyenda-stone)] text-[var(--leyenda-txt)] cursor-default">
      {/* Top nav */}
      <nav className="leyenda-top-nav">
        <Link href="/" className="leyenda-nav-logo">
          D&amp;D
        </Link>
        <ul className="leyenda-nav-links">
          {PANELS.map((p, i) => (
            <li key={p.id}>
              <button type="button" onClick={() => goTo(i)} className="leyenda-nav-link" data-panel={i}>
                {p.navLabel}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Progress bar */}
      <div
        className="leyenda-progress-bar"
        style={{ width: `${progressWidth}%` }}
        aria-hidden
      />

      {/* Side chapter dots */}
      <nav className="leyenda-side-chapters" aria-label="Capítulos">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`leyenda-side-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            data-panel={i}
            aria-current={i === current ? "step" : undefined}
          >
            <span className="leyenda-side-dot-circle" />
            <span className="leyenda-side-dot-label">{p.label}</span>
          </button>
        ))}
      </nav>

      {/* Main track */}
      <div className="leyenda-scroll-container">
        <div ref={trackRef} className="leyenda-panel-track" style={{ transform: `translateX(-${current * 100}vw)` }}>
          {/* Panel 1: Hero con fondo de dragón (reveal con ratón) */}
          <section
            className="leyenda-panel leyenda-panel-1"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            <div className="leyenda-hero-bg">
              <Image
                src={heroImageBase}
                alt="Dragón en un entorno de fuego y fantasía"
                fill
                priority
                className="object-cover"
              />
              <div
                className="leyenda-hero-reveal"
                style={{ WebkitMaskImage: heroMask, maskImage: heroMask }}
              >
                <Image
                  src={heroImageReveal}
                  alt="Detalle del ojo del dragón"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="leyenda-hero-overlay" aria-hidden />
            </div>
            <div className="leyenda-ptcl-layer" id="leyenda-ptcl-1" aria-hidden />
            <div className="leyenda-corner leyenda-corner-tl" />
            <div className="leyenda-corner leyenda-corner-tr" />
            <div className="leyenda-corner leyenda-corner-bl" />
            <div className="leyenda-corner leyenda-corner-br" />
            <div className="leyenda-bg-num" aria-hidden>I</div>
            <div className="leyenda-panel-inner leyenda-state-visible" id="leyenda-pi-0">
              <div className="leyenda-ch-label">Capítulo I — El Inicio</div>
              <div className="leyenda-ch-icon">
                <CrestIcon />
              </div>
              <h1 className="leyenda-ch-title">Dungeons<br />&amp; Dragons</h1>
              <div className="leyenda-ch-line"><div className="leyenda-ch-line-diamond" /></div>
              <p className="leyenda-ch-body">
                Adéntrate en un mundo de magia oscura, tesoros olvidados y criaturas que desafían la razón.
                Cada decisión es tu destino. Cada dungeon, una prueba de tu valor.
              </p>
              <button type="button" className="leyenda-ch-btn" onClick={() => goTo(1)}>
                ⚔&nbsp; Comienza la Aventura
              </button>
            </div>
          </section>

          {/* Panel 2: El Mundo */}
          <section className="leyenda-panel leyenda-panel-2">
            <div className="leyenda-ptcl-layer" id="leyenda-ptcl-2" aria-hidden />
            <div className="leyenda-corner leyenda-corner-tl" />
            <div className="leyenda-corner leyenda-corner-tr" />
            <div className="leyenda-corner leyenda-corner-bl" />
            <div className="leyenda-corner leyenda-corner-br" />
            <div className="leyenda-bg-num" aria-hidden>II</div>
            <div className="leyenda-panel-inner leyenda-state-hidden-r" id="leyenda-pi-1">
              <div className="leyenda-ch-label">Capítulo II — El Mundo</div>
              <h2 className="leyenda-ch-title">El Universo<br />de Faerûn</h2>
              <div className="leyenda-ch-line"><div className="leyenda-ch-line-diamond" /></div>
              <p className="leyenda-ch-body">
                Un continente vasto y peligroso donde dioses caminan entre mortales,
                dragones dominan los cielos y cada ciudad guarda un secreto ancestral.
              </p>
              <div className="leyenda-stat-grid">
                <div className="leyenda-stat-box">
                  <span className="leyenda-stat-val">500+</span>
                  <span className="leyenda-stat-lbl">Años de lore</span>
                </div>
                <div className="leyenda-stat-box">
                  <span className="leyenda-stat-val">∞</span>
                  <span className="leyenda-stat-lbl">Aventuras</span>
                </div>
                <div className="leyenda-stat-box">
                  <span className="leyenda-stat-val">d20</span>
                  <span className="leyenda-stat-lbl">La ley suprema</span>
                </div>
                <div className="leyenda-stat-box">
                  <span className="leyenda-stat-val">13</span>
                  <span className="leyenda-stat-lbl">Clases base</span>
                </div>
              </div>
            </div>
          </section>

          {/* Panel 3: Clases */}
          <section className="leyenda-panel leyenda-panel-3">
            <div className="leyenda-ptcl-layer" id="leyenda-ptcl-3" aria-hidden />
            <div className="leyenda-corner leyenda-corner-tl" />
            <div className="leyenda-corner leyenda-corner-tr" />
            <div className="leyenda-corner leyenda-corner-bl" />
            <div className="leyenda-corner leyenda-corner-br" />
            <div className="leyenda-bg-num" aria-hidden>III</div>
            <div className="leyenda-fire-strip h-20 overflow-hidden">
              <FireDivider />
            </div>
            <div className="leyenda-panel-inner leyenda-state-hidden-r" id="leyenda-pi-2">
              <div className="leyenda-ch-label">Capítulo III — Las Clases</div>
              <h2 className="leyenda-ch-title">Elige Tu<br />Destino</h2>
              <div className="leyenda-ch-line"><div className="leyenda-ch-line-diamond" /></div>
              <p className="leyenda-ch-body">Cada héroe nace de una elección. ¿Acero, magia, sombra o fe?</p>
              <div className="leyenda-class-row">
                {[
                  { icon: "⚔️", name: "Guerrero", sub: "Maestro del acero" },
                  { icon: "🔮", name: "Mago", sub: "Señor de los conjuros" },
                  { icon: "🗡️", name: "Pícaro", sub: "Hijo de las sombras" },
                  { icon: "✨", name: "Clérigo", sub: "Portador de la luz" },
                ].map((c) => (
                  <div key={c.name} className="leyenda-c-card">
                    <span className="leyenda-c-card-icon">{c.icon}</span>
                    <div className="leyenda-c-card-name">{c.name}</div>
                    <div className="leyenda-c-card-sub">{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panel 4: Código */}
          <section className="leyenda-panel leyenda-panel-4">
            <div className="leyenda-ptcl-layer" id="leyenda-ptcl-4" aria-hidden />
            <div className="leyenda-corner leyenda-corner-tl" />
            <div className="leyenda-corner leyenda-corner-tr" />
            <div className="leyenda-corner leyenda-corner-bl" />
            <div className="leyenda-corner leyenda-corner-br" />
            <div className="leyenda-bg-num" aria-hidden>IV</div>
            <div className="leyenda-panel-inner leyenda-state-hidden-r" id="leyenda-pi-3">
              <div className="leyenda-ch-label">Capítulo IV — El Código</div>
              <h2 className="leyenda-ch-title">El Código del<br />Aventurero</h2>
              <div className="leyenda-ch-line"><div className="leyenda-ch-line-diamond" /></div>
              <div className="leyenda-rules-list">
                {[
                  { n: "I", t: "El Dado Decide", b: "Ningún héroe escapa al destino del d20. Sus caprichos son la ley suprema." },
                  { n: "II", t: "El DM Es Dios", b: "El Dungeon Master teje la realidad. Discutir su palabra es discutir la existencia." },
                  { n: "III", t: "El Grupo Primero", b: "Un aventurero solitario muere rápido. La mesa es tu escudo y tu familia." },
                  { n: "IV", t: "Rol Sobre Todo", b: "Vive tu personaje. Sus miedos, sus glorias. Ahí nace la leyenda." },
                ].map((r) => (
                  <div key={r.n} className="leyenda-rule-row">
                    <div className="leyenda-rule-n">{r.n}</div>
                    <div>
                      <div className="leyenda-rule-t">{r.t}</div>
                      <div className="leyenda-rule-b">{r.b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panel 5: CTA */}
          <section className="leyenda-panel leyenda-panel-5">
            <div className="leyenda-ptcl-layer" id="leyenda-ptcl-5" aria-hidden />
            <div className="leyenda-corner leyenda-corner-tl" />
            <div className="leyenda-corner leyenda-corner-tr" />
            <div className="leyenda-corner leyenda-corner-bl" />
            <div className="leyenda-corner leyenda-corner-br" />
            <div className="leyenda-bg-num" aria-hidden>V</div>
            <div className="leyenda-panel-inner leyenda-state-hidden-r" id="leyenda-pi-4">
              <div className="leyenda-ch-label">Capítulo V — La Llamada</div>
              <div className="leyenda-ch-icon">
                <DragonSkullIcon />
              </div>
              <h2 className="leyenda-ch-title">El Dungeon<br />Te Llama</h2>
              <div className="leyenda-ch-line"><div className="leyenda-ch-line-diamond" /></div>
              <p className="leyenda-ch-body">
                La aventura no espera a los indecisos.<br />
                Tu historia está a punto de comenzar.<br />
                <em style={{ color: "var(--leyenda-gold-d)" }}>¿Estás listo?</em>
              </p>
              <Link href="/login" className="leyenda-ch-btn">
                ⚔&nbsp; Únete a la Partida
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom pips */}
      <div className="leyenda-bottom-bar">
        {PANELS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`leyenda-nav-pip ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            data-panel={i}
            aria-label={`Ir a panel ${i + 1}`}
          />
        ))}
      </div>

      <div className="leyenda-panel-counter" aria-live="polite">
        {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </div>
      <div ref={hintRef} className="leyenda-scroll-hint">
        Scroll o arrastra para explorar
      </div>

      <button type="button" className="leyenda-arrow-btn leyenda-arrow-prev" onClick={() => goTo(current - 1)} aria-label="Panel anterior">
        ←
      </button>
      <button type="button" className="leyenda-arrow-btn leyenda-arrow-next" onClick={() => goTo(current + 1)} aria-label="Panel siguiente">
        →
      </button>
    </div>
  );
}
