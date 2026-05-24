"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy, where } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";


interface NewsItem { id: string; title: string; summary: string; category: string; image_url: string; author_name: string; published_at: string; view_count: number; is_active: boolean; }

const categories = ["Semua", "Terkini", "Motivasi", "Pendidikan", "Pesantren", "Inspiratif"];

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    (async () => {
      const items = await getDocuments<NewsItem>(COLLECTIONS.news, [orderBy("published_at", "desc")]);
      setNews(items.filter((i: any) => i.is_active !== false)); setLoading(false);
    })();
  }, []);

  const filtered = activeCategory === "Semua" ? news : news.filter((n) => n.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-deep">Santri News</h1>
          <p className="text-muted-foreground mt-1">Berita terkini dari dunia santri dan pesantren</p>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-teal text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {cat}
            </button>
          ))}
        </div>
        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Belum ada berita di kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const d = item.published_at;
              return (
                <Link key={item.id} href={`/berita/${item.id}`} className="group rounded-xl overflow-hidden border hover:shadow-lg transition-shadow bg-white relative pb-16">
                  <div className="h-44 bg-muted relative">
                    {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <Badge className="absolute top-3 left-3 bg-teal text-white text-xs capitalize">{item.category}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-teal transition-colors line-clamp-2 mb-2">{item.title}</h3>
                    {item.summary && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.summary}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{item.author_name}</span>
                      <span>{d ? (new Date(d).toLocaleDateString("id-ID")) : ""} • {item.view_count || 0} views</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
