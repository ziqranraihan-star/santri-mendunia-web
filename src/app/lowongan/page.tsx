"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobItem { id: string; title: string; company: string; location: string; type: string; description: string; requirements: string; applyUrl: string; isActive: boolean; }

export default function JobPublicPage() {
  const [data, setData] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<JobItem>(COLLECTIONS.jobs, [orderBy("createdAt", "desc")]);
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
            <Briefcase className="w-8 h-8 text-[#8B5CF6]" /> Job & Magang
          </h1>
          <p className="text-muted-foreground mt-1">Temukan peluang karir dan magang terbaik untuk Santri</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada lowongan yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{s.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {s.company}</span>
                      {s.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {s.location}</span>}
                    </div>
                  </div>
                  <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 border-none capitalize">{s.type}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{s.description}</p>
                
                <div className="flex justify-end pt-4 border-t border-border/50">
                  {s.applyUrl && (
                    <a href={s.applyUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] gap-2">
                        Lamar Sekarang <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
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
