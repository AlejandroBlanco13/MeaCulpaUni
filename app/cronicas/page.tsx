import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Video, ScrollText } from "lucide-react";

export default async function CronicasPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/cronicas");
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="text-center space-y-3">
          <p className="font-medieval text-xs uppercase tracking-[0.35em] text-amber-500/80">
            Cronicas D&D
          </p>
          <h1 className="font-medieval text-3xl sm:text-4xl font-bold text-dnd-ink inline-flex items-center gap-2">
            <ScrollText className="w-7 h-7 text-amber-400" />
            Video de campaña
          </h1>
          <p className="text-dnd-ink/70 max-w-2xl mx-auto">
            Esta sección esta dedicada a las crónicas de la partida. El video se reproduce dentro de Mea Culpa para
            mantener al jugador en el sistema.
          </p>
        </header>

        <div className="overflow-hidden rounded-md border border-amber-500/30 bg-black/70 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              title="Cronicas de Dungeons and Dragons"
              src="https://www.youtube.com/embed/SqHYj_MYnhI"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="realms-btn realms-btn-outline inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95"
          >
            <Video className="w-4 h-4" />
            Volver a la mesa
          </Link>
        </div>
      </div>
    </div>
  );
}
