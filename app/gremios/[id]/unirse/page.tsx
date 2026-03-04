import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UnirseButton } from "./unirse-button";

export default async function UnirseGremioPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/gremios");

  const guild = await prisma.guild.findUnique({
    where: { id: params.id },
    include: { _count: { select: { members: true } } },
  });
  if (!guild) notFound();

  const alreadyMember = await prisma.guildMember.findFirst({
    where: { guildId: guild.id, userId: session.user.id },
  });
  if (alreadyMember) {
    redirect(`/gremios/${guild.id}`);
  }

  const canJoin = guild._count.members < guild.maxMembers;

  return (
    <div className="max-w-md mx-auto card-parchment p-8">
      <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-2">
        Unirse a {guild.name}
      </h1>
      {guild.description && (
        <p className="text-dnd-ink/70 mb-6">{guild.description}</p>
      )}
      <p className="text-sm text-dnd-ink/60 mb-6">
        {guild._count.members}/{guild.maxMembers} miembros
      </p>
      {!canJoin ? (
        <p className="text-dnd-red mb-4">El gremio está lleno.</p>
      ) : (
        <UnirseButton guildId={guild.id} />
      )}
      <Link href="/gremios" className="block mt-4 text-center text-dnd-gold hover:underline text-sm">
        ← Volver a Gremios
      </Link>
    </div>
  );
}
