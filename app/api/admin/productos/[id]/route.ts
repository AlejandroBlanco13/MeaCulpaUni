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

  const body = await req.json();
  const { name, description, imageUrl, price, stock } = body;
  const supabase = await createClient();
  const updates: { name?: string; description?: string | null; image_url?: string | null; price?: number; stock?: number } = {};
  if (name != null) updates.name = String(name);
  if (description != null) updates.description = description ? String(description) : null;
  if (imageUrl != null) updates.image_url = imageUrl ? String(imageUrl) : null;
  if (typeof price === "number") updates.price = price;
  if (typeof stock === "number") updates.stock = stock;

  await supabase.from("store_products").update(updates).eq("id", params.id);
  return NextResponse.json({ ok: true });
}
