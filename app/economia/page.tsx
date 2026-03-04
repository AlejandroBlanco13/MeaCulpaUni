import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Coins, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function EconomiaPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/economia");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("wallet_balance")
    .eq("id", session.user.id)
    .single();
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const balance = profile?.wallet_balance ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <Coins className="w-8 h-8" />
        Economía
      </h1>
      <p className="text-dnd-ink/70">
        Tu cartera y movimientos. Gana monedas en misiones o comprando con suscripción.
      </p>

      <div className="card-parchment p-8 max-w-sm">
        <p className="text-dnd-ink/70 text-sm">Saldo actual</p>
        <p className="font-medieval text-4xl font-bold text-dnd-gold flex items-center gap-2 mt-1">
          <Coins className="w-10 h-10" />
          {balance} monedas
        </p>
      </div>

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">
          Últimos movimientos
        </h2>
        {!transactions?.length ? (
          <div className="card-parchment p-8 text-center text-dnd-ink/70">
            Aún no tienes movimientos.
          </div>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="card-parchment p-4 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {t.amount >= 0 ? (
                    <ArrowDownLeft className="w-4 h-4 text-dnd-forest" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-dnd-red" />
                  )}
                  <span className={t.amount >= 0 ? "text-dnd-forest" : "text-dnd-red"}>
                    {t.amount >= 0 ? "+" : ""}{t.amount} monedas
                  </span>
                </span>
                <span className="text-sm text-dnd-ink/60">
                  {t.type} · {new Date(t.created_at).toLocaleString("es")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
