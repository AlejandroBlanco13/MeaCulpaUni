"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApuntarButton({
  newsId,
  isSubscribed,
}: {
  newsId: string;
  isSubscribed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/noticias/${newsId}/apuntar`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="border-2 border-dnd-gold text-dnd-gold px-4 py-2 rounded hover:bg-dnd-gold/20"
    >
      {loading ? "..." : isSubscribed ? "Desapuntarme" : "Apuntarme a esta noticia"}
    </button>
  );
}
