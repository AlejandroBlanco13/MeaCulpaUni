"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Bookmark, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { StaticImageData } from "next/image";
import dnd1 from "@/app/IMG/Homepage/DND-Notices/DND1.jpg";
import dnd2 from "@/app/IMG/Homepage/DND-Notices/DND2.jpg";
import dnd3 from "@/app/IMG/Homepage/DND-Notices/DND3.png";
import did4 from "@/app/IMG/Homepage/DND-Notices/DID4.jpg";

const EDICIONES = [
  {
    id: "ed-1",
    title: "Dominio Interior",
    subtitle: "Nacimiento de las Esquirlas",
    date: "3 de diciembre de 2025",
    image: dnd1,
  },
  {
    id: "ed-2",
    title: "Noticias Clandestinas",
    subtitle: "Iglesia Abierta",
    date: "21 de enero de 2026",
    image: dnd2,
  },
  {
    id: "ed-3",
    title: "Edición Oficial",
    subtitle: "La Guild de Jackpot busca miembros",
    date: "30 de diciembre de 2025",
    image: dnd3,
  },
  {
    id: "ed-4",
    title: "Aviso de Conducta",
    subtitle: "El Último Sorbo",
    date: "14 de diciembre de 2025",
    image: did4,
  },
] as const;

const EDITION_COUNT = EDICIONES.length;

/** Artículos por hoja del tablón (después de las 4 páginas ilustradas). */
const ITEMS_PER_PAGE = 2;

const SHEET_MIN_H = "min-h-[calc(100dvh-10.5rem)]";

export type EditionItem = (typeof EDICIONES)[number];

export type NoticiaItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type Props = {
  news: NoticiaItem[];
  subscribedIds: string[];
  hasSession: boolean;
};

function excerpt(text: string, max = 200) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim() + "…";
}

function FullBleedBackground({
  src,
  alt,
  priority,
  decorative,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Image
        src={src}
        alt={decorative ? "" : alt}
        fill
        priority={priority}
        className="object-cover object-center select-none"
        sizes="100vw"
        draggable={false}
        aria-hidden={decorative ? true : undefined}
      />
    </div>
  );
}

type EditionSheetProps = {
  edition: EditionItem;
  pageIndex: number;
  totalSheets: number;
  showEmptyBoardHint: boolean;
  onIllustrationClick: (edition: EditionItem) => void;
};

