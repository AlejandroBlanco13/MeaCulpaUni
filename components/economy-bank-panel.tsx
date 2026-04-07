"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEBT_REPAYMENT_SURCHARGE_RATE } from "@/app/api/economia/_utils";

type Props = {
  balance: number;
  pendingDebt: number;
};

type ActionState = "idle" | "loading";

export function EconomyBankPanel({ balance, pendingDebt }: Props) {
  const router = useRouter();

  const [depositAmount, setDepositAmount] = useState("100");
  const [loanAmount, setLoanAmount] = useState("150");
  const [repaymentAmount, setRepaymentAmount] = useState("75");
  const [requestAmount, setRequestAmount] = useState("200");
  const [requestReason, setRequestReason] = useState("");
  const [externalAmount, setExternalAmount] = useState("50");
  const [externalSource, setExternalSource] = useState("");
  const [status, setStatus] = useState<ActionState>("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const maxLoan = useMemo(() => Math.max(300, balance * 3), [balance]);

  const repaymentPreview = useMemo(() => {
    const raw = Math.floor(Number(repaymentAmount));
    if (!Number.isFinite(raw) || raw <= 0) return { principal: 0, surcharge: 0, total: 0 };
    const principal = Math.min(raw, pendingDebt);
    const surcharge = Math.floor(principal * DEBT_REPAYMENT_SURCHARGE_RATE);
    return { principal, surcharge, total: principal + surcharge };
  }, [repaymentAmount, pendingDebt]);

  async function runOperation(endpoint: string, payload: Record<string, unknown>, successMessage: string) {
    setError("");
    setSuccess("");
    setStatus("loading");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    setStatus("idle");
    if (!res.ok) {
      setError(data.error ?? "No se pudo completar la operacion.");
      return;
    }
    setSuccess(successMessage);
    router.refresh();
  }

  return (
    <section className="space-y-4 rounded-md border border-dnd-gold/25 bg-black/35 p-4 sm:p-5">
      <header>
        <h2 className="font-medieval text-2xl text-dnd-ink">Operaciones del banco</h2>
        <p className="mt-1 text-sm text-dnd-ink/70">
          Realiza funciones bancarias medievales sobre tu bolsa actual: deposito, prestamo, solicitudes y registro externo.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            runOperation(
              "/api/economia/depositar",
              { amount: Number(depositAmount) },
              "Deposito enviado al banco correctamente.",
            );
          }}
        >
          <p className="font-semibold text-dnd-ink">Depositar al banco</p>
          <p className="text-xs text-dnd-ink/60">Mueve monedas desde tu bolsa al tesoro del banco.</p>
          <input
            type="number"
            min={1}
            step={1}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <button type="submit" disabled={status === "loading"} className="btn-gold py-2 px-3 text-sm">
            Depositar
          </button>
        </form>

        <form
          className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            runOperation(
              "/api/economia/prestamo",
              { amount: Number(loanAmount) },
              "Prestamo recibido y anotado en tu cuenta.",
            );
          }}
        >
          <p className="font-semibold text-dnd-ink">Solicitar prestamo</p>
          <p className="text-xs text-dnd-ink/60">Limite dinamico actual: {maxLoan} monedas.</p>
          <input
            type="number"
            min={1}
            step={1}
            max={maxLoan}
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <button type="submit" disabled={status === "loading"} className="btn-gold py-2 px-3 text-sm">
            Pedir prestamo
          </button>
        </form>

        <form
          className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            runOperation(
              "/api/economia/abonar-prestamo",
              { amount: Number(repaymentAmount) },
              "Abono aplicado: capital descontado de la deuda y arancel del banco registrado.",
            );
          }}
        >
          <p className="font-semibold text-dnd-ink">Abonar prestamo</p>
          <p className="text-xs text-dnd-ink/60">
            Deuda actual: {pendingDebt} monedas. El banco cobra un arancel del{" "}
            {Math.round(DEBT_REPAYMENT_SURCHARGE_RATE * 100)}% sobre el capital que amortizas (impuesto por el cobro de la
            deuda).
          </p>
          {repaymentPreview.principal > 0 && (
            <p className="text-xs text-dnd-gold/85">
              Desde tu bolsa: {repaymentPreview.total} monedas ({repaymentPreview.principal} al capital +{" "}
              {repaymentPreview.surcharge} de arancel).
            </p>
          )}
          <input
            type="number"
            min={1}
            step={1}
            max={Math.max(1, pendingDebt)}
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <button type="submit" disabled={status === "loading"} className="btn-gold py-2 px-3 text-sm">
            Abonar deuda
          </button>
        </form>

        <form
          className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            runOperation(
              "/api/economia/solicitar-fondos",
              { amount: Number(requestAmount), reason: requestReason.trim() || null },
              "Solicitud registrada en el banco del reino.",
            );
          }}
        >
          <p className="font-semibold text-dnd-ink">Solicitar dinero al banco</p>
          <p className="text-xs text-dnd-ink/60">Genera una solicitud administrativa sin impactar saldo inmediato.</p>
          <input
            type="number"
            min={1}
            step={1}
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <input
            type="text"
            maxLength={120}
            placeholder="Motivo (opcional)"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <button type="submit" disabled={status === "loading"} className="btn-gold py-2 px-3 text-sm">
            Registrar solicitud
          </button>
        </form>
      </div>

      <form
        className="rounded-md border border-dnd-ink/20 bg-black/35 p-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          runOperation(
            "/api/economia/registrar-partida",
            { amount: Number(externalAmount), source: externalSource.trim() || null },
            "Ingreso externo agregado al libro mayor.",
          );
        }}
      >
        <p className="font-semibold text-dnd-ink">Trazar dinero de otras partidas</p>
        <p className="text-xs text-dnd-ink/60">
          Registra recompensas externas para consolidar tu economia en un mismo historial.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="number"
            min={1}
            step={1}
            value={externalAmount}
            onChange={(e) => setExternalAmount(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
          <input
            type="text"
            maxLength={120}
            placeholder="Origen de la partida (opcional)"
            value={externalSource}
            onChange={(e) => setExternalSource(e.target.value)}
            disabled={status === "loading"}
            className="w-full rounded border border-dnd-ink/25 bg-black/45 px-3 py-2 text-sm text-dnd-ink"
          />
        </div>
        <button type="submit" disabled={status === "loading"} className="btn-gold py-2 px-3 text-sm">
          Registrar ingreso externo
        </button>
      </form>

      {error && <p className="text-sm text-rose-200">{error}</p>}
      {success && <p className="text-sm text-emerald-200">{success}</p>}
    </section>
  );
}
