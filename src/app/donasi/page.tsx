"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy, where } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface DonationItem { id: string; title: string; description: string; category: string; targetAmount: number; collectedAmount: number; imageUrl: string; isActive: boolean; }

export default function DonasiPublicPage() {
  const [data, setData] = useState<DonationItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<DonationItem>(COLLECTIONS.donations, [orderBy("createdAt", "desc")]); setData(items.filter((x: any) => x.isActive !== false)); setLoading(false); })(); }, []);

  return (
    <><Navbar /><main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10"><Heart className="w-10 h-10 text-cat-donasi mx-auto mb-3" /><h1 className="text-3xl font-bold text-teal-deep">Donasi</h1><p className="text-muted-foreground mt-1">Bantu santri meraih mimpinya</p></div>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div>
      : data.length === 0 ? <div className="text-center py-20 text-muted-foreground">Belum ada kampanye donasi aktif.</div>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{data.map((d) => {
          const pct = d.targetAmount > 0 ? Math.min(100, Math.round((d.collectedAmount / d.targetAmount) * 100)) : 0;
          return (
            <div key={d.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              {d.imageUrl && <div className="h-40 bg-muted"><img src={d.imageUrl} alt={d.title} className="w-full h-full object-cover" /></div>}
              <div className="p-5">
                <Badge variant="secondary" className="capitalize text-xs mb-2">{d.category}</Badge>
                <h3 className="text-lg font-semibold mb-2">{d.title}</h3>
                {d.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{d.description}</p>}
                <div className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="font-medium text-teal">Rp {d.collectedAmount?.toLocaleString()}</span><span className="text-muted-foreground">dari Rp {d.targetAmount?.toLocaleString()}</span></div>
                  <div className="w-full bg-muted rounded-full h-2"><div className="bg-teal rounded-full h-2 transition-all" style={{ width: `${pct}%` }} /></div>
                  <p className="text-xs text-muted-foreground mt-1">{pct}% terkumpul</p>
                </div>
                <Button className="w-full bg-cat-donasi hover:bg-red-600 gap-2"><Heart className="w-4 h-4" /> Donasi Sekarang</Button>
              </div>
            </div>
          );
        })}</div>}
    </main><Footer /></>
  );
}
