"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, GraduationCap } from "lucide-react";
import { normalizeExternalUrl } from "@/lib/external-url";
import { normalizeStringList } from "@/lib/string-list";

interface ScholarshipItem {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: string;
  level: string;
  country: string;
  region: string;
  deadline: string;
  registrationUrl: string;
  imageUrl: string;
  benefits: string[] | string | null;
  isActive: boolean;
}

export default function BeasiswaPublicPage() {
  const [data, setData] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Semua");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const items = await getDocuments<ScholarshipItem>(COLLECTIONS.scholarships, [orderBy("createdAt", "desc")]);
      setData(items.filter((item) => item.isActive !== false));
    } catch (e) {
      console.error(e);
      setError("Data beasiswa belum bisa dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = filter === "Semua"
    ? data
    : data.filter((s) => s.category?.includes(filter.toLowerCase().replace(" ", "_")));

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-deep flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-teal" />Beasiswa
          </h1>
          <p className="text-muted-foreground mt-1">Temukan beasiswa impianmu</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["Semua", "Dalam Negeri", "Luar Negeri"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-teal text-white" : "bg-muted text-muted-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium mb-4">{error}</p>
            <Button onClick={loadData} className="bg-teal hover:bg-teal-dark">Coba Lagi</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Belum ada beasiswa.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((s) => {
              const deadline = s.deadline;
              const benefits = normalizeStringList(s.benefits);
              const registrationUrl = normalizeExternalUrl(s.registrationUrl || "");
              return (
                <div key={s.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow relative">
                  {s.imageUrl && (
                    <div className="h-56 bg-muted">
                      <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 pb-20">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="capitalize text-xs">{s.category?.replace("_", " ")}</Badge>
                      <Badge className="bg-teal-surface text-teal-deep uppercase text-xs">{s.level}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{s.provider}{s.country ? ` - ${s.country}` : ""}</p>
                    {s.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{s.description}</p>}
                    {benefits.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold mb-1">Benefit:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {benefits.slice(0, 3).map((benefit, i) => <li key={i}>- {benefit}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4 gap-3">
                      {deadline && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Deadline: {new Date(deadline).toLocaleDateString("id-ID")}
                        </span>
                      )}
                      {registrationUrl && (
                        <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-teal hover:bg-teal-dark gap-1 text-xs">
                            <ExternalLink className="w-3 h-3" /> Daftar
                          </Button>
                        </a>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="w-full text-center text-xs text-teal bg-teal/10 py-2 rounded-md font-medium">Buka Aplikasi Santri Mendunia untuk Info Lengkap</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
