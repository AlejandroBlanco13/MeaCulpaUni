"use client";

import { useEffect, useState, useRef } from "react";

type Message = { id: string; content: string; userId: string; createdAt: string };

export function MessageList({ guildId, userId }: { guildId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const res = await fetch(`/api/gremios/${guildId}/mensajes`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
    const t = setInterval(fetchMessages, 5000);
    return () => clearInterval(t);
  }, [guildId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const res = await fetch(`/api/gremios/${guildId}/mensajes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage.trim() }),
    });
    if (res.ok) {
      setNewMessage("");
      fetchMessages();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (loading) return <p className="text-dnd-ink/60">Cargando mensajes...</p>;

  return (
    <div className="card-parchment p-4">
      <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
        {messages.length === 0 ? (
          <p className="text-dnd-ink/60 text-sm">No hay mensajes. ¡Escribe el primero!</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-2 rounded text-sm ${
                m.userId === userId ? "bg-dnd-gold/20 ml-4" : "bg-dnd-ink/10 mr-4"
              }`}
            >
              <span className="text-dnd-ink/60 text-xs">
                {new Date(m.createdAt).toLocaleTimeString("es", { timeStyle: "short" })}
              </span>
              <p className="text-dnd-ink break-words">{m.content}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-black placeholder:text-neutral-500"
          maxLength={500}
        />
        <button type="submit" className="btn-gold py-2 px-4">
          Enviar
        </button>
      </form>
    </div>
  );
}
