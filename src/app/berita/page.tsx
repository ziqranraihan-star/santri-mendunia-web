"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getNewsHref } from "@/lib/news-slug";
import { AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  authorName: string;
  publishedAt: string;
  viewCount: number;
  isActive: boolean;
}

const categories = ["Semua", "Terkini", "Motivasi", "Pendidikan", "Pesantren", "Inspiratif"];

function getNewsErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/failed to fetch|network|fetch/i.test(message)) {
    return "Berita belum bisa dimuat karena koneksi ke server data bermasalah. Cek konfigurasi Supabase di Vercel lalu coba lagi.";
  }

  return "Berita belum bisa dimuat. Silakan coba lagi.";
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const items = await getDocuments<NewsItem>(COLLECTIONS.news, [
        orderBy("publishedAt", "desc"),
      ]);

      setNews(items.filter((item) => item.isActive !== false));
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNews([]);
      setError(getNewsErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const filtered =
    activeCategory === "Semua"
      ? news
      : news.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-deep">Santri News</h1>
          <p className="text-muted-foreground mt-1">Berita terkini dari dunia santri dan pesantren</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-teal text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <h2 className="font-semibold text-teal-deep mb-2">Santri News belum bisa dimuat</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">{error}</p>
            <Button type="button" variant="outline" className="gap-2" onClick={() => void loadNews()}>
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {news.length === 0 ? "Belum ada berita yang aktif." : "Belum ada berita di kategori ini."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const publishDate = item.publishedAt ? new Date(item.publishedAt) : null;

              return (
                <Link key={item.id} href={getNewsHref(item)} className="group rounded-xl overflow-hidden border hover:shadow-lg transition-shadow bg-white relative pb-16">
                  <div className="h-44 bg-muted relative">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <Badge className="absolute top-3 left-3 bg-teal text-white text-xs capitalize">{item.category}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-teal transition-colors line-clamp-2 mb-2">{item.title}</h3>
                    {item.summary && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.summary}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{item.authorName}</span>
                      <span>{publishDate ? publishDate.toLocaleDateString("id-ID") : ""}</span>
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
