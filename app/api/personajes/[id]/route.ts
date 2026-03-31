import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    return NextResponse.json({ error: "ID de personaje requerido." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.action !== "level_up") {
    return NextResponse.json({ error: "Accion no valida." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: character } = await supabase
    .from("characters")
    .select("id, user_id, level")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!character) {
    return NextResponse.json({ error: "Personaje no encontrado." }, { status: 404 });
  }

  const nextLevel = Math.max(1, (character.level ?? 1) + 1);
  const { error } = await supabase
    .from("characters")
    .update({ level: nextLevel })
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar el nivel." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, level: nextLevel });
}
