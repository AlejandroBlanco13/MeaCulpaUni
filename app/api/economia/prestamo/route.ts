import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addWalletTransaction, getWalletBalance, parsePositiveInt } from "@/app/api/economia/_utils";

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

  const supabase = await createClient();
  const balance = await getWalletBalance(supabase, session.user.id);
  if (balance === null) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const maxLoan = Math.max(300, balance * 3);
  if (amount > maxLoan) {
    return NextResponse.json(
      { error: `El banco solo aprueba hasta ${maxLoan} monedas para tu perfil actual.` },
      { status: 400 },
    );
  }

  await supabase.from("profiles").update({ wallet_balance: balance + amount }).eq("id", session.user.id);
  await addWalletTransaction(supabase, {
    userId: session.user.id,
    amount,
    type: "bank_loan_disbursed",
  });

  return NextResponse.json({ ok: true, maxLoan });
}
