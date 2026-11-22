import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export function readJwtClaims(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function createAuthClient() {
  try {
    const projectUrl = new URL(url);
    const isPublicKey = key?.startsWith("sb_publishable_") || readJwtClaims(key)?.role === "anon";
    if (!isPublicKey || !["https:", "http:"].includes(projectUrl.protocol)) return null;

    // The dashboard can also show individual service URLs. The SDK appends these paths itself.
    if (projectUrl.hostname.endsWith(".supabase.co") && /^\/(rest|auth|storage)\/v1\/?$/.test(projectUrl.pathname)) {
      projectUrl.pathname = "/";
    }

    return createClient(projectUrl.href, key, {
      auth: {
        detectSessionInUrl: (callback, params) =>
          !callback.hash.startsWith("#/") && params.type !== "recovery" && Boolean(params.access_token),
      },
    });
  } catch {
    return null;
  }
}

export const supabase = createAuthClient();
export const authRedirectUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href;
export const authConfigError = supabase ? "" : import.meta.env.DEV
  ? "Configurá VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (o VITE_SUPABASE_ANON_KEY) en .env.local y reiniciá Vite."
  : "La autenticación no está disponible en este momento.";
