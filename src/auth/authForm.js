import { useEffect, useRef, useState } from "react";
import { notify } from "../lib/notify";

export const passwordMinLength = 8;

export function validatePasswords(password, confirmation) {
  if (password.length < passwordMinLength) return `Usá al menos ${passwordMinLength} caracteres.`;
  if (password !== confirmation) return "Las contraseñas deben coincidir.";
  return "";
}

const messages = {
  invalid_credentials: "El correo o la contraseña son incorrectos.",
  email_not_confirmed: "Confirmá tu correo con el enlace que te enviamos antes de iniciar sesión.",
  weak_password: "La contraseña no cumple los requisitos de seguridad del proyecto. Probá con una más larga y variada.",
  same_password: "La nueva contraseña debe ser diferente de la anterior.",
  otp_expired: "El enlace venció o ya se usó. Solicitá uno nuevo.",
  over_email_send_rate_limit: "Se alcanzó el límite de correos. Esperá unos minutos antes de volver a intentar.",
  over_request_rate_limit: "Hubo demasiados intentos. Esperá unos minutos y volvé a intentar.",
  request_timeout: "La solicitud tardó demasiado. Volvé a intentar.",
  user_already_exists: "Ya hay una cuenta con ese correo. Podés iniciar sesión o recuperar la contraseña.",
  reauthentication_needed: "Supabase requiere otra verificación. Solicitá un nuevo enlace de recuperación.",
};

export function authErrorMessage(error, fallback) {
  if (error?.name === "AuthRetryableFetchError" || error instanceof TypeError || error?.status === 0) {
    return "No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.";
  }
  return messages[error?.code] ?? fallback;
}

export function useAuthAction(fallback, errorTitle) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function run(action, onSuccess) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const result = await action();
      if (mounted.current) onSuccess?.(result);
    } catch (failure) {
      const message = authErrorMessage(failure, fallback);
      if (errorTitle) notify("error", errorTitle, message);
      if (mounted.current) setError(message);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  }

  return { pending, error, setError, run };
}

export function safeReturnPath(from) {
  if (typeof from !== "string" || !/^\/(?!\/)/.test(from) || /[\\\s]/.test(from)) return "/";
  const url = new URL(from, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname.startsWith("//") ||
    /^\/(login|register|forgot-password|update-password)\/*$/i.test(url.pathname)) return "/";
  return url.pathname + url.search + url.hash;
}
