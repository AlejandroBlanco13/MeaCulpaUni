"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookReaderProps {
  pages: ReactNode[];
  className?: string;
}

function BookPagination({
  currentPage,
  total,
  onPrev,
  onNext,
  className,
}: {
  currentPage: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  const canPrev = currentPage > 0;
  const canNext = currentPage < total - 1;
  return (
    <nav
      className={cn("book-pagination flex-shrink-0 flex items-center justify-between gap-4 mt-4 pt-4 border-t border-dnd-gold/20", className)}
      aria-label="Paginación del libro"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="flex items-center gap-1 text-dnd-gold/90 hover:text-dnd-gold disabled:opacity-40 disabled:pointer-events-none font-medieval text-sm transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Anterior</span>
      </button>
      <span className="text-dnd-ink/70 text-sm font-medieval tabular-nums">
        Página {currentPage + 1} de {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex items-center gap-1 text-dnd-gold/90 hover:text-dnd-gold disabled:opacity-40 disabled:pointer-events-none font-medieval text-sm transition-colors"
        aria-label="Página siguiente"
      >
        <span>Siguiente</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}

export function BookReader({ pages, className }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const total = pages.length;

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

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(total - 1, p + 1));

  const modal = modalOpen && mounted && createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Libro ampliado"
    >
      <div
        className="book-page book-modal flex flex-col w-full max-w-2xl max-h-[88vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-dnd-gold/20 hover:bg-dnd-gold/30 text-dnd-gold flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden pr-10">
          {pages[currentPage]}
        </div>
        <BookPagination currentPage={currentPage} total={total} onPrev={goPrev} onNext={goNext} />
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <section className={cn("book-page flex flex-col min-h-[400px] lg:min-h-0 lg:h-full", className)}>
        <div
          className="flex-1 min-h-0 flex flex-col overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dnd-gold/50 rounded-r-lg"
          onClick={() => setModalOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Abrir libro en ventana ampliada"
        >
          {pages[currentPage]}
        </div>
        <BookPagination currentPage={currentPage} total={total} onPrev={goPrev} onNext={goNext} />
      </section>
      {modal}
    </>
  );
}
