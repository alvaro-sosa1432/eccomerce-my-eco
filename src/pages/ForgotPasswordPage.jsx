import { useState } from "react";
import { AuthFeedback, AuthForm, AuthSubmit, EmailField } from "../components/AuthForm";
import { useAuthAction } from "../auth/authForm";
import { notify } from "../lib/notify";
import { authConfigError, authRedirectUrl, supabase } from "../lib/supabase";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { pending, error, run } = useAuthAction("Volvé a intentar en unos minutos.", "No pudimos solicitar el enlace");

  function submit(event) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email").trim();
    run(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirectUrl });
      if (error && error.code !== "user_not_found") throw error;
      notify("info", "Revisá tu correo", "Si existe una cuenta con ese correo, vas a recibir un enlace de recuperación.");
    }, () => setSent(true));
  }

  return (
    <AuthForm title="Recuperar contraseña" links={[["/login", "Iniciar sesión"], ["/", "Inicio"]]}>
      <AuthFeedback
        error={authConfigError || error}
        status={sent && "Si hay una cuenta con ese correo, vas a recibir un enlace para restablecer la contraseña. Revisá también la carpeta de spam."}
      />
      {!authConfigError && !sent && (
        <form className="space-y-4" onSubmit={submit} aria-busy={pending}>
          <EmailField />
          <AuthSubmit pending={pending}>{pending ? "Enviando enlace…" : "Enviar enlace"}</AuthSubmit>
        </form>
      )}
    </AuthForm>
  );
}
