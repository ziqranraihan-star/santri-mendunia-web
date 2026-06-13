"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, isAdmin, isPic } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData && !isAdmin && !isPic) {
        router.push("/login");
      } else if (isPic && userData?.managedMenus) {
        // Cek jika ini bukan halaman dashboard
        const path = window.location.pathname;
        if (path !== "/admin/dashboard" && path !== "/admin") {
          // Cari apakah path saat ini ada di managedMenus
          const isAllowed = userData.managedMenus.some(menu => path.startsWith(menu));
          if (!isAllowed) {
            router.push("/admin/dashboard");
          }
        }
      }
    }
  }, [user, userData, loading, isAdmin, isPic, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isPic)) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
