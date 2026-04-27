import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { Usuario } from "@/types/database";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: Usuario | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.warn("No se pudo cargar el perfil desde 'usuarios':", error.message);
      }

      set({ user, profile: profile ?? null, loading: false });
    } else {
      set({ user: null, profile: null, loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", session.user.id)
          .single();
        set({ user: session.user, profile: profile ?? null, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
