"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NewsDetail { id: string; title: string; content: string; summary: string; category: string; imageUrl: string; authorName: string; publishedAt: string; viewCount: number; tags: string[]; }

export default function BeritaDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const item = await getDocument<NewsDetail>(COLLECTIONS.news, id);
      setNews(item);
      setLoading(false);
      // Increment view count
      if (item) {
        try { await updateDocument(COLLECTIONS.news, id, { viewCount: (item.viewCount || 0) + 1 }); } catch {}
      }
    })();
  }, [id]);

  if (loading) return (
    <><Navbar /><div className="max-w-3xl mx-auto px-4 py-20"><div className="space-y-4"><div className="h-8 bg-muted rounded animate-pulse w-3/4" /><div className="h-64 bg-muted rounded-xl animate-pulse" /><div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></div></div><Footer /></>
  );

  if (!news) return (
    <><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1><Link href="/berita"><Button variant="outline">Kembali ke Berita</Button></Link></div><Footer /></>
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

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">{news.authorName}</span>
          {publishDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {(new Date(publishDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}</span>}
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {news.viewCount} views</span>
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
          className="prose prose-lg max-w-none mb-8 leading-relaxed overflow-hidden break-words"
          dangerouslySetInnerHTML={{ __html: news.content?.replace(/&nbsp;/g, ' ') || '' }}
        />

        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
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
