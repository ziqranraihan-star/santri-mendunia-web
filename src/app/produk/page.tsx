"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductItem { id: string; name: string; description: string; price: number; category: string; imageUrl: string; purchaseUrl: string; isActive: boolean; }

export default function ProductPublicPage() {
  const [data, setData] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<ProductItem>(COLLECTIONS.products, [orderBy("createdAt", "desc")]);
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
            <ShoppingBag className="w-8 h-8 text-[#F97316]" /> INKOPONTREN
          </h1>
          <p className="text-muted-foreground mt-1">Dukung kemandirian pesantren dengan membeli produk unggulan karya santri</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada produk yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  {s.category && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-[#F97316] hover:bg-white border-none shadow-sm backdrop-blur-sm capitalize text-[10px]">
                        {s.category}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold mb-1 line-clamp-2">{s.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.description}</p>
                  
                  <div className="mt-auto">
                    <div className="text-base font-bold text-[#F97316] mb-3">
                      Rp {s.price?.toLocaleString("id-ID")}
                    </div>
                    {s.purchaseUrl && (
                      <a href={s.purchaseUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button size="sm" className="w-full bg-[#F97316] hover:bg-[#EA580C] gap-1.5 text-xs">
                          Beli Produk <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
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
