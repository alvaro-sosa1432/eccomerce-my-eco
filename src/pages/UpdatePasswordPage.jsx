import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthFeedback, AuthForm, AuthSubmit, PasswordField } from "../components/AuthForm";
import { passwordMinLength, useAuthAction, validatePasswords } from "../auth/authForm";
import { useAuth } from "../auth/useAuth";
import { notify } from "../lib/notify";
import { authConfigError, readJwtClaims, supabase } from "../lib/supabase";

// Supabase keeps the same session ID when refreshing the access token.
function getSessionId(session) {
  return session ? readJwtClaims(session.access_token)?.session_id : undefined;
}

export function UpdatePasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { session, isInitializing } = useAuth();
  const verifiedSessionId = useRef(null);
  const [updated, setUpdated] = useState(false);
  const verification = useAuthAction("Volvé a intentar o solicitá uno nuevo.", "No pudimos verificar el enlace");
  const update = useAuthAction("Volvé a intentar en unos minutos.", "No pudimos guardar la contraseña");
  const tokenHash = params.get("token_hash");
  const canUpdate = Boolean(verifiedSessionId.current && getSessionId(session) === verifiedSessionId.current);

  function verify() {
    verification.run(async () => {
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
      if (error) throw error;
      const sessionId = getSessionId(data.session);
      if (!sessionId) throw new Error();
      notify("success", "Enlace verificado", "Ya podés elegir una contraseña nueva.");
      return sessionId;
    }, (sessionId) => {
      verifiedSessionId.current = sessionId;
      navigate("/update-password", { replace: true });
    });
  }

  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const password = fields.get("password");
    const validationError = validatePasswords(password, fields.get("confirmation"));
    if (validationError) return update.setError(validationError);
    update.run(async () => {
      const current = await supabase.auth.getSession();
      if (current.error) throw current.error;
      if (!verifiedSessionId.current || getSessionId(current.data.session) !== verifiedSessionId.current) {
        throw { code: "otp_expired" };
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      notify("success", "Contraseña actualizada");
    }, () => {
      verifiedSessionId.current = null;
      setUpdated(true);
    });
  }

  const needsLink = !isInitializing && !tokenHash && !canUpdate && !updated;
  const error = authConfigError || verification.error || update.error ||
    (needsLink && "Abrí un enlace de recuperación válido o solicitá uno nuevo.");
  const status = updated ? "Guardamos tu nueva contraseña." : isInitializing && "Comprobando sesión…";

  return (
    <AuthForm title="Nueva contraseña" links={[["/forgot-password", "Solicitar un enlace"], ["/", "Inicio"]]}>
      <AuthFeedback error={error} status={status} />
      {!authConfigError && !isInitializing && tokenHash && (
        <button type="button" className="button button-primary w-full disabled:opacity-70" onClick={verify} disabled={verification.pending}>
          {verification.pending ? "Verificando enlace…" : "Verificar enlace"}
        </button>
      )}
      {!tokenHash && canUpdate && !updated && (
        <form className="space-y-4" onSubmit={submit} aria-busy={update.pending}>
          <PasswordField isNew label="Nueva contraseña" />
          <PasswordField isNew name="confirmation" label="Confirmar contraseña" />
          <p className="text-sm text-muted">Usá al menos {passwordMinLength} caracteres.</p>
          <AuthSubmit pending={update.pending}>{update.pending ? "Guardando…" : "Guardar contraseña"}</AuthSubmit>
        </form>
      )}
    </AuthForm>
  );
}
