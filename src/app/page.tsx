"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy, where } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  ArrowRight, GraduationCap, Newspaper, BookOpen,
  Heart, Sparkles, ChevronRight, Globe, Award,
  FileText, Compass, Briefcase, Plane, ShoppingBag, Smartphone
} from "lucide-react";

interface NewsItem { id: string; title: string; summary: string; category: string; imageUrl: string; authorName: string; publishedAt: string; viewCount: number; }
interface ScholarshipItem { id: string; title: string; provider: string; level: string; deadline: string; category: string; }
interface CourseItem { id: string; title: string; type: string; level: string; price: number; isFree: boolean; rating: number; thumbnailUrl: string; }

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [n, s, c] = await Promise.all([
          getDocuments<any>(COLLECTIONS.news, [orderBy("publishedAt", "desc")], 10),
          getDocuments<any>(COLLECTIONS.scholarships, [orderBy("createdAt", "desc")], 10),
          getDocuments<any>(COLLECTIONS.courses, [orderBy("createdAt", "desc")], 10),
        ]);
        setNews(n.filter((x: any) => x.isActive !== false).slice(0, 6));
        setScholarships(s.filter((x: any) => x.isActive !== false).slice(0, 4));
        setCourses(c.filter((x: any) => x.isActive !== false).slice(0, 4));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-deep via-teal-dark to-teal">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm text-white/90 font-medium">Dari Pesantren untuk Dunia</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Santri <span className="text-gold">Mendunia</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Platform edukasi, beasiswa, dan pemberdayaan santri Indonesia. 
                Bersama membangun generasi santri yang berwawasan global.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/app">
                  <Button size="lg" className="bg-white text-teal-deep hover:bg-gray-100 gap-2 font-bold shadow-lg">
                    <Smartphone className="w-4 h-4" /> Download Aplikasi
                  </Button>
                </Link>
                <Link href="/beasiswa">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                    <GraduationCap className="w-4 h-4" /> Cari Beasiswa
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Beasiswa Aktif", value: `${scholarships.length}+`, icon: GraduationCap, color: "text-teal" },
              { label: "Kursus Online", value: `${courses.length}+`, icon: BookOpen, color: "text-cat-kursus" },
              { label: "Berita & Artikel", value: `${news.length}+`, icon: Newspaper, color: "text-cat-news" },
              { label: "Pesantren Mitra", value: "50+", icon: Globe, color: "text-cat-mentoring" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Jelajah Kategori */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-teal-deep">Jelajah Kategori</h2>
            <p className="text-sm text-muted-foreground mt-2">Temukan berbagai layanan dan program unggulan kami</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Beasiswa", href: "/beasiswa", icon: GraduationCap, color: "text-[#2BA5AD]", bg: "bg-[#2BA5AD]/10" },
              { label: "Kursus", href: "/kursus", icon: BookOpen, color: "text-[#6366F1]", bg: "bg-[#6366F1]/10" },
              { label: "Pusat Pelatihan", href: "/tes", icon: Award, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
              { label: "Ruang Karya", href: "/ebook", icon: FileText, color: "text-[#F43F5E]", bg: "bg-[#F43F5E]/10" },
              { label: "Santri News", href: "/berita", icon: Newspaper, color: "text-[#0EA5E9]", bg: "bg-[#0EA5E9]/10" },
              { label: "Info Pesantren", href: "/mentor", icon: Compass, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
              { label: "Job & Magang", href: "/lowongan", icon: Briefcase, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
              { label: "Tour & Travel", href: "/trip", icon: Plane, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10" },
              { label: "INKOPONTREN", href: "/produk", icon: ShoppingBag, color: "text-[#F97316]", bg: "bg-[#F97316]/10" },
              { label: "Donasi", href: "/donasi", icon: Heart, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.label} href={cat.href} className="group flex flex-col items-center p-4 rounded-2xl border bg-white hover:shadow-md transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${cat.bg}`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-center text-gray-800 group-hover:text-teal transition-colors">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Latest News */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-teal-deep">Santri News</h2>
              <p className="text-sm text-muted-foreground mt-1">Berita terkini dari dunia santri</p>
            </div>
            <Link href="/berita" className="text-sm font-medium text-teal hover:underline flex items-center gap-1">
              Semua Berita <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Belum ada berita. Admin dapat menambahkan via panel.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.slice(0, 6).map((item, i) => (
                <Link key={item.id} href={`/berita/detail?id=${item.id}`} className={`group rounded-xl overflow-hidden border hover:shadow-lg transition-shadow ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                  <div className={`relative ${i === 0 ? "h-80" : "h-44"} bg-muted`}>
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-teal text-white text-xs capitalize">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className={`font-semibold group-hover:text-teal transition-colors line-clamp-2 ${i === 0 ? "text-xl" : "text-sm"}`}>{item.title}</h3>
                    {item.summary && i === 0 && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.summary}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{item.authorName} • {item.viewCount} views</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Scholarships */}
        <section className="bg-teal-surface/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-teal-deep">Beasiswa Terbaru</h2>
                <p className="text-sm text-muted-foreground mt-1">Jangan lewatkan kesempatan meraih beasiswa</p>
              </div>
              <Link href="/beasiswa" className="text-sm font-medium text-teal hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {scholarships.length === 0 && !loading ? (
              <div className="text-center py-12 text-muted-foreground">Belum ada beasiswa.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scholarships.map((s) => {
                  const dl = s.deadline;
                  return (
                    <div key={s.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                      <Badge variant="outline" className="capitalize text-xs mb-3">{s.category?.replace("_", " ")}</Badge>
                      <h3 className="font-semibold line-clamp-2 mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{s.provider}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge className="bg-teal-surface text-teal-deep uppercase">{s.level}</Badge>
                        {dl && <span className="text-muted-foreground">📅 {(new Date(dl).toLocaleDateString("id-ID"))}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Courses */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-teal-deep">Kursus Unggulan</h2>
              <p className="text-sm text-muted-foreground mt-1">Tingkatkan skill bersama para ahli</p>
            </div>
            <Link href="/kursus" className="text-sm font-medium text-teal hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {courses.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground">Belum ada kursus.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-muted">
                    {c.thumbnailUrl && <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize text-xs">{c.type?.replace("_", " ")}</Badge>
                      <Badge variant="outline" className="capitalize text-xs">{c.level}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{c.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal">{c.isFree ? "GRATIS" : `Rp ${c.price?.toLocaleString()}`}</span>
                      {c.rating > 0 && <span>⭐ {c.rating.toFixed(1)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Donation CTA */}
        <section className="bg-gradient-to-r from-gold-dark via-gold to-gold-light py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Heart className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Donasi untuk Kemajuan Santri</h2>
            <p className="text-white/80 mb-6">Setiap kontribusi Anda membantu santri meraih mimpinya.</p>
            <Link href="/donasi">
              <Button size="lg" className="bg-white text-gold-dark hover:bg-white/90 gap-2">
                <Heart className="w-4 h-4" /> Donasi Sekarang
              </Button>
            </Link>
          </div>
        </section>

        {/* Download App CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-teal-deep mb-3">Unduh Aplikasi Santri Mendunia</h2>
          <p className="text-muted-foreground mb-6">Akses semua fitur langsung dari smartphone Anda.</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-teal-deep hover:bg-teal-dark gap-2">
              <span>▶</span> Google Play
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <span>🍎</span> App Store
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
