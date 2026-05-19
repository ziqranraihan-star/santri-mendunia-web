"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { FileText, Download } from "lucide-react";

interface EbookItem { id: string; title: string; description: string; author: string; fileUrl: string; thumbnailUrl: string; isActive: boolean; }

export default function EbookPublicPage() {
  const [data, setData] = useState<EbookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<EbookItem>(COLLECTIONS.ebooks, [orderBy("createdAt", "desc")]);
        setData(items.filter((x: any) => x.isActive !== false));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-deep flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#F43F5E]" /> Ruang Karya
          </h1>
          <p className="text-muted-foreground mt-1">Koleksi E-book dan karya literasi inspiratif</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada karya yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.map((s) => (
              <a key={s.id} href={s.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[3/4] bg-muted relative">
                  {s.thumbnailUrl ? (
                    <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <FileText className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-teal flex items-center justify-center">
                      <Download className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold line-clamp-2 mb-1 group-hover:text-teal transition-colors">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-auto">{s.author || "Anonim"}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
