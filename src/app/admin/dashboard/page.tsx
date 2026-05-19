"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLLECTIONS, countDocuments } from "@/lib/supabase/client";

import {
  Newspaper, GraduationCap, BookOpen, Users, ShoppingBag,
  Briefcase, Heart, TrendingUp, Eye, FileText,
} from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, news, scholarships, courses, products, jobs, donations] =
          await Promise.all([
            countDocuments(COLLECTIONS.users),
            countDocuments(COLLECTIONS.news),
            countDocuments(COLLECTIONS.scholarships),
            countDocuments(COLLECTIONS.courses),
            countDocuments(COLLECTIONS.products),
            countDocuments(COLLECTIONS.jobs),
            countDocuments(COLLECTIONS.donations).catch(() => 0),
          ]);

        setStats([
          { label: "Total Pengguna", value: users, icon: Users, color: "text-teal", bg: "bg-teal-surface" },
          { label: "Berita", value: news, icon: Newspaper, color: "text-cat-news", bg: "bg-sky-50" },
          { label: "Beasiswa", value: scholarships, icon: GraduationCap, color: "text-teal", bg: "bg-teal-surface" },
          { label: "Kursus", value: courses, icon: BookOpen, color: "text-cat-kursus", bg: "bg-indigo-50" },
          { label: "Produk", value: products, icon: ShoppingBag, color: "text-cat-ecommerce", bg: "bg-orange-50" },
          { label: "Lowongan", value: jobs, icon: Briefcase, color: "text-cat-job", bg: "bg-violet-50" },
          { label: "Donasi", value: donations, icon: Heart, color: "text-cat-donasi", bg: "bg-red-50" },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-teal-deep">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ringkasan data aplikasi Santri Mendunia
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-16 bg-muted rounded-lg" />
                </CardContent>
              </Card>
            ))
          : stats.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Tulis Berita Baru", desc: "Buat artikel untuk Santri News", href: "/admin/berita/buat", icon: FileText, color: "bg-cat-news" },
            { label: "Tambah Beasiswa", desc: "Daftarkan info beasiswa terbaru", href: "/admin/beasiswa/buat", icon: GraduationCap, color: "bg-teal" },
            { label: "Upload Produk", desc: "Tambah produk INKOPONTREN", href: "/admin/produk/buat", icon: ShoppingBag, color: "bg-cat-ecommerce" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-white hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-teal transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
