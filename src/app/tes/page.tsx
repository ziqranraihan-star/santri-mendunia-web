"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface TestItem { id: string; title: string; description: string; type: string; price: number; thumbnailUrl?: string; isActive: boolean; }

export default function TesPublicPage() {
  const [data, setData] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<TestItem>(COLLECTIONS.tests, [orderBy("createdAt", "desc")]);
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
            <Award className="w-8 h-8 text-[#F59E0B]" /> Pusat Pelatihan
          </h1>
          <p className="text-muted-foreground mt-1">Ikuti berbagai program pelatihan dan sertifikasi</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada program pelatihan yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-40 bg-muted relative">
                  {s.thumbnailUrl ? (
                    <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Award className="w-10 h-10 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-[#F59E0B] hover:bg-white border-none shadow-sm backdrop-blur-sm capitalize text-xs font-bold">
                      {s.type || "Umum"}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{s.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Investasi:</span>
                    {s.price === 0 ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">Gratis</Badge>
                    ) : (
                      <span className="text-sm font-bold text-[#F59E0B]">Rp {s.price?.toLocaleString("id-ID")}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
