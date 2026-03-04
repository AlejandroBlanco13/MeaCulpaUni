"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || undefined } },
    });
    if (err) {
      setError(err.message ?? "Error al registrar.");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card-parchment p-8">
      <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-6 text-center">
        Crear cuenta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dnd-ink mb-1">
            Nombre (opcional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dnd-ink mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dnd-ink mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-dnd-ink mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        {error && <p className="text-dnd-red text-sm">{error}</p>}
        <button type="submit" className="w-full btn-gold py-2">
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-dnd-ink/70">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-dnd-gold font-medium hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
