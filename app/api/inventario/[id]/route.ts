import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stringifyInventoryMetadata } from "@/lib/inventory";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "ID de item requerido." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const characterIdRaw = body.characterId;
  const characterId = typeof characterIdRaw === "string" && characterIdRaw.trim() ? characterIdRaw : null;

  const supabase = await createClient();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!item) {
    return NextResponse.json({ error: "Item no encontrado." }, { status: 404 });
  }

  if (characterId) {
    const { data: character } = await supabase
      .from("characters")
      .select("id")
      .eq("id", characterId)
      .eq("user_id", session.user.id)
      .single();

    if (!character) {
      return NextResponse.json({ error: "Heroe invalido para asignacion." }, { status: 400 });
    }
  }

  const metadata = stringifyInventoryMetadata({ characterId });
  const { error } = await supabase
    .from("inventory_items")
    .update({ metadata })
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar la asignacion." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, characterId });
}
