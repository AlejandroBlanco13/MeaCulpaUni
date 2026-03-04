import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, description, maxMembers } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0)
    return NextResponse.json(
      { error: "El nombre del gremio es obligatorio." },
      { status: 400 }
    );

  const max = Math.min(50, Math.max(2, Number(maxMembers) || 10));
  const supabase = await createClient();
  const { data: guild, error: guildError } = await supabase
    .from("guilds")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      max_members: max,
    })
    .select()
    .single();
  if (guildError || !guild)
    return NextResponse.json({ error: "Error al crear gremio" }, { status: 500 });

  await supabase.from("guild_members").insert({
    guild_id: guild.id,
    user_id: session.user.id,
    role: "leader",
    can_access_vault: true,
  });
  return NextResponse.json({ guild });
}
