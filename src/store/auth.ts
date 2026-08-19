import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import type { Usuario } from "@/types/database";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
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
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const u = session.data.user as typeof session.data.user & { role?: string };
        const userObj: AuthUser = {
          id: u.id,
          email: u.email,
          name: u.name,
          image: u.image ?? null,
          role: u.role ?? "usuario",
        };
        const profileObj: Usuario = {
          id: u.id,
          email: u.email,
          nombre: u.name,
          foto_perfil: u.image ?? null,
          rol: (u.role as "usuario" | "admin") || "usuario",
          creado_en: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
          actualizado_en: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString(),
        };
        set({ user: userObj, profile: profileObj, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch {
      set({ user: null, profile: null, loading: false });
    }
  },

  signOut: async () => {
    await authClient.signOut();
    set({ user: null, profile: null });
  },
}));
