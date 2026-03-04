import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "admin")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { name, description, imageUrl } = await req.json();
  const supabase = await createClient();
  const updates: { name?: string; description?: string | null; image_url?: string | null } = {};
  if (name != null) updates.name = String(name);
  if (description != null) updates.description = description ? String(description) : null;
  if (imageUrl != null) updates.image_url = imageUrl ? String(imageUrl) : null;

  await supabase.from("stores").update(updates).eq("id", params.id);
  return NextResponse.json({ ok: true });
}
