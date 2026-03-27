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

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [mode, setMode] = useState<Mode>("login");
  const [registerPending, setRegisterPending] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (searchParams.get("registro") === "1") setMode("register");
  }, [searchParams]);

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

  function goLogin() {
    setMode("login");
    setError("");
    router.replace("/login", { scroll: false });
  }

  function goRegister() {
    setMode("register");
    setError("");
    router.replace("/login?registro=1", { scroll: false });
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Indica el correo y la contraseña.");
      triggerShake();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      setError("Introduce un correo electrónico válido.");
      triggerShake();
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      triggerShake();
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
    if (err) {
      setError("Las credenciales no son correctas.");
      setLoading(false);
      triggerShake();
      return;
    }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push(callbackUrl);
      router.refresh();
    }, 1200);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("Indica un nombre de al menos 2 caracteres.");
      triggerShake();
      return;
    }
    if (!trimmedEmail || !regPassword) {
      setError("Completa correo y contraseña.");
      triggerShake();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      setError("Introduce un correo electrónico válido.");
      triggerShake();
      return;
    }
    if (regPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      triggerShake();
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Las contraseñas no coinciden.");
      triggerShake();
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: regPassword,
      options: {
        data: {
          name: trimmedName,
        },
      },
    });
    if (err) {
      setLoading(false);
      const msg = err.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("Ese correo ya tiene una cuenta. Inicia sesión.");
      } else if (msg.includes("password")) {
        setError("La contraseña no cumple los requisitos del sistema.");
      } else {
        setError("No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
      triggerShake();
      return;
    }
    setLoading(false);
    if (data.session) {
      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1200);
    } else {
      setRegisterPending(true);
    }
  }

  return (
    <div className="login-page">
      <div id="login-bg-particles" className="login-bg-particles" aria-hidden />

      <div className="login-wrap">
        <div className="login-lore-side">
          <div className="login-corner login-c-tl" />
          <div className="login-corner login-c-tr" />
          <div className="login-corner login-c-bl" />
          <div className="login-corner login-c-br" />
          <div className="login-lore-bg-num" aria-hidden>D</div>
          <CrestSvg className="login-crest" />
          <h1 className="login-lore-title">
            Dungeons<br />&amp; Dragons
          </h1>
          <p className="login-lore-sub">Portales del Aventurero</p>
          <div className="login-deco-line">
            <div className="login-diamond" />
          </div>
          <p className="login-lore-text">
            Solo los héroes verdaderos cruzan este umbral. Tu historia, tus victorias, tu leyenda — todo te espera del otro
            lado.
          </p>
          <blockquote className="login-lore-quote">
            <p>«El dungeon no distingue entre cobarde y valiente. Solo entre vivo y muerto.»</p>
            <cite>— Crónicas de Valdrimont</cite>
          </blockquote>
        </div>

        <div className="login-form-side">
          <div className="login-corner login-c-tl" />
          <div className="login-corner login-c-tr" />
          <div className="login-corner login-c-bl" />
          <div className="login-corner login-c-br" />

          {registerPending ? (
            <div className="login-success-msg">
              <SuccessCrestSvg />
              <div className="login-success-title">Revisa tu correo</div>
              <div className="login-success-sub">
                Hemos enviado un enlace a tu correo para confirmar la cuenta. Cuando lo confirmes, podrás iniciar sesión con
                el mismo correo y contraseña.
              </div>
              <button
                type="button"
                className="login-submit-btn mt-2"
                onClick={() => {
                  setRegisterPending(false);
                  goLogin();
                }}
              >
                Ir a iniciar sesión
              </button>
            </div>
          ) : success ? (
            <div id="login-success-msg" className="login-success-msg">
              <SuccessCrestSvg />
              <div className="login-success-title">
                ¡Bienvenido,<br />
                Aventurero!
              </div>
              <div className="login-success-sub">Las puertas del dungeon se abren ante ti.</div>
            </div>
          ) : mode === "login" ? (
            <>
              <p className="login-form-title">Acceso al Gremio</p>
              <p className="login-form-subtitle">Inicia sesión con los datos de tu cuenta de jugador</p>

              <form
                onSubmit={handleLogin}
                id="login-auth-form"
                className={`login-auth-form ${shake ? "login-shake" : ""}`}
                noValidate
              >
                <div className="login-field">
                  <label className="login-field-label" htmlFor="login-email">
                    Correo electrónico
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    ✉
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    className="login-field-input"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="login-field">
                  <label className="login-field-label" htmlFor="login-password">
                    Contraseña
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    🔒
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    className="login-field-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                  <Link href="#" className="login-forgot-link">
                    ¿Olvidaste tu hechizo?
                  </Link>
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
                  <button type="button" className="login-social-btn" disabled>
                    🌐 Google
                  </button>
                  <button type="button" className="login-social-btn" disabled>
                    🎮 Discord
                  </button>
                </div>

                <p className="login-register-link">
                  ¿No tienes cuenta?{" "}
                  <button type="button" onClick={goRegister}>
                    Crear cuenta nueva
                  </button>
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="login-form-title">Forjar leyenda</p>
              <p className="login-form-subtitle">Crea tu cuenta de jugador para unirte al gremio</p>

              <form
                onSubmit={handleRegister}
                id="register-auth-form"
                className={`login-auth-form ${shake ? "login-shake" : ""}`}
                noValidate
              >
                <div className="login-field">
                  <label className="login-field-label" htmlFor="register-name">
                    Nombre del aventurero
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    ⚔
                  </span>
                  <input
                    id="register-name"
                    name="name"
                    className="login-field-input"
                    type="text"
                    autoComplete="name"
                    placeholder="Cómo te verán en el reino"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="login-field">
                  <label className="login-field-label" htmlFor="register-email">
                    Correo electrónico
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    ✉
                  </span>
                  <input
                    id="register-email"
                    name="email"
                    className="login-field-input"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@correo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="login-field">
                  <label className="login-field-label" htmlFor="register-password">
                    Contraseña
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    🔒
                  </span>
                  <input
                    id="register-password"
                    name="password"
                    className="login-field-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
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

                <div className="login-field">
                  <label className="login-field-label" htmlFor="register-confirm">
                    Confirmar contraseña
                  </label>
                  <span className="login-field-icon" aria-hidden>
                    🔒
                  </span>
                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    className="login-field-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="repite la contraseña"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                {error && <p className="login-error-msg">{error}</p>}

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? "⏳ Forjando tu cuenta…" : "⚔\u00a0Crear cuenta"}
                </button>

                <p className="login-register-link mt-6">
                  ¿Ya tienes cuenta?{" "}
                  <button type="button" onClick={goLogin}>
                    Iniciar sesión
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
