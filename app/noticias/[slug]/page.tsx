import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ApuntarButton } from "./apuntar-button";

export default async function NoticiaSlugPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();
  if (!news) notFound();

  let isSubscribed = false;
  if (session?.user?.id) {
    const { data: sub } = await supabase
      .from("news_subscriptions")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("news_id", news.id)
      .maybeSingle();
    isSubscribed = !!sub;
  }

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Link href="/noticias" className="text-dnd-gold hover:underline text-sm">
        ← Volver a Noticias
      </Link>
      <header>
        <h1 className="font-medieval text-3xl font-bold text-dnd-ink">{news.title}</h1>
        <p className="text-dnd-ink/60 mt-2">
          {new Date(news.created_at).toLocaleDateString("es")}
        </p>
      </header>
      {news.image_url && (
        <img
          src={news.image_url}
          alt={news.title}
          className="w-full rounded-lg border-2 border-dnd-ink/20"
        />
      )}
      <div className="prose prose-dnd max-w-none text-dnd-ink whitespace-pre-wrap">
        {news.content}
      </div>
      {session && (
        <ApuntarButton newsId={news.id} isSubscribed={isSubscribed} />
      )}
    </article>
  );
}
