"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message || "Email o contraseña incorrectos.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card-parchment p-8">
      <h1 className="font-medieval text-2xl font-bold text-dnd-ink mb-6 text-center">
        Iniciar sesión
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-3 py-2 border-2 border-dnd-ink/20 rounded bg-white text-dnd-ink"
          />
        </div>
        {error && <p className="text-dnd-red text-sm">{error}</p>}
        <button type="submit" className="w-full btn-gold py-2">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-dnd-ink/70">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-dnd-gold font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
