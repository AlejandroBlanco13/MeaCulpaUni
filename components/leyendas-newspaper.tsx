"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function NewspaperContent({ mastheadAction }: { mastheadAction?: ReactNode }) {
  return (
    <>
      <header className={`newspaper-masthead shrink-0 ${mastheadAction ? "flex items-center justify-between gap-3" : ""}`}>
        <div>
          Leyendas del reino
          <div className="newspaper-masthead-sub">Crónicas del Campamento</div>
        </div>
        {mastheadAction}
      </header>
      <div className="newspaper-dateline shrink-0">
        <span>Vol. I — N.º 12</span>
        <span>Semana del dragón</span>
      </div>
      <div className="newspaper-content">
        <article className="newspaper-article">
          <h4 className="newspaper-headline">El origen del campamento</h4>
          <p className="newspaper-byline">— Corresponsal del Reino</p>
          <p className="newspaper-body">
            Cuentan que el dragón eligió esta tierra para que aventureros y maestros de juego encontraran un refugio donde organizar sus campañas sin perder un solo objeto ni una moneda.
          </p>
        </article>
        <article className="newspaper-article">
          <h4 className="newspaper-headline">La primera espada registrada</h4>
          <p className="newspaper-byline">— Archivo del Campamento</p>
          <p className="newspaper-body">
            Fue en los anales de Mea Culpa donde un novato inscribió su primera arma. Desde entonces, miles de personajes han pasado por el inventario del campamento.
          </p>
        </article>
        <article className="newspaper-article">
          <h4 className="newspaper-headline">El gremio de los cronistas</h4>
          <p className="newspaper-byline">— Redacción</p>
          <p className="newspaper-body">
            Los jugadores que guardan cada partida en noticias y registros forman la memoria viva del reino. Sus historias alimentan las leyendas del campamento.
          </p>
        </article>
      </div>
      <footer className="newspaper-footer shrink-0">
        Impreso en el Campamento del Dragón · Más crónicas en la próxima edición
      </footer>
    </>
  );
}

export function LeyendasNewspaper() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [modalOpen]);

  const modal = modalOpen && mounted && createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Leyendas del reino - periódico ampliado"
    >
      <div
        className="newspaper-panel newspaper-modal flex flex-col w-full max-w-3xl max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          <NewspaperContent
            mastheadAction={
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="shrink-0 w-9 h-9 rounded-full bg-dnd-gold/20 hover:bg-dnd-gold/30 text-dnd-gold flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            }
          />
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <aside className="lg:h-full min-w-0 flex flex-col lg:pl-2">
        <div
          className="newspaper-panel flex-1 min-h-0 flex flex-col overflow-y-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dnd-gold/50 rounded-lg"
          onClick={() => setModalOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Abrir Leyendas del reino en ventana ampliada"
        >
          <NewspaperContent />
        </div>
      </aside>
      {modal}
    </>
  );
}
