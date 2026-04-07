import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { UsersRound, ArrowLeft } from "lucide-react";
import { GuildsGallery, type GuildRow } from "@/components/guilds-gallery";
import clanesBanner from "@/app/IMG/Clanes/CLANES.jpg";

export default async function GremiosPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/gremios");
  }

  const supabase = await createClient();
  const { data: myRows } = await supabase
    .from("guild_members")
    .select("guild_id, role")
    .eq("user_id", session.user.id);
  const myMemberships = myRows ?? [];
  const myByGuild = new Map(myMemberships.map((m) => [m.guild_id, m]));

  const { data: allGuilds } = await supabase.from("guilds").select("*").order("name");
  const { data: allMemberCounts } = await supabase.from("guild_members").select("guild_id");
  const countByGuild: Record<string, number> = {};
  (allMemberCounts ?? []).forEach((r) => {
    countByGuild[r.guild_id] = (countByGuild[r.guild_id] ?? 0) + 1;
  });

  const guildRows: GuildRow[] = (allGuilds ?? []).map((g) => {
    const mem = myByGuild.get(g.id);
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      max_members: g.max_members,
      memberCount: countByGuild[g.id] ?? 0,
      isMember: !!mem,
      role: mem?.role ?? null,
    };
  });

  return (
    <>
      {/* Fondo: cubre 100% del viewport (ancho y alto) en móvil y escritorio; dvh ajusta barras del sistema */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] h-dvh min-h-dvh w-full max-w-none min-w-full overflow-hidden"
        aria-hidden
      >
        <div className="relative h-full min-h-dvh w-full min-w-full">
          <Image
            src={clanesBanner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
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
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Link>
            </div>

            <header className="mt-4 rounded-md border border-dnd-gold/20 bg-black/40 px-5 py-5 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-7">
              <h1 className="font-medieval text-3xl font-bold text-dnd-ink flex items-center gap-3 sm:text-4xl">
                <UsersRound className="w-8 h-8 shrink-0 text-dnd-gold" />
                Gremios y facciones
              </h1>
              <p className="mt-2 text-sm text-dnd-ink/70 sm:text-base">
                Grupos con chat interno, bóveda compartida y límite de miembros. Las{" "}
                <strong className="text-dnd-ink/85">facciones visuales</strong> (colores y etiquetas) ayudan a orientarte;
                el enlace te lleva al registro del gremio o a unirte si aún no formas parte.
              </p>
            </header>

            <div className="mt-8 rounded-xl border border-neutral-800/80 bg-[#121212]/88 p-5 shadow-inner backdrop-blur-sm sm:p-7">
              <GuildsGallery guilds={guildRows} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
