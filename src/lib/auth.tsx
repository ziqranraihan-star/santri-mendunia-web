"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  user: any | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isPic: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user);
    });

    // Dengarkan perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUserSession(session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (supabaseUser: any) => {
    setUser(supabaseUser || null);
    if (supabaseUser) {
      // Fetch data dari tabel users
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();
        
      if (data) {
        setUserData({
          uid: data.id,
          ...data,
          managedMenus: data.managed_menus || [],
        } as UserData);
      } else {
        // Jika tidak ada di tabel users, mungkin dia baru sign up. 
        // Idealnya ada trigger Supabase, tapi kita set default saja.
        setUserData({
          uid: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.email.split("@")[0],
          role: "user",
        });
      }
    } else {
      setUserData(null);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const { data: userDoc } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      if (userDoc && userDoc.role !== "admin" && userDoc.role !== "pic") {
        await supabase.auth.signOut();
        throw new Error("Akses ditolak. Hanya admin atau PIC yang dapat masuk.");
      }
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

// ── Helper: Create admin account (run once) ──
export async function createAdminAccount(email: string, password: string, name: string = "Admin Santri") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  
  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      name: name,
      role: "admin"
    });
  }
}

// ── Helper: Register Regular User ──
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
  });
  if (error) throw new Error(error.message);
  
  if (authData.user) {
    // Insert with snake_case because we are using raw supabase client here
    // But wait, the client automatically handles it if we use createDocument. 
    // Here we use raw insert, so we map to snake_case.
    await supabase.from("users").insert({
      id: authData.user.id,
      email: authData.user.email,
      name: data.name,
      role: "user",
      username: data.username,
      phone_number: data.phoneNumber,
      pesantren: data.pesantren
    });
  }
}
