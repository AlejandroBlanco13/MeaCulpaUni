import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UnirseButton } from "./unirse-button";

export default async function UnirseGremioPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/gremios");

  const supabase = await createClient();

  const { data: guild } = await supabase
    .from("guilds")
    .select("id, name, description, max_members")
    .eq("id", params.id)
    .single();

  if (!guild) notFound();

  const { data: existing } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", guild.id)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/gremios/${guild.id}`);
  }

  const { count } = await supabase
    .from("guild_members")
    .select("id", { count: "exact", head: true })
    .eq("guild_id", guild.id);

  const memberCount = count ?? 0;
  const canJoin = memberCount < guild.max_members;

  return (
    <div className="max-w-md mx-auto card-parchment p-8">
      <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-2">
        Unirse a {guild.name}
      </h1>
      {guild.description && (
        <p className="text-dnd-ink/70 mb-6">{guild.description}</p>
      )}
      <p className="text-sm text-dnd-ink/60 mb-6">
        {memberCount}/{guild.max_members} miembros
      </p>
      {!canJoin ? (
        <p className="text-dnd-red mb-4">El gremio está lleno.</p>
      ) : (
        <UnirseButton guildId={guild.id} />
      )}
      <Link
        href="/gremios"
        className="block mt-4 text-center text-dnd-gold hover:underline text-sm"
      >
        ← Volver a Gremios
      </Link>
    </div>
  );
}
