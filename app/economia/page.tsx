import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Coins, HandCoins, Landmark, PiggyBank, ScrollText } from "lucide-react";
import bancoBg from "@/app/IMG/Economia/Banco.png";
import { EconomyBankPanel } from "../../components/economy-bank-panel";

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
    .limit(120);

  const balance = profile?.wallet_balance ?? 0;
  const txList = transactions ?? [];

  const totalDeposited = txList
    .filter((t) => t.type === "bank_deposit")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  const loanTaken = txList
    .filter((t) => t.type === "bank_loan_disbursed")
    .reduce((sum, t) => sum + Math.max(0, Number(t.amount) || 0), 0);
  const loanPaid = txList
    .filter((t) => t.type === "bank_loan_repayment")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  const pendingDebt = Math.max(0, loanTaken - loanPaid);
  const pendingRequests = txList.filter((t) => t.type === "bank_fund_request").length;

  function txLabel(type: string) {
    switch (type) {
      case "purchase":
        return "Compra en mercado";
      case "bank_deposit":
        return "Deposito al banco";
      case "bank_loan_disbursed":
        return "Prestamo recibido";
      case "bank_loan_repayment":
        return "Abono de prestamo";
      case "bank_fund_request":
        return "Solicitud al banco";
      case "bank_debt_collection_fee":
        return "Arancel por cobro de deuda";
      case "external_match_income":
        return "Ingreso de otra partida";
      default:
        return type;
    }
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[1] h-dvh min-h-dvh w-full max-w-none min-w-full overflow-hidden"
        aria-hidden
      >
        <div className="relative h-full min-h-dvh w-full min-w-full">
          <Image src={bancoBg} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 min-h-dvh w-full bg-gradient-to-b from-black/80 via-black/72 to-black/85" />
        <div className="absolute inset-0 min-h-dvh w-full bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,transparent_0%,rgba(0,0,0,0.45)_75%)]" />
      </div>

      <div className="relative z-[2] min-h-dvh w-full min-w-0">
        <div className="mx-auto w-full max-w-7xl space-y-7 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
          <div className="rounded-md border border-dnd-gold/45 bg-black/50 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.55)] ring-1 ring-dnd-gold/25 backdrop-blur-md sm:bg-black/45 sm:p-6">
            <div className="flex justify-start">
              <Link
                href="/"
                className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
            </div>

            <header className="mt-4 rounded-md border border-dnd-gold/20 bg-black/40 px-5 py-5 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-7">
              <p className="text-xs uppercase tracking-[0.28em] text-dnd-gold/75">Banco del Reino</p>
              <h1 className="mt-2 flex items-center gap-3 font-medieval text-3xl font-bold text-dnd-ink sm:text-4xl">
                <Landmark className="h-8 w-8 shrink-0 text-dnd-gold" />
                Economia y banca medieval
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-dnd-ink/75 sm:text-base">
                Gestiona depositos, prestamos y solicitudes de fondos. Tambien puedes trazar dinero que obtienes de otras
                partidas para mantener una contabilidad unificada.
              </p>
            </header>

            <div className="mt-8 space-y-6 rounded-xl border border-neutral-800/80 bg-[#121212]/88 p-5 shadow-inner backdrop-blur-sm sm:p-7">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <article className="rounded-md border border-dnd-ink/20 bg-black/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Saldo en bolsa</p>
                  <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
                    <Coins className="h-5 w-5 text-dnd-gold/85" />
                    {balance}
                  </p>
                </article>
                <article className="rounded-md border border-dnd-ink/20 bg-black/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Depositado al banco</p>
                  <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
                    <PiggyBank className="h-5 w-5 text-dnd-gold/85" />
                    {totalDeposited}
                  </p>
                </article>
                <article className="rounded-md border border-dnd-ink/20 bg-black/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Prestamos recibidos</p>
                  <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
                    <HandCoins className="h-5 w-5 text-dnd-gold/85" />
                    {loanTaken}
                  </p>
                </article>
                <article className="rounded-md border border-dnd-ink/20 bg-black/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Deuda vigente</p>
                  <p className="mt-2 font-medieval text-2xl text-amber-200">{pendingDebt}</p>
                </article>
                <article className="rounded-md border border-dnd-ink/20 bg-black/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-dnd-ink/60">Solicitudes registradas</p>
                  <p className="mt-2 inline-flex items-center gap-1 font-medieval text-2xl text-dnd-ink">
                    <ScrollText className="h-5 w-5 text-dnd-gold/85" />
                    {pendingRequests}
                  </p>
                </article>
              </div>

              <EconomyBankPanel balance={balance} pendingDebt={pendingDebt} />

              <section>
                <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">Libro mayor de movimientos</h2>
                {!txList.length ? (
                  <div className="rounded-md border border-dnd-ink/20 bg-black/35 p-8 text-center text-dnd-ink/70">
                    Aun no hay movimientos en tu cuenta.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {txList.map((t) => (
                      <li
                        key={t.id}
                        className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {t.amount >= 0 ? (
                            <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-rose-300" />
                          )}
                          <span className={t.amount >= 0 ? "text-emerald-200" : "text-rose-200"}>
                            {t.amount >= 0 ? "+" : ""}
                            {t.amount} monedas
                          </span>
                        </span>
                        <span className="text-sm text-dnd-ink/65">
                          {txLabel(t.type)} · {new Date(t.created_at).toLocaleString("es")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
