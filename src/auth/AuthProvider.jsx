import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { cartKey } from "../services/cartService";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState({ session: null, isInitializing: Boolean(supabase), initializationError: false });

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let receivedAuthEvent = false;
    let currentUserId;
    const setSession = (session) => {
      if (!active) return;
      const nextUserId = session?.user.id;
      if (currentUserId && currentUserId !== nextUserId) {
        const key = cartKey(currentUserId);
        queryClient.removeQueries({ queryKey: key, exact: true });
        const mutations = queryClient.getMutationCache();
        for (const mutation of mutations.findAll({ mutationKey: key })) mutations.remove(mutation);
      }
      currentUserId = nextUserId;
      setState({ session, isInitializing: false, initializationError: false });
    };
    const setError = () => {
      if (active && !receivedAuthEvent) {
        setState({ session: null, isInitializing: false, initializationError: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      receivedAuthEvent = true;
      setSession(session);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (receivedAuthEvent) return;
      if (error) setError();
      else setSession(data.session);
    }).catch(setError);

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const user = state.session?.user ?? null;
  return <AuthContext.Provider value={{ ...state, user, isAuthenticated: Boolean(user) }}>{children}</AuthContext.Provider>;
}
