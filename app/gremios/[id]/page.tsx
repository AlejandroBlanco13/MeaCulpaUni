import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageList } from "@/components/guild-message-list";
import { VaultSection } from "@/components/guild-vault-section";
import { Users, MessageSquare, Package } from "lucide-react";

export default async function GremioIdPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/gremios");

  const supabase = await createClient();
  const { data: guild } = await supabase
    .from("guilds")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!guild) notFound();

  const { data: members } = await supabase
    .from("guild_members")
    .select("id, user_id, role, can_access_vault")
    .eq("guild_id", params.id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, name")
    .in("id", (members ?? []).map((m) => m.user_id));
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const membership = (members ?? []).find((m) => m.user_id === session.user.id);
  if (!membership) redirect("/gremios");

  const canAccessVault = membership.can_access_vault || membership.role === "leader" || membership.role === "officer";

  const { data: vault } = await supabase
    .from("guild_vault_items")
    .select("*")
    .eq("guild_id", params.id);

  const vaultList = (vault ?? []).map((v) => ({ id: v.id, itemId: v.item_id, quantity: v.quantity }));

  return (
    <div className="space-y-8">
      <Link href="/gremios" className="text-dnd-gold hover:underline text-sm">
        ← Volver a Gremios
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-2">
            <Users className="w-8 h-8" />
            {guild.name}
          </h1>
          {guild.description && (
            <p className="text-dnd-ink/70 mt-1">{guild.description}</p>
          )}
          <p className="text-sm text-dnd-ink/50 mt-2">
            {(members ?? []).length}/{guild.max_members} miembros · Tu rol: {membership.role}
          </p>
        </div>
      </header>

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat del gremio
        </h2>
        <MessageList guildId={guild.id} userId={session.user.id} />
      </section>

      {canAccessVault && (
        <section>
          <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-2 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Bóveda del gremio (inventario compartido)
          </h2>
          <p className="text-sm text-dnd-ink/60 mb-4">
            Solo los miembros con acceso pueden ver y gestionar la bóveda.
          </p>
          <VaultSection guildId={guild.id} items={vaultList} />
        </section>
      )}

      <section>
        <h2 className="font-medieval text-xl font-semibold text-dnd-ink mb-2">
          Miembros
        </h2>
        <ul className="flex flex-wrap gap-2">
          {(members ?? []).map((m) => {
            const p = profileMap.get(m.user_id);
            return (
              <li
                key={m.id}
                className="px-3 py-2 rounded bg-dnd-ink/10 text-dnd-ink text-sm"
              >
                {p?.name || p?.email || m.user_id} ({m.role})
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
