import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const productId = body.productId as string | null;
  if (!productId)
    return NextResponse.json({ error: "productId requerido" }, { status: 400 });

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("store_products")
    .select("id, price, stock")
    .eq("id", productId)
    .single();
  if (!product || product.stock < 1)
    return NextResponse.json({ error: "Producto no disponible o sin stock" }, { status: 400 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("wallet_balance")
    .eq("id", session.user.id)
    .single();
  if (!profile || profile.wallet_balance < product.price)
    return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });

  const newBalance = profile.wallet_balance - product.price;
  await supabase.from("profiles").update({ wallet_balance: newBalance }).eq("id", session.user.id);
  await supabase.from("store_products").update({ stock: product.stock - 1 }).eq("id", productId);
  await supabase.from("wallet_transactions").insert({
    user_id: session.user.id,
    amount: -product.price,
    type: "purchase",
    reference_id: productId,
  });
  await supabase.from("inventory_items").insert({
    user_id: session.user.id,
    item_id: product.id,
    quantity: 1,
  });

  return NextResponse.json({ ok: true });
}
