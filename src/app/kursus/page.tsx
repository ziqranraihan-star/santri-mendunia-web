"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy, where } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface CourseItem { id: string; title: string; description: string; type: string; level: string; price: number; isFree: boolean; rating: number; thumbnailUrl: string; enrolledCount: number; }

export default function KursusPublicPage() {
  const [data, setData] = useState<CourseItem[]>([]); const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  useEffect(() => { (async () => { const items = await getDocuments<CourseItem>(COLLECTIONS.courses, [orderBy("createdAt", "desc")]); setData(items.filter((x: any) => x.isActive !== false)); setLoading(false); })(); }, []);
  const filtered = filter === "Semua" ? data : data.filter((c) => c.type === filter.toLowerCase().replace(" ", "_"));

  return (
    <><Navbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8"><h1 className="text-3xl font-bold text-teal-deep flex items-center gap-3"><BookOpen className="w-8 h-8 text-cat-kursus" />Kursus</h1><p className="text-muted-foreground mt-1">Pelajari skill baru bersama para ahli</p></div>
      <div className="flex flex-wrap gap-2 mb-8">
        {["Semua", "Bahasa", "Soft Skill", "Kitab Kuning", "Digital", "Wirausaha"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-cat-kursus text-white" : "bg-muted text-muted-foreground"}`}>{f}</button>
        ))}
      </div>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div>
      : filtered.length === 0 ? <div className="text-center py-20 text-muted-foreground">Belum ada kursus.</div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-36 bg-muted">{c.thumbnailUrl && <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover" />}</div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2"><Badge variant="secondary" className="capitalize text-xs">{c.type?.replace("_", " ")}</Badge><Badge variant="outline" className="capitalize text-xs">{c.level}</Badge></div>
              <h3 className="font-semibold line-clamp-2 mb-2">{c.title}</h3>
              {c.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>}
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-cat-kursus">{c.isFree ? "GRATIS" : `Rp ${c.price?.toLocaleString()}`}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">{c.rating > 0 && <span>⭐ {c.rating.toFixed(1)}</span>}<span>{c.enrolledCount || 0} peserta</span></div>
              </div>
            </div>
          </div>
        ))}</div>}
    </main><Footer /></>
  );
}
