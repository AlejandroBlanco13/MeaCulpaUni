import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DndLegendScroll } from "@/components/dnd-legend-scroll";
import { RpgHub } from "@/components/rpg-hub";

export default async function HomePage() {
  const session = await getSession();
  if (!session?.user) {
    return <DndLegendScroll />;
  }

  const supabase = await createClient();
  const { data: newsRows } = await supabase
    .from("news")
    .select("id, title, slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return <RpgHub user={session.user} latestNews={newsRows ?? []} />;
}
