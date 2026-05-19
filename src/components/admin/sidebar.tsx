"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  Briefcase,
  Plane,
  Award,
  FileText,
  Users,
  Heart,
  Image,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { type: "separator" as const, label: "Konten" },
  { label: "Santri Mendunia News", href: "/admin/berita", icon: Newspaper },
  { label: "Beasiswa", href: "/admin/beasiswa", icon: GraduationCap },
  { label: "Kursus", href: "/admin/kursus", icon: BookOpen },
  { label: "Pusat Pelatihan", href: "/admin/tes", icon: Award },
  { label: "Ruang Karya", href: "/admin/ebook", icon: FileText },
  { label: "Info Pesantren", href: "/admin/mentor", icon: Compass },
  { type: "separator" as const, label: "Layanan" },
  { label: "Job & Magang", href: "/admin/lowongan", icon: Briefcase },
  { label: "Tour & Travel", href: "/admin/trip", icon: Plane },
  { label: "INKOPONTREN", href: "/admin/produk", icon: ShoppingBag },
  { label: "Donasi", href: "/admin/donasi", icon: Heart },
  { type: "separator" as const, label: "Sistem" },
  { label: "Banner", href: "/admin/banner", icon: Image },
  { label: "Pengguna", href: "/admin/pengguna", icon: Users },
  { label: "Notifikasi", href: "/admin/notifikasi", icon: Bell },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { userData, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-teal-deep leading-tight">Santri Mendunia</h2>
          <p className="text-[11px] text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <Separator />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {menuItems.map((item, i) => {
          if ("type" in item && item.type === "separator") {
            return (
              <div key={i} className="pt-4 pb-1.5 px-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              </div>
            );
          }
          if (!("href" in item)) return null;
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-surface text-teal-deep"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {Icon && <Icon className={`w-4 h-4 ${active ? "text-teal" : ""}`} />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-4 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-teal-surface text-teal text-xs font-bold">
            {userData?.name?.charAt(0)?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{userData?.name || "Admin"}</p>
          <p className="text-[11px] text-muted-foreground truncate">{userData?.email}</p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={signOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-border transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
