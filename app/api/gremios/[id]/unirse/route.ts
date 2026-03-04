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

  const supabase = await createClient();
  const { data: guild } = await supabase
    .from("guilds")
    .select("id, max_members")
    .eq("id", params.id)
    .single();
  if (!guild)
    return NextResponse.json({ error: "Gremio no encontrado" }, { status: 404 });

  const { data: existing } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", guild.id)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (existing)
    return NextResponse.json({ error: "Ya eres miembro" }, { status: 400 });

  const { count } = await supabase
    .from("guild_members")
    .select("id", { count: "exact", head: true })
    .eq("guild_id", guild.id);
  if ((count ?? 0) >= guild.max_members)
    return NextResponse.json({ error: "El gremio está lleno" }, { status: 400 });

  await supabase.from("guild_members").insert({
    guild_id: guild.id,
    user_id: session.user.id,
    role: "member",
    can_access_vault: false,
  });
  return NextResponse.json({ ok: true });
}
