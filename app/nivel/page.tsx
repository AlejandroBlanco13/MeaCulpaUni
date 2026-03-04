import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shield, Sparkles } from "lucide-react";

export default async function NivelPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/nivel");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("level, experience")
    .eq("id", session.user.id)
    .single();

  const level = profile?.level ?? "principiante";
  const experience = profile?.experience ?? 0;
  const isPrincipiante = level === "principiante";
  const xpToNext = 100;
  const progress = Math.min(100, (experience / xpToNext) * 100);

  return (
    <div className="space-y-8">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <Shield className="w-8 h-8" />
        Nivel
      </h1>
      <p className="text-dnd-ink/70">
        Sistema de nivelado: principiante y experimentado. Gana experiencia jugando y completando misiones.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-parchment p-8">
          <h2 className="font-medieval text-xl font-semibold text-dnd-ink flex items-center gap-2 mb-2">
            {isPrincipiante ? (
              <Shield className="w-6 h-6 text-dnd-forest" />
            ) : (
              <Sparkles className="w-6 h-6 text-dnd-gold" />
            )}
            {isPrincipiante ? "Principiante" : "Experimentado"}
          </h2>
          <p className="text-dnd-ink/70 text-sm">
            {isPrincipiante
              ? "Estás empezando. Completa misiones y actividades para ganar experiencia y subir de nivel."
              : "Has demostrado experiencia. Tienes acceso a ventajas y contenido adicional."}
          </p>
        </div>
        <div className="card-parchment p-8">
          <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">
            Experiencia
          </h2>
          <p className="text-dnd-ink/70">
            <strong className="text-dnd-ink">{experience}</strong> XP
            {isPrincipiante && (
              <span className="text-sm text-dnd-ink/60">
                {" "}
                / {xpToNext} para experimentado
              </span>
            )}
          </p>
          {isPrincipiante && (
            <div className="mt-4">
              <div className="h-3 bg-dnd-ink/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dnd-gold rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