function EditionSheet({ edition, pageIndex, totalSheets, showEmptyBoardHint, onIllustrationClick }: EditionSheetProps) {
  return (
    <div
      className={`newspaper-spread-page relative w-full overflow-hidden rounded-sm border border-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.65)] ${SHEET_MIN_H}`}
    >
      <FullBleedBackground src={edition.image} alt={`${edition.title} — ${edition.subtitle}`} priority={pageIndex === 0} />
      {/* Viñetado perimetral tipo papel */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-black/25"
        style={{
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.35)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/75 via-black/10 to-black/80" />

      <div className={`relative z-20 flex ${SHEET_MIN_H} flex-col`}>
        <header className="relative z-30 shrink-0 border-b border-[#c9a227]/40 bg-black/55 px-4 py-3 text-center backdrop-blur-[2px] sm:px-6">
          <p className="font-medieval text-[10px] uppercase tracking-[0.35em] text-[#f4e4bc] sm:text-[11px]">Noticias del Reino</p>
          <p className="mt-0.5 font-medieval text-[11px] text-[#c9a227]/90 sm:text-xs">Gaceta del campamento · Dominio Interior</p>
        </header>

        {/* Capa táctil a pantalla completa sobre la ilustración (las capas de detrás tienen pointer-events: none) */}
        <div className="relative min-h-0 flex-1 px-4 pt-3 sm:px-8">
          <div className="relative h-full min-h-[36vh] w-full sm:min-h-[42vh]">
            <button
              type="button"
              onClick={(e) => {
                onIllustrationClick(edition);
                /* Evita que el anillo :focus-visible (teclado/ratón) quede pintado tras abrir el modal */
                e.currentTarget.blur();
              }}
              className="absolute inset-0 z-20 cursor-zoom-in touch-manipulation rounded-sm border-0 bg-transparent hover:bg-white/10 active:bg-white/15 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/35"
              aria-label={`Ampliar ilustración: ${edition.title}`}
            />
          </div>

          <div className="relative z-40 mt-4 shrink-0 rounded-sm border border-[#c9a227]/30 bg-black/70 px-4 py-4 shadow-lg backdrop-blur-sm sm:px-6 sm:py-5">
            <p className="font-medieval text-[10px] uppercase tracking-[0.2em] text-[#e8dcc4]/80">{edition.date}</p>
            <h2 className="mt-2 font-medieval text-2xl font-bold uppercase leading-tight tracking-[0.08em] text-[#f9f5e9] sm:text-3xl md:text-4xl">
              {edition.title}
            </h2>
            <p className="mt-3 border-t border-[#c9a227]/25 pt-3 font-medieval text-sm uppercase tracking-[0.14em] text-[#c9a227] sm:text-base">
              {edition.subtitle}
            </p>
            {pageIndex === 0 && (
              <p className="mt-4 text-left font-serif text-sm leading-relaxed text-[#e8dcc4]/90 sm:text-[15px]">
                Pasá las hojas como en un diario: cada página es una edición ilustrada; después viene el tablón de rumores.
              </p>
            )}
            {showEmptyBoardHint && (
              <p className="mt-4 rounded border border-dashed border-[#c9a227]/35 bg-black/30 px-3 py-2 text-center font-medieval text-xs text-[#e8dcc4]/85">
                El tablón de rumores está vacío: aún no hay pergaminos publicados.
              </p>
            )}
          </div>
        </div>

        <footer className="relative z-30 shrink-0 border-t border-black/50 bg-[#0d0a08]/90 px-4 py-2.5 text-center font-medieval text-[10px] uppercase tracking-[0.18em] text-[#8a7a60] sm:text-[11px]">
          Página {pageIndex + 1} de {totalSheets}
          {pageIndex < totalSheets - 1 ? " · Continúa al dorso" : " · Fin de esta tirada"}
        </footer>
      </div>
    </div>
  );
}

type NewsSheetProps = {
  items: NoticiaItem[];
  pageIndex: number;
  totalSheets: number;
  background: StaticImageData;
  backgroundLabel: string;
  subscribedIds: string[];
  hasSession: boolean;
  onImageClick: (item: NoticiaItem) => void;
};

function NewsSheet({
  items,
  pageIndex,
  totalSheets,
  background,
  backgroundLabel,
  subscribedIds,
  hasSession,
  onImageClick,
}: NewsSheetProps) {
  return (
    <div
      className={`newspaper-spread-page relative w-full overflow-hidden rounded-sm border border-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.65)] ${SHEET_MIN_H}`}
    >
      <FullBleedBackground src={background} alt="" decorative />
      <div className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-black/25" style={{ boxShadow: "inset 0 0 70px rgba(0,0,0,0.4)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-black/70 via-black/45 to-black/75" />

      <div className={`relative z-20 flex ${SHEET_MIN_H} flex-col`}>
        <header className="shrink-0 border-b border-[#c9a227]/35 bg-black/50 px-4 py-2.5 text-center backdrop-blur-[2px] sm:px-6">
          <p className="font-medieval text-[10px] uppercase tracking-[0.28em] text-[#f4e4bc] sm:text-[11px]">Tablón del reino</p>
          <p className="mt-0.5 font-medieval text-[10px] text-[#a09070] sm:text-[11px]">
            Sobre la edición «{backgroundLabel}»
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto max-w-2xl rounded-sm border border-black/40 bg-[#f4efe4]/[0.94] p-4 shadow-inner backdrop-blur-[1px] sm:p-6">
            <p className="border-b border-black/20 pb-3 text-center font-medieval text-[11px] uppercase tracking-[0.2em] text-black/55">
              Página {pageIndex + 1} de {totalSheets} · Rumores y edictos
            </p>
            <ul className="mt-4 space-y-6">
              {items.map((n) => (
                <li key={n.id} className="border-b border-black/15 pb-6 last:border-0 last:pb-0">
                  <Link href={`/noticias/${n.slug}`} className="group block">
                    <h3 className="font-medieval text-lg font-bold uppercase leading-snug tracking-[0.06em] text-[#1a1410] transition group-hover:text-[#6b4e0a] sm:text-xl">
                      {n.title}
                    </h3>
                  </Link>
                  <p className="mt-1 font-serif text-sm italic text-black/50">
                    {new Date(n.created_at).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {n.image_url && (
                    <button
                      type="button"
                      onClick={(e) => {
                        onImageClick(n);
                        e.currentTarget.blur();
                      }}
                      className="group/img relative z-10 mt-3 block aspect-[16/10] w-full cursor-zoom-in touch-manipulation overflow-hidden rounded border border-black/30 text-left transition focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black/25"
                      aria-label={`Ampliar noticia: ${n.title}`}
                    >
                      <Image
                        src={n.image_url}
                        alt={n.title}
                        fill
                        className="object-cover transition duration-300 group-hover/img:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 42rem"
                      />
                      <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover/img:bg-black/10" aria-hidden />
                    </button>
                  )}
                  <p className="mt-3 text-justify font-serif text-[15px] leading-relaxed text-black/85 first-letter:float-left first-letter:mr-1 first-letter:font-medieval first-letter:text-4xl first-letter:leading-none first-letter:text-[#6b4e0a]">
                    {excerpt(n.content)}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Link
                      href={`/noticias/${n.slug}`}
                      className="font-medieval text-xs uppercase tracking-[0.14em] text-[#6b4e0a] underline-offset-2 hover:underline"
                    >
                      Leer artículo completo
                    </Link>
                    {hasSession && (
                      <span
                        className={`shrink-0 ${subscribedIds.includes(n.id) ? "text-[#b8860b]" : "text-black/30"}`}
                        title={subscribedIds.includes(n.id) ? "Apuntado" : "Apuntarse en el artículo"}
                        aria-hidden
                      >
                        <Bookmark className="h-5 w-5" fill={subscribedIds.includes(n.id) ? "currentColor" : "none"} />
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="shrink-0 border-t border-black/50 bg-[#0d0a08]/90 px-4 py-2.5 text-center font-medieval text-[10px] uppercase tracking-[0.18em] text-[#8a7a60] sm:text-[11px]">
          Página {pageIndex + 1} de {totalSheets}
          {pageIndex < totalSheets - 1 ? " · Siguiente hoja" : " · Fin del tablón"}
        </footer>
      </div>
    </div>
  );
}

function EditionIllustrationModal({ edition, onClose }: { edition: EditionItem | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!edition) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [edition]);

  useEffect(() => {
    if (!edition) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [edition, onClose]);

  if (!mounted || !edition) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 p-2 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Ilustración: ${edition.title}`}
      onClick={onClose}
    >
      <div
        className="relative h-[94dvh] w-[min(99vw,1920px)] max-w-[100vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-1 top-1 z-20 rounded-full border border-white/25 bg-black/65 p-2.5 text-white shadow-lg transition hover:bg-black/85 sm:right-2 sm:top-2"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative h-full w-full overflow-hidden rounded-md bg-black ring-1 ring-white/10">
          <Image
            src={edition.image}
            alt={`${edition.title} — ${edition.subtitle}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function NoticiaImageModal({ article, onClose }: { article: NoticiaItem | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!article) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [article]);

  useEffect(() => {
    if (!article) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [article, onClose]);

  if (!mounted || !article) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="noticia-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#c9a227]/30 bg-[#f4efe4] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-black/15 bg-[#1a1410] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="font-medieval text-[10px] uppercase tracking-[0.2em] text-[#c9a227]/90">Noticia del reino</p>
            <h2 id="noticia-modal-title" className="font-medieval text-lg font-bold uppercase leading-snug tracking-[0.06em] text-[#f9f5e9] sm:text-xl">
              {article.title}
            </h2>
            <p className="mt-1 font-serif text-sm text-[#a09070]">
              {new Date(article.created_at).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-[#c9a227]/35 bg-black/40 p-2 text-[#f9f5e9] transition hover:bg-black/60"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {article.image_url && (
            <div className="relative aspect-[16/9] w-full max-h-[min(50vh,420px)] bg-black/90 sm:max-h-[min(55vh,480px)]">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="prose prose-dnd max-w-none whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-[#1a1410] sm:text-base">
              {article.content}
            </div>
            <div className="mt-6 border-t border-black/15 pt-4">
              <Link
                href={`/noticias/${article.slug}`}
                onClick={onClose}
                className="font-medieval text-sm uppercase tracking-[0.12em] text-[#6b4e0a] underline-offset-2 hover:underline"
              >
                Abrir en página dedicada
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function NoticiasNewspaper({ news, subscribedIds, hasSession }: Props) {
  const newsPages = useMemo(() => {
    const chunks: NoticiaItem[][] = [];
    for (let i = 0; i < news.length; i += ITEMS_PER_PAGE) {
      chunks.push(news.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks;
  }, [news]);

  const totalSheets = EDITION_COUNT + newsPages.length;
  const [page, setPage] = useState(0);
  const [modalArticle, setModalArticle] = useState<NoticiaItem | null>(null);
  const [modalEdition, setModalEdition] = useState<EditionItem | null>(null);

  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(totalSheets - 1, p + 1)), [totalSheets]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalArticle || modalEdition) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, modalArticle, modalEdition]);

  const displayPage = Math.min(page, Math.max(0, totalSheets - 1));
  const isEditionPage = displayPage < EDITION_COUNT;
  const newsSheetIndex = displayPage - EDITION_COUNT;

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full">
        {isEditionPage && (
          <EditionSheet
            edition={EDICIONES[displayPage]}
            pageIndex={displayPage}
            totalSheets={totalSheets}
            showEmptyBoardHint={news.length === 0 && displayPage === EDITION_COUNT - 1}
            onIllustrationClick={(ed) => {
              setModalArticle(null);
              setModalEdition(ed);
            }}
          />
        )}

        {!isEditionPage && newsPages[newsSheetIndex]?.length ? (
          <NewsSheet
            items={newsPages[newsSheetIndex]}
            pageIndex={displayPage}
            totalSheets={totalSheets}
            background={EDICIONES[newsSheetIndex % EDITION_COUNT].image}
            backgroundLabel={EDICIONES[newsSheetIndex % EDITION_COUNT].title}
            subscribedIds={subscribedIds}
            hasSession={hasSession}
            onImageClick={(item) => {
              setModalEdition(null);
              setModalArticle(item);
            }}
          />
        ) : null}
      </div>

      <EditionIllustrationModal edition={modalEdition} onClose={() => setModalEdition(null)} />
      <NoticiaImageModal article={modalArticle} onClose={() => setModalArticle(null)} />

      {totalSheets > 1 && (
        <nav
          className="flex flex-col items-center gap-3 rounded-md border border-dnd-gold/25 bg-[#1a1410]/95 px-3 py-3 sm:flex-row sm:justify-between sm:px-4"
          aria-label="Pasador de hojas del periódico"
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={displayPage === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-dnd-gold/40 bg-black/35 px-4 py-2.5 font-medieval text-sm text-[#f9f5e9] transition hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
            Hoja anterior
          </button>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {Array.from({ length: totalSheets }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`flex h-9 min-w-9 items-center justify-center rounded border font-medieval text-[11px] uppercase tracking-wider transition ${
                  i === displayPage
                    ? "border-dnd-gold bg-dnd-gold/25 text-dnd-gold"
                    : "border-white/15 bg-black/30 text-[#f9f5e9]/75 hover:border-dnd-gold/45"
                }`}
                aria-current={i === displayPage ? "page" : undefined}
                aria-label={`Ir a la hoja ${i + 1}`}
                title={i < EDITION_COUNT ? `Edición ${EDICIONES[i].title}` : `Tablón ${i - EDITION_COUNT + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            disabled={displayPage >= totalSheets - 1}
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-dnd-gold/40 bg-black/35 px-4 py-2.5 font-medieval text-sm text-[#f9f5e9] transition hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
          >
            Hoja siguiente
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </nav>
      )}

      {totalSheets > 1 && (
        <p className="text-center font-medieval text-xs text-dnd-ink/45">Flechas del teclado ← → para pasar la hoja.</p>
      )}
    </div>
  );
}
