import type { SupabaseClient } from "@supabase/supabase-js";

/** Porcentaje retenido por el banco al cobrar un abono a deuda (sobre el capital amortizado). */
export const DEBT_REPAYMENT_SURCHARGE_RATE = 0.05;

export function parsePositiveInt(value: unknown): number | null {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  if (!Number.isInteger(amount)) return null;
  if (amount <= 0) return null;
  return amount;
}

export async function getWalletBalance(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase.from("profiles").select("wallet_balance").eq("id", userId).single();
  return typeof profile?.wallet_balance === "number" ? profile.wallet_balance : null;
}

export async function addWalletTransaction(supabase: SupabaseClient, input: {
  userId: string;
  amount: number;
  type: string;
  referenceId?: string | null;
}) {
  await supabase.from("wallet_transactions").insert({
    user_id: input.userId,
    amount: input.amount,
    type: input.type,
    reference_id: input.referenceId ?? null,
  });
}
