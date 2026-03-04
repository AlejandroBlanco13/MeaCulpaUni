import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_CHARACTER_SLOTS } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, classType } = await req.json();
  if (!name || typeof name !== "string")
    return NextResponse.json(
      { error: "El nombre es obligatorio." },
      { status: 400 }
    );

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("characters")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("is_free_slot", true);
  const freeUsed = existing?.length ?? 0;

  if (freeUsed >= FREE_CHARACTER_SLOTS) {
    return NextResponse.json(
      { error: "No tienes ranuras gratis. Desbloquea más personajes de pago." },
      { status: 400 }
    );
  }

  await supabase.from("characters").insert({
    user_id: session.user.id,
    name: name.trim(),
    class_type: classType || null,
    is_free_slot: true,
  });
  return NextResponse.json({ ok: true });
}
