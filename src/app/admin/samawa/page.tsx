"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDocuments, updateDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, XCircle, Eye, RefreshCw } from "lucide-react";

export default function AdminSamawaPage() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("samawa_profiles")
        .select(`
          *,
          user:user_id (name, pesantren, phone_number, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleVerify = async (id: string, isApproved: boolean) => {
    const status = isApproved ? "verified" : "rejected";
    const confirmMsg = isApproved ? "Verifikasi profil ini?" : "Tolak profil ini?";
    if (!confirm(confirmMsg)) return;

    try {
      await updateDocument(COLLECTIONS.samawaProfiles, id, { status });
      alert(`Profil berhasil di-${status}.`);
      fetchProfiles();
    } catch (err) {
      alert("Gagal mengupdate status.");
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">Verifikasi Samawa Space</h1>
          <p className="text-sm text-muted-foreground">Kelola pendaftaran Biodata Barokah.</p>
        </div>
        <Button onClick={fetchProfiles} variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> Refresh</Button>
      </div>

      <div className="grid gap-6">
        {profiles.map(p => (
          <Card key={p.id} className="border-teal/10">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {p.user?.name} 
                    <Badge variant="outline" className={p.gender === "Ikhwan" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"}>{p.gender}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {p.user?.pesantren} • {p.user?.phone_number} • {p.user?.email}
                  </CardDescription>
                </div>
                <Badge variant={p.status === "verified" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>
                  {p.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Dokumen</span>
                  <div className="flex gap-2 mt-1">
                    <a href={p.ktp_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2"><Eye className="w-3 h-3" /> Cek KTP</Button>
                    </a>
                    <a href={p.recommendation_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2"><Eye className="w-3 h-3" /> Cek Rekomendasi</Button>
                    </a>
                  </div>
                </div>

                {p.status === "unverified" && (
                  <div className="flex gap-2 pt-4 border-t border-dashed">
                    <Button onClick={() => handleVerify(p.id, true)} className="flex-1 bg-teal text-white"><CheckCircle2 className="w-4 h-4 mr-2" /> Terima (Verifikasi)</Button>
                    <Button onClick={() => handleVerify(p.id, false)} variant="destructive" className="flex-1"><XCircle className="w-4 h-4 mr-2" /> Tolak</Button>
                  </div>
                )}
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div>
                  <span className="font-semibold text-teal-deep">Visi:</span> <p className="text-gray-600 italic">"{p.vision_mission}"</p>
                </div>
                <div>
                  <span className="font-semibold text-teal-deep">Amalan:</span> <p className="text-gray-600">{p.amalan_rutin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {profiles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border">Belum ada pendaftar Samawa Space.</div>
        )}
      </div>
    </div>
  );
}
