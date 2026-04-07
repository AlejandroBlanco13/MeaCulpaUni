import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  addWalletTransaction,
  DEBT_REPAYMENT_SURCHARGE_RATE,
  getWalletBalance,
  parsePositiveInt,
} from "@/app/api/economia/_utils";

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

  const { data: txRows } = await supabase
    .from("wallet_transactions")
    .select("amount, type")
    .eq("user_id", session.user.id)
    .in("type", ["bank_loan_disbursed", "bank_loan_repayment"]);

  const debt = (txRows ?? []).reduce((sum, tx) => {
    if (tx.type === "bank_loan_disbursed") return sum + Math.max(0, Number(tx.amount) || 0);
    if (tx.type === "bank_loan_repayment") return sum - Math.abs(Number(tx.amount) || 0);
    return sum;
  }, 0);

  if (debt <= 0) {
    return NextResponse.json({ error: "No tienes deuda activa en el banco." }, { status: 400 });
  }

  const principal = Math.min(amount, debt);
  const surcharge = Math.floor(principal * DEBT_REPAYMENT_SURCHARGE_RATE);
  const totalFromWallet = principal + surcharge;

  if (balance < totalFromWallet) {
    return NextResponse.json(
      {
        error: `Saldo insuficiente: necesitas ${totalFromWallet} monedas (${principal} al capital + ${surcharge} de arancel).`,
      },
      { status: 400 },
    );
  }

  await supabase.from("profiles").update({ wallet_balance: balance - totalFromWallet }).eq("id", session.user.id);
  await addWalletTransaction(supabase, {
    userId: session.user.id,
    amount: -principal,
    type: "bank_loan_repayment",
  });
  if (surcharge > 0) {
    await addWalletTransaction(supabase, {
      userId: session.user.id,
      amount: -surcharge,
      type: "bank_debt_collection_fee",
    });
  }

  return NextResponse.json({ ok: true, principal, surcharge, total: totalFromWallet });
}
