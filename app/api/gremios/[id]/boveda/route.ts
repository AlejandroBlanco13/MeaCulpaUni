import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function checkVaultAccess(guildId: string, userId: string, supabase: SupabaseClient) {
  const { data: member } = await supabase
    .from("guild_members")
    .select("can_access_vault, role")
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!member) return null;
  const canAccess =
    member.can_access_vault || member.role === "leader" || member.role === "officer";
  return canAccess ? member : null;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();
  const ok = await checkVaultAccess(params.id, session.user.id, supabase);
  if (!ok)
    return NextResponse.json(
      { error: "No tienes acceso a la bóveda de este gremio" },
      { status: 403 }
    );

  const { itemId, quantity } = await req.json();
  const qty = Math.max(1, Number(quantity) || 1);

  const { data: item } = await supabase
    .from("guild_vault_items")
    .insert({
      guild_id: params.id,
      item_id: String(itemId || "unknown"),
      quantity: qty,
      added_by_id: session.user.id,
    })
    .select()
    .single();
  return NextResponse.json({ item });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();
  const ok = await checkVaultAccess(params.id, session.user.id, supabase);
  if (!ok)
    return NextResponse.json(
      { error: "No tienes acceso a la bóveda" },
      { status: 403 }
    );

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id requerido" }, { status: 400 });

  await supabase.from("guild_vault_items").delete().eq("id", id).eq("guild_id", params.id);
  return NextResponse.json({ ok: true });
}
