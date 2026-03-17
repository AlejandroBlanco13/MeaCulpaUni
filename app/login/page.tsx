"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function CrestSvg({ className }: { className?: string }) {
  return (
    <svg className={className} width={90} height={90} viewBox="0 0 100 100" fill="none">
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="#C9A84C" strokeWidth={1.5} />
      <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="#8B6914" strokeWidth={0.8} />
      <path d="M50 20 L50 80 M25 35 L75 65 M75 35 L25 65" stroke="#C9A84C" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={50} cy={50} r={8} fill="none" stroke="#F0D080" strokeWidth={1.2} />
      <circle cx={50} cy={50} r={3} fill="#C9A84C" />
      <circle cx={50} cy={20} r={3} fill="#C9A84C" />
      <circle cx={80} cy={35} r={2} fill="#8B6914" />
      <circle cx={80} cy={65} r={2} fill="#8B6914" />
      <circle cx={50} cy={80} r={3} fill="#C9A84C" />
      <circle cx={20} cy={65} r={2} fill="#8B6914" />
      <circle cx={20} cy={35} r={2} fill="#8B6914" />
    </svg>
  );
}

function SuccessCrestSvg() {
  return (
    <svg className="login-success-crest" width={80} height={80} viewBox="0 0 100 100" fill="none">
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="#C9A84C" strokeWidth={2} />
      <path d="M28 50 L44 66 L72 34" stroke="#C9A84C" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const el = document.getElementById("login-bg-particles");
    if (!el) return;
    for (let i = 0; i < 35; i++) {
      const m = document.createElement("div");
      m.className = "login-mote";
      const sz = Math.random() * 2.5 + 0.8;
      m.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${sz}px; height: ${sz}px;
        background: ${Math.random() > 0.5 ? "#C9A84C" : "#FF6B00"};
        animation-duration: ${Math.random() * 12 + 8}s;
        animation-delay: ${Math.random() * 12}s;
      `;
      el.appendChild(m);
    }
    return () => {
      el.innerHTML = "";
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
    if (err) {
      setError(err.message || "Correo o palabra de paso incorrectos.");
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push(callbackUrl);
      router.refresh();
    }, 1200);
  }

  return (
    <div className="login-page">
      <div id="login-bg-particles" className="login-bg-particles" aria-hidden />

      <div className="login-wrap">
        {/* Columna izquierda: Lore */}
        <div className="login-lore-side">
          <div className="login-corner login-c-tl" />
          <div className="login-corner login-c-tr" />
          <div className="login-corner login-c-bl" />
          <div className="login-corner login-c-br" />
          <div className="login-lore-bg-num" aria-hidden>D</div>
          <CrestSvg className="login-crest" />
          <h1 className="login-lore-title">Dungeons<br />&amp; Dragons</h1>
          <p className="login-lore-sub">Portales del Aventurero</p>
          <div className="login-deco-line"><div className="login-diamond" /></div>
          <p className="login-lore-text">
            Solo los héroes verdaderos cruzan este umbral. Tu historia, tus victorias,
            tu leyenda — todo te espera del otro lado.
          </p>
          <blockquote className="login-lore-quote">
            <p>«El dungeon no distingue entre cobarde y valiente. Solo entre vivo y muerto.»</p>
            <cite>— Crónicas de Valdrimont</cite>
          </blockquote>
        </div>

        {/* Columna derecha: Formulario */}
        <div className="login-form-side">
          <div className="login-corner login-c-tl" />
          <div className="login-corner login-c-tr" />
          <div className="login-corner login-c-bl" />
          <div className="login-corner login-c-br" />

          {!success ? (
            <>
              <p className="login-form-title">Acceso al Gremio</p>
              <p className="login-form-subtitle">Identifica tu nombre ante los dioses del juego</p>

              <form
                onSubmit={handleSubmit}
                id="login-auth-form"
                className={`login-auth-form ${shake ? "login-shake" : ""}`}
                noValidate
                autoComplete="off"
              >
                <div className="login-field">
                  <label className="login-field-label" htmlFor="login-email">Correo / Pergamino</label>
                  <span className="login-field-icon" aria-hidden>✉</span>
                  <input
                    id="login-email"
                    className="login-field-input"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="login-field">
                  <label className="login-field-label" htmlFor="login-password">Contraseña / Palabra de Paso</label>
                  <span className="login-field-icon" aria-hidden>🔒</span>
                  <input
                    id="login-password"
                    className="login-field-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-eye-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                <div className="login-options-row">
                  <label className="login-remember-label">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      disabled={loading}
                    />
                    Recordarme
                  </label>
                  <Link href="#" className="login-forgot-link">¿Olvidaste tu hechizo?</Link>
                </div>

                {error && <p className="login-error-msg">{error}</p>}

                <button type="submit" id="login-submit-btn" className="login-submit-btn" disabled={loading}>
                  <span id="login-btn-text">
                    {loading ? "⏳ Consultando los oráculos…" : "⚔\u00a0Cruzar el Umbral"}
                  </span>
                </button>

                <div className="login-or-divider">
                  <span className="login-or-text">o continúa con</span>
                </div>

                <div className="login-social-row">
                  <button type="button" className="login-social-btn" disabled>🌐 Google</button>
                  <button type="button" className="login-social-btn" disabled>🎮 Discord</button>
                </div>

                <p className="login-register-link">
                  ¿Nuevo en Mea Culpa? Usa este mismo portal de acceso, tu cuenta será creada por el DM.
                </p>
              </form>
            </>
          ) : (
            <div id="login-success-msg" className="login-success-msg">
              <SuccessCrestSvg />
              <div className="login-success-title">¡Bienvenido,<br />Aventurero!</div>
              <div className="login-success-sub">Las puertas del dungeon se abren ante ti.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
