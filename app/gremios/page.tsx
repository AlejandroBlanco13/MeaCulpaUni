import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Users, Plus } from "lucide-react";

export default async function GremiosPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/gremios");
  }

  const supabase = await createClient();
  const { data: myRows } = await supabase
    .from("guild_members")
    .select("guild_id, role, can_access_vault")
    .eq("user_id", session.user.id);
  const myMemberships = myRows ?? [];
  const myGuildIds = myMemberships.map((m) => m.guild_id);

  const { data: allGuilds } = await supabase.from("guilds").select("*").order("name");
  const { data: allMemberCounts } = await supabase
    .from("guild_members")
    .select("guild_id");
  const countByGuild: Record<string, number> = {};
  (allMemberCounts ?? []).forEach((r) => {
    countByGuild[r.guild_id] = (countByGuild[r.guild_id] ?? 0) + 1;
  });

  const myGuilds = (allGuilds ?? []).filter((g) => myGuildIds.includes(g.id));
  const otherGuilds = (allGuilds ?? []).filter((g) => !myGuildIds.includes(g.id));

  return (
    <div className="space-y-8">
      <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
        <Users className="w-8 h-8" />
        Gremios
      </h1>
      <p className="text-dnd-ink/70">
        Grupos y equipos expandibles (hasta 10 personas). Chat interno, inventario del gremio y bóveda solo para quienes tienen acceso.
      </p>

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">
          Mis gremios
        </h2>
        {myGuilds.length === 0 ? (
          <p className="text-dnd-ink/70">No perteneces a ningún gremio.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {myGuilds.map((g) => {
              const mem = myMemberships.find((m) => m.guild_id === g.id);
              return (
                <li key={g.id}>
                  <Link
                    href={`/gremios/${g.id}`}
                    className="card-parchment p-6 block hover:border-dnd-gold/50"
                  >
                    <h3 className="font-medieval text-lg font-semibold text-dnd-ink">
                      {g.name}
                    </h3>
                    <p className="text-sm text-dnd-ink/70 mt-1">
                      {g.description ?? "Sin descripción"}
                    </p>
                    {mem && (
                      <p className="text-sm text-dnd-forest mt-2">
                        {mem.role} · {mem.can_access_vault ? "Acceso a bóveda" : "Sin bóveda"}
                      </p>
                    )}
                    <p className="text-dnd-ink/50 text-xs mt-1">
                      {countByGuild[g.id] ?? 0}/{g.max_members} miembros
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-4">
          Otros gremios
        </h2>
        {otherGuilds.length === 0 ? (
          <p className="text-dnd-ink/70">No hay más gremios o ya estás en todos.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {otherGuilds.map((g) => (
              <li key={g.id} className="card-parchment p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medieval text-lg font-semibold text-dnd-ink">
                    {g.name}
                  </h3>
                  <p className="text-sm text-dnd-ink/50">
                    {countByGuild[g.id] ?? 0}/{g.max_members} miembros
                  </p>
                </div>
                <Link
                  href={`/gremios/${g.id}/unirse`}
                  className="btn-gold py-2 px-4 text-sm"
                >
                  Unirse
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/gremios/nuevo" className="btn-gold inline-flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Crear gremio
      </Link>
    </div>
  );
}
