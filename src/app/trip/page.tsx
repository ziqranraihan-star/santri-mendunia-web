"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripItem { id: string; title: string; destination: string; duration: string; price: number; description: string; imageUrl: string; startDate: any; registrationUrl: string; isActive: boolean; }

export default function TripPublicPage() {
  const [data, setData] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await getDocuments<TripItem>(COLLECTIONS.trips, [orderBy("createdAt", "desc")]);
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
            <Plane className="w-8 h-8 text-[#06B6D4]" /> Tour & Travel
          </h1>
          <p className="text-muted-foreground mt-1">Jelajahi dunia dengan paket perjalanan aman dan berkah</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada paket perjalanan yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((s) => {
              const start = s.startDate;
              return (
                <div key={s.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="h-48 bg-muted relative">
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Plane className="w-10 h-10 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-[#06B6D4] text-white hover:bg-[#0891B2] border-none">
                        Rp {s.price?.toLocaleString("id-ID")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      {s.destination && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#06B6D4]" /> {s.destination}
                        </div>
                      )}
                      {s.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#06B6D4]" /> {s.duration}
                        </div>
                      )}
                      {start && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center text-[#06B6D4] font-bold text-xs">GO</span> 
                          Berangkat: {(new Date(start).toLocaleDateString("id-ID"))}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{s.description}</p>
                    
                    <div className="mt-auto">
                      {s.registrationUrl && (
                        <a href={s.registrationUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <Button className="w-full bg-[#06B6D4] hover:bg-[#0891B2] gap-2">
                            Pesan Sekarang <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
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
