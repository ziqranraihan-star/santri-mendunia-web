"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy, where } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { GraduationCap, Calendar, ExternalLink } from "lucide-react";

interface ScholarshipItem { id: string; title: string; description: string; provider: string; category: string; level: string; country: string; region: string; deadline: string; registration_url: string; benefits: string[]; is_active: boolean; }

export default function BeasiswaPublicPage() {
  const [data, setData] = useState<ScholarshipItem[]>([]); const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  useEffect(() => { (async () => { const items = await getDocuments<ScholarshipItem>(COLLECTIONS.scholarships, [orderBy("created_at", "desc")]); setData(items.filter((x: any) => x.is_active !== false)); setLoading(false); })(); }, []);
  const filtered = filter === "Semua" ? data : data.filter((s) => s.category?.includes(filter.toLowerCase().replace(" ", "_")));

  return (
    <><Navbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8"><h1 className="text-3xl font-bold text-teal-deep flex items-center gap-3"><GraduationCap className="w-8 h-8 text-teal" />Beasiswa</h1><p className="text-muted-foreground mt-1">Temukan beasiswa impianmu</p></div>
      <div className="flex flex-wrap gap-2 mb-8">
        {["Semua", "Dalam Negeri", "Luar Negeri"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-teal text-white" : "bg-muted text-muted-foreground"}`}>{f}</button>
        ))}
      </div>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}</div>
      : filtered.length === 0 ? <div className="text-center py-20 text-muted-foreground">Belum ada beasiswa.</div>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filtered.map((s) => {
          const dl = s.deadline;
          return (
            <div key={s.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow relative pb-16">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="capitalize text-xs">{s.category?.replace("_", " ")}</Badge>
                <Badge className="bg-teal-surface text-teal-deep uppercase text-xs">{s.level}</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{s.provider}{s.country ? ` • ${s.country}` : ""}</p>
              {s.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{s.description}</p>}
              {s.benefits && s.benefits.length > 0 && <div className="mb-4"><p className="text-xs font-semibold mb-1">Benefit:</p><ul className="text-xs text-muted-foreground space-y-0.5">{s.benefits.slice(0,3).map((b,i) => <li key={i}>✓ {b}</li>)}</ul></div>}
              <div className="flex items-center justify-between mb-4">
                {dl && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline: {(new Date(dl).toLocaleDateString("id-ID"))}</span>}
                {s.registration_url && <a href={s.registration_url} target="_blank" rel="noopener noreferrer"><Button size="sm" className="bg-teal hover:bg-teal-dark gap-1 text-xs"><ExternalLink className="w-3 h-3" /> Daftar</Button></a>}
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                 <div className="w-full text-center text-xs text-teal bg-teal/10 py-2 rounded-md font-medium">Buka Aplikasi Santri Mendunia untuk Info Lengkap</div>
              </div>
            </div>
          );
        })}</div>}
    </main><Footer /></>
  );
}
