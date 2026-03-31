import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Bookmark } from "lucide-react";
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

export default async function NoticiasPage() {
  const session = await getSession();
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  let subscribedIds: string[] = [];
  if (session?.user?.id) {
    const { data: subs } = await supabase
      .from("news_subscriptions")
      .select("news_id")
      .eq("user_id", session.user.id);
    subscribedIds = (subs ?? []).map((s) => s.news_id);
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-md border border-dnd-gold/30 bg-[#f1ece2] p-5 text-black shadow-[0_14px_40px_rgba(0,0,0,0.45)] sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(0,0,0,0.12), transparent 30%), radial-gradient(circle at 80% 10%, rgba(0,0,0,0.08), transparent 35%), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 4px)",
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b-2 border-black/80 pb-2">
            <p className="font-medieval text-xs uppercase tracking-[0.22em]">Dominio Interior</p>
            <p className="font-medieval text-xs uppercase tracking-[0.22em]">Edición oficial del reino</p>
          </div>
          <h1 className="mt-4 text-center font-medieval text-3xl font-bold uppercase tracking-[0.15em] sm:text-5xl">
            Noticias del Reino
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm leading-relaxed text-black/80 sm:text-base">
            Gaceta estilo periódico para mantener la inmersión RPG: rumores, avisos de gremios, convocatorias y crónicas
            de campaña fechadas.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {EDICIONES.map((ed) => (
              <li key={ed.id} className="border-2 border-black/85 bg-white/95 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between border-b border-black/70 pb-1">
                  <p className="font-medieval text-[11px] uppercase tracking-[0.16em]">{ed.date}</p>
                  <p className="font-medieval text-[11px] uppercase tracking-[0.16em]">{ed.title}</p>
                </div>
                <Image
                  src={ed.image}
                  alt={`${ed.title} - ${ed.subtitle}`}
                  className="h-auto w-full border border-black/70 object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <p className="mt-2 text-center font-medieval text-sm uppercase tracking-[0.12em]">{ed.subtitle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        {!news?.length ? (
          <div className="card-parchment p-12 text-center">
            <Newspaper className="w-16 h-16 mx-auto text-dnd-ink/40 mb-4" />
            <p className="text-dnd-ink/70">Aún no hay noticias publicadas.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {news.map((n) => (
              <li key={n.id} className="card-parchment p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Link
                      href={`/noticias/${n.slug}`}
                      className="min-w-0 shrink-0 max-w-[38%] truncate font-medieval text-base sm:text-lg font-semibold text-dnd-ink hover:text-dnd-gold"
                    >
                      {n.title}
                    </Link>
                    <span className="text-dnd-ink/45">-</span>
                    <p className="min-w-0 flex-1 truncate text-dnd-ink/70 text-sm sm:text-base">
                      {n.content.slice(0, 160)}...
                    </p>
                    <span className="text-dnd-ink/45">-</span>
                    <p className="shrink-0 text-xs sm:text-sm text-dnd-ink/55">
                      {new Date(n.created_at).toLocaleDateString("es")}
                    </p>
                  </div>
                  {session && (
                    <span
                      className={`shrink-0 ${subscribedIds.includes(n.id) ? "text-dnd-gold" : "text-dnd-ink/40"}`}
                      title={subscribedIds.includes(n.id) ? "Apuntado" : "Apuntarse"}
                    >
                      <Bookmark className="w-6 h-6" fill={subscribedIds.includes(n.id) ? "currentColor" : "none"} />
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
