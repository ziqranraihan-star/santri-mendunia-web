"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { getDocuments, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Compass, ExternalLink, MapPin } from "lucide-react";

interface MentorItem {
  id: string;
  name: string;
  institution: string;
  role: string;
  profileUrl: string;
  contactUrl: string;
  isActive: boolean;
}

interface PesantrenItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  websiteUrl?: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function MentorPublicPage() {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [pesantren, setPesantren] = useState<PesantrenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [pesantrenItems, mentorItems] = await Promise.all([
        getDocuments<PesantrenItem>(COLLECTIONS.pesantren, [orderBy("createdAt", "desc")]),
        getDocuments<MentorItem>(COLLECTIONS.mentors, [orderBy("createdAt", "desc")]),
      ]);

      setPesantren(pesantrenItems.filter((item) => item.isActive !== false));
      setMentors(mentorItems.filter((item) => item.isActive !== false));
    } catch (e) {
      console.error(e);
      setError("Data pesantren dan mentor belum bisa dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium mb-4">{error}</p>
            <Button onClick={loadData} className="bg-teal hover:bg-teal-dark">Coba Lagi</Button>
          </div>
        ) : pesantren.length === 0 && mentors.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-medium">Belum ada data pesantren atau mentor yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {pesantren.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-teal" />
                  <h2 className="text-xl font-semibold text-teal-deep">Info Pesantren</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pesantren.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-muted">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-teal/5 text-teal">
                            <Building2 className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
                          {item.category && <Badge variant="outline" className="capitalize shrink-0">{item.category}</Badge>}
                        </div>
                        {item.location && (
                          <p className="text-sm text-muted-foreground flex gap-1.5 mb-3">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        )}
                        {item.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.description}</p>}
                        {item.websiteUrl && (
                          <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full gap-2">
                              Kunjungi Website <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-teal" />
                <h2 className="text-xl font-semibold text-teal-deep">Mentor</h2>
              </div>
              {mentors.length === 0 ? (
                <div className="text-center py-14 bg-muted/30 rounded-2xl border border-dashed">
                  <p className="text-muted-foreground font-medium">Belum ada data mentor yang tersedia.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {mentors.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 rounded-full bg-muted overflow-hidden mb-4 border-4 border-teal/10">
                        {item.profileUrl ? (
                          <img src={item.profileUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-bold bg-teal/5">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <Badge variant="secondary" className="mb-3 text-xs bg-teal/5 text-teal">{item.role}</Badge>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.institution}</p>
                      <div className="mt-auto w-full">
                        {item.contactUrl && (
                          <a href={item.contactUrl} target="_blank" rel="noopener noreferrer" className="w-full">
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
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
