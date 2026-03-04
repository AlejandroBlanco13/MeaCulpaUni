import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const newsId = params.id;
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("news_subscriptions")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("news_id", newsId)
    .maybeSingle();

  if (existing) {
    await supabase.from("news_subscriptions").delete().eq("id", existing.id);
    return NextResponse.json({ subscribed: false });
  }
  await supabase.from("news_subscriptions").insert({
    user_id: session.user.id,
    news_id: newsId,
  });
  return NextResponse.json({ subscribed: true });
}
