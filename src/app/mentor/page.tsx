"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Compass, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MentorItem { id: string; name: string; institution: string; role: string; profileUrl: string; contactUrl: string; isActive: boolean; }

export default function MentorPublicPage() {
  const [data, setData] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<MentorItem>(COLLECTIONS.mentors, [orderBy("createdAt", "desc")]);
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
            <Compass className="w-8 h-8 text-[#10B981]" /> Info Pesantren & Mentor
          </h1>
          <p className="text-muted-foreground mt-1">Dapatkan panduan langsung dari para ahli dan pengasuh pesantren</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada data mentor yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden mb-4 border-4 border-teal/10">
                  {s.profileUrl ? (
                    <img src={s.profileUrl} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-bold bg-teal/5">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
                <Badge variant="secondary" className="mb-3 text-xs bg-teal/5 text-teal">{s.role}</Badge>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.institution}</p>
                <div className="mt-auto w-full">
                  {s.contactUrl && (
                    <a href={s.contactUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-[#10B981] hover:bg-[#059669] gap-2">
                        Hubungi <ExternalLink className="w-3 h-3" />
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
