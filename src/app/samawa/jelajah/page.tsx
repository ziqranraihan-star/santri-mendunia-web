"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { supabase, createDocument, COLLECTIONS, getDocuments, where } from "@/lib/supabase/client";
import { ShieldAlert, Heart, ChevronRight, Loader2, Info } from "lucide-react";

export default function JelajahSamawaPage() {
  const router = useRouter();
  const { userData, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myProfile, setMyProfile] = useState<any>(null);
  
  // Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [vision, setVision] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        // Cek profil sendiri
        const myProfiles = await getDocuments(COLLECTIONS.samawaProfiles, [where("user_id", "eq", userData?.uid)]);
        if (myProfiles.length === 0 || myProfiles[0].status !== "verified") {
          setMyProfile(myProfiles.length > 0 ? myProfiles[0] : null);
          setLoading(false);
          return;
        }

        const mine = myProfiles[0];
        setMyProfile(mine);

        const oppositeGender = mine.gender === "Ikhwan" ? "Akhwat" : "Ikhwan";

        // Cek berapa request yang sudah dilakukan bulan ini
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Ambil kandidat dengan join tabel users
        const { data: candidates, error } = await supabase
          .from("samawa_profiles")
          .select(`
            *,
            user:user_id (
              name,
              pesantren
            )
          `)
          .eq("status", "verified")
          .eq("gender", oppositeGender);

        if (error) throw error;
        
        // Cek request yang sudah ada agar tidak menampilkan yang sudah diajukan
        const { data: existingRequests } = await supabase
          .from("taaruf_requests")
          .select("receiver_id")
          .eq("sender_id", userData?.uid);
          
        const requestedIds = existingRequests?.map(r => r.receiver_id) || [];
        
        // Filter kandidat yang belum pernah diajukan
        const availableCandidates = (candidates || []).filter(c => !requestedIds.includes(c.user_id));
        
        setProfiles(availableCandidates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userData]);

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleAjukan = async () => {
    if (!reason || !vision) {
      alert("Harap isi semua kolom niat dan visi.");
      return;
    }
    
    setSubmitting(true);
    try {
      const candidate = profiles[currentIndex];
      
      // Hitung request bulan ini (Max 3)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count } = await supabase
        .from("taaruf_requests")
        .select('*', { count: 'exact', head: true })
        .eq("sender_id", userData?.uid)
        .gte("created_at", startOfMonth.toISOString());
        
      if (count && count >= 3) {
        alert("Batas maksimal 3 pengajuan per bulan telah tercapai. Harap tunggu bulan depan atau maksimalkan ikhtiar pada pengajuan yang sedang berjalan.");
        setIsModalOpen(false);
        setSubmitting(false);
        return;
      }

      await createDocument(COLLECTIONS.taarufRequests, {
        senderId: userData?.uid,
        receiverId: candidate.user_id,
        status: "pending",
        reasonText: reason,
        visionText: vision
      });

      alert("Surat Lamaran Digital berhasil dikirim! Silakan pantau di Dashboard Lamaran.");
      setIsModalOpen(false);
      
      // Hapus profil dari daftar
      setProfiles(prev => prev.filter((_, i) => i !== currentIndex));
      // Reset currentIndex jika perlu, tapi karena elemennya dihapus, item di index saat ini akan berubah secara otomatis.
      // Kecuali jika itu adalah elemen terakhir, kita kurangi 1.
      if (currentIndex >= profiles.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pengajuan.");
    } finally {
      setSubmitting(false);
      setReason("");
      setVision("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-teal mb-4" />
        <h2 className="text-2xl font-bold text-teal-deep mb-2">Akses Terbatas</h2>
        <p className="text-muted-foreground mb-6">Silakan login untuk mengakses fitur ini.</p>
        <Button onClick={() => router.push("/login")} className="bg-teal">Login Sekarang</Button>
      </div>
    );
  }

  if (!myProfile || myProfile.status !== "verified") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center py-10 px-6">
            <Info className="w-16 h-16 text-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-teal-deep mb-2">Belum Diverifikasi</h2>
            <p className="text-muted-foreground mb-6">
              {myProfile 
                ? "Profil Anda sedang dalam tahap verifikasi oleh Tim Admin. Harap bersabar menunggu."
                : "Anda belum mengisi Biodata Barokah. Silakan lengkapi profil Anda terlebih dahulu."}
            </p>
            <Button onClick={() => router.push(myProfile ? "/samawa" : "/samawa/daftar")} className="w-full bg-teal">
              {myProfile ? "Kembali" : "Isi Biodata Sekarang"}
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const candidate = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 sm:px-6 flex flex-col items-center justify-center">
        
        <div className="w-full mb-8 text-center">
          <h1 className="text-3xl font-bold text-teal-deep mb-2">Jelajah Kandidat</h1>
          <p className="text-muted-foreground">Pelajari visi dan komitmen mereka secara saksama. (Batas 3 Pengajuan/Bulan)</p>
        </div>

        {profiles.length === 0 ? (
          <Card className="w-full text-center py-16 px-6 bg-white/50 border-dashed border-2">
            <Heart className="w-16 h-16 text-teal/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-teal-deep mb-2">Belum Ada Kandidat Tersedia</h2>
            <p className="text-muted-foreground">
              Belum ada kandidat {myProfile.gender === "Ikhwan" ? "Akhwat" : "Ikhwan"} baru yang sesuai atau belum pernah Anda ajukan. Perbanyak amal dan doa, jodoh terbaik datang di waktu yang Allah ridhai.
            </p>
          </Card>
        ) : (
          <div className="w-full space-y-6">
            <Card className="w-full bg-white shadow-xl border-teal/10 overflow-hidden">
              <div className="bg-teal-deep p-6 text-white text-center">
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{candidate.user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{candidate.user?.name}</h2>
                <p className="text-teal-50 opacity-90 text-sm">{candidate.user?.pesantren || "Santri Umum"}</p>
              </div>
              
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-teal uppercase tracking-wider mb-2">Visi Rumah Tangga</h3>
                  <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{candidate.vision_mission}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-teal uppercase tracking-wider mb-2">Kriteria Wajib</h3>
                  <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{candidate.criteria}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-teal uppercase tracking-wider mb-2">Amalan Rutin</h3>
                    <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{candidate.amalan_rutin}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-teal uppercase tracking-wider mb-2">Bekal Skill</h3>
                    <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{candidate.skill_bekal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="w-full sm:w-auto px-10 rounded-full bg-teal hover:bg-teal-dark shadow-lg shadow-teal/20 text-white font-bold">
                Ajukan Ta'aruf
              </Button>
              
              {currentIndex < profiles.length - 1 && (
                <Button onClick={handleNext} size="lg" variant="outline" className="w-full sm:w-auto px-10 rounded-full border-teal/20 text-teal-deep hover:bg-teal/5">
                  Lanjut ke Kandidat Berikutnya <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
            
            <p className="text-center text-xs text-muted-foreground pt-4">Kandidat {currentIndex + 1} dari {profiles.length}</p>
          </div>
        )}

      </div>
      <Footer />

      {/* Modal Ajukan Ta'aruf */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-deep text-xl">Surat Lamaran Digital</DialogTitle>
            <DialogDescription>
              Tuliskan alasan Anda memilih kandidat ini dan sampaikan visi singkat Anda untuk meyakinkan beliau.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alasan Memilih Kandidat <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Apa yang membuat Anda tertarik dengan profil kandidat ini?"
                rows={3}
                value={reason} onChange={e => setReason(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Visi Ta'aruf Anda <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Sampaikan keseriusan dan harapan Anda..."
                rows={3}
                value={vision} onChange={e => setVision(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button className="bg-teal text-white" onClick={handleAjukan} disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Pengajuan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
