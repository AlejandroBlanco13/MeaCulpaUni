import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Newspaper, Bookmark } from "lucide-react";

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
    <div className="space-y-6">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <Newspaper className="w-8 h-8" />
        Noticias
      </h1>
      <p className="text-dnd-ink/70">
        Apartado de noticias y novedades del reino. Apúntate a las que quieras seguir.
      </p>
      {!news?.length ? (
        <div className="card-parchment p-12 text-center">
          <Newspaper className="w-16 h-16 mx-auto text-dnd-ink/40 mb-4" />
          <p className="text-dnd-ink/70">Aún no hay noticias publicadas.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {news.map((n) => (
            <li key={n.id} className="card-parchment p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/noticias/${n.slug}`} className="font-medieval text-xl font-semibold text-dnd-ink hover:text-dnd-gold">
                    {n.title}
                  </Link>
                  <p className="text-dnd-ink/70 mt-1 line-clamp-2">
                    {n.content.slice(0, 160)}...
                  </p>
                  <p className="text-sm text-dnd-ink/50 mt-2">
                    {new Date(n.created_at).toLocaleDateString("es")}
                  </p>
                </div>
                {session && (
                  <span
                    className={subscribedIds.includes(n.id) ? "text-dnd-gold" : "text-dnd-ink/40"}
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
    </div>
  );
}
