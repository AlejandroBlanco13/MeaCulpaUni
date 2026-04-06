import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NoticiasNewspaper } from "@/components/noticias-newspaper";

export default async function NoticiasPage() {
  const session = await getSession();
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("id, title, slug, content, image_url, created_at")
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

  const items = news ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-2 pb-8 sm:px-4">
      <NoticiasNewspaper news={items} subscribedIds={subscribedIds} hasSession={!!session} />
    </div>
  );
}
