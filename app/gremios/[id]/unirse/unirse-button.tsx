"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UnirseButton({ guildId }: { guildId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/gremios/${guildId}/unirse`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.push(`/gremios/${guildId}`);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full btn-gold py-2"
    >
      {loading ? "Uniendo..." : "Unirme al gremio"}
    </button>
  );
}
