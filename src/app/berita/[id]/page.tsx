"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Share2, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { normalizeExternalUrl } from "@/lib/external-url";

interface NewsDetail { id: string; title: string; content: string; summary: string; category: string; imageUrl: string; authorName: string; publishedAt: string; viewCount: number; tags: string[]; authors?: string[]; editors?: string[]; relatedLinks?: {title: string, url: string}[]; }

export default function BeritaDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        let item = null;
        const routeId = decodeURIComponent(id);
        // Cek apakah id adalah UUID (format lama) atau slug (format baru)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routeId)) {
          item = await getDocument<NewsDetail>(COLLECTIONS.news, routeId);
        } else {
          const { getDocuments, where } = await import("@/lib/supabase/client");
          const items = await getDocuments<NewsDetail>(COLLECTIONS.news, [
            where("slug", "eq", routeId)
          ]);
          item = items[0] || null;
        }

        setNews(item);
        if (item) {
          try { await updateDocument(COLLECTIONS.news, item.id, { viewCount: (item.viewCount || 0) + 1 }); } catch {}
        }
      } catch (loadError) {
        console.error("Failed to load news detail:", loadError);
        setError("Berita belum bisa dibuka karena koneksi ke server data bermasalah. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <><Navbar /><div className="max-w-3xl mx-auto px-4 py-20"><div className="space-y-4"><div className="h-8 bg-muted rounded animate-pulse w-3/4" /><div className="h-64 bg-muted rounded-xl animate-pulse" /><div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></div></div><Footer /></>
  );

  if (error || !news) return (
    <><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center">{error && <AlertCircle className="w-9 h-9 text-destructive mx-auto mb-3" />}<h1 className="text-2xl font-bold mb-4">{error || "Berita tidak ditemukan"}</h1><Link href="/berita"><Button variant="outline">Kembali ke Berita</Button></Link></div><Footer /></>
  );

  const publishDate = news.publishedAt ? new Date(news.publishedAt) : null;

  return (
    <>
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/berita" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-teal mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
        </Link>

        <Badge className="bg-teal text-white capitalize mb-4">{news.category}</Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-teal-deep leading-tight mb-4">{news.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {news.authors && news.authors.length > 0 ? (
            <span className="font-medium text-foreground">Oleh: {news.authors.join(", ")}</span>
          ) : (
            <span className="font-medium text-foreground">{news.authorName}</span>
          )}
          
          {news.editors && news.editors.length > 0 && (
            <span className="font-medium text-foreground bg-muted px-2 py-1 rounded-md text-xs">Editor: {news.editors.join(", ")}</span>
          )}

          {publishDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {(new Date(publishDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}</span>}
          {/* View Count has been hidden from public as requested */}
        </div>

        {news.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={news.imageUrl} alt={news.title} className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        {news.summary && (
          <p className="text-lg text-muted-foreground italic border-l-4 border-teal pl-4 mb-8">{news.summary}</p>
        )}

        <div 
          className="prose prose-lg max-w-none mb-8 leading-relaxed overflow-hidden break-words [&>p]:mb-4"
          dangerouslySetInnerHTML={{ __html: news.content?.replace(/&nbsp;/g, ' ') || '' }}
        />

        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
          </div>
        )}

        {news.relatedLinks && news.relatedLinks.length > 0 && (
          <div className="my-8 bg-teal-surface/30 p-6 rounded-xl border border-teal/10">
            <h3 className="font-bold text-teal-deep mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gold rounded-full"></span>
              Berita Terkait
            </h3>
            <ul className="space-y-3">
              {news.relatedLinks.map((link, i) => (
                <li key={i}>
                  <a href={normalizeExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal-dark hover:underline font-medium flex items-start gap-2">
                    <span className="text-gold mt-1">▪</span> {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t pt-6 flex justify-between items-center">
          <Link href="/berita"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Berita Lainnya</Button></Link>
          <Button variant="ghost" className="gap-2" onClick={() => { navigator.share?.({ title: news.title, url: window.location.href }).catch(() => {}); }}>
            <Share2 className="w-4 h-4" /> Bagikan
          </Button>
        </div>
      </article>
      <Footer />
    </>
  );
}
