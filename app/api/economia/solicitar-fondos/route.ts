import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addWalletTransaction, parsePositiveInt } from "@/app/api/economia/_utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const amount = parsePositiveInt(body.amount);
  if (!amount) {
    return NextResponse.json({ error: "Monto invalido." }, { status: 400 });
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const referenceId = reason ? `request:${amount}:${reason.slice(0, 80)}` : `request:${amount}`;

  const supabase = await createClient();
  await addWalletTransaction(supabase, {
    userId: session.user.id,
    amount: 0,
    type: "bank_fund_request",
    referenceId,
  });

  return NextResponse.json({ ok: true });
}
