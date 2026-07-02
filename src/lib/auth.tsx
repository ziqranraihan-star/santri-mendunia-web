"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
  username?: string;
  phoneNumber?: string;
  pesantren?: string;
  managedMenus?: string[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isPic: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const ADMIN_ROLES = new Set(["admin", "pic"]);

function isNetworkAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /failed to fetch|network|fetch/i.test(message);
}

function getFriendlyAuthMessage(error: unknown) {
  if (isNetworkAuthError(error)) {
    return "Koneksi ke server autentikasi bermasalah. Pastikan konfigurasi Supabase di Vercel sudah benar, lalu coba lagi.";
  }

  return error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.";
}

async function safeSignOut() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn("Failed to clear auth session:", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        void handleUserSession(session?.user);
      })
      .catch((error) => {
        console.error("Failed to get auth session:", error);
        setUser(null);
        setUserData(null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleUserSession(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (supabaseUser?: User | null) => {
    setUser(supabaseUser || null);

    if (!supabaseUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserData({
          uid: data.id,
          ...data,
          managedMenus: data.managed_menus || [],
        } as UserData);
      } else {
        setUserData({
          uid: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.email?.split("@")[0] || "User",
          role: "user",
        });
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      if (data.user) {
        const { data: userDoc, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (userError) throw userError;

        if (!userDoc || !ADMIN_ROLES.has(userDoc.role)) {
          await safeSignOut();
          throw new Error("Akses ditolak. Hanya admin atau PIC yang dapat masuk.");
        }
      }
    } catch (error) {
      if (isNetworkAuthError(error)) {
        await safeSignOut();
      }

      throw new Error(getFriendlyAuthMessage(error));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin: userData?.role === "admin",
        isPic: userData?.role === "pic",
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export async function signUpUser(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  pesantren: string;
}) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
        phone_number: data.phoneNumber,
        pesantren: data.pesantren,
      },
    },
  });

  if (error) throw new Error(error.message);

  if (authData.user) {
    await supabase.from("users").upsert({
      id: authData.user.id,
      email: authData.user.email,
      name: data.name,
      role: "user",
      username: data.username,
      phone_number: data.phoneNumber,
      pesantren: data.pesantren,
    });
  }
}
