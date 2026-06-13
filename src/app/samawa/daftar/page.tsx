"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { createDocument, getDocuments, where, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { ShieldAlert, Upload, CheckCircle2 } from "lucide-react";

export default function DaftarSamawaPage() {
  const router = useRouter();
  const { userData, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Upload States
  const [uploadingKtp, setUploadingKtp] = useState(false);
  const [uploadingRec, setUploadingRec] = useState(false);
  const ktpRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    gender: "",
    ktpUrl: "",
    recommendationUrl: "",
    visionMission: "",
    criteria: "",
    amalanRutin: "",
    skillBekal: ""
  });

  const handleFileUpload = async (file: File, type: "ktp" | "rec") => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    if (type === "ktp") setUploadingKtp(true);
    else setUploadingRec(true);

    const fileName = `samawa/${Date.now()}_${type}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage
      .from('public')
      .upload(fileName, file, { upsert: false });

    if (error) {
      alert("Gagal mengupload dokumen");
      if (type === "ktp") setUploadingKtp(false);
      else setUploadingRec(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('public').getPublicUrl(fileName);
    
    if (type === "ktp") {
      setForm(p => ({ ...p, ktpUrl: publicUrlData.publicUrl }));
      setUploadingKtp(false);
    } else {
      setForm(p => ({ ...p, recommendationUrl: publicUrlData.publicUrl }));
      setUploadingRec(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    if (!form.ktpUrl || !form.recommendationUrl) {
      alert("Harap upload KTP dan Surat Rekomendasi terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      // Check if already registered
      const existing = await getDocuments(COLLECTIONS.samawaProfiles, [where("user_id", "eq", userData.uid)]);
      if (existing.length > 0) {
        alert("Anda sudah pernah mendaftar di Samawa Space.");
        setLoading(false);
        return;
      }

      await createDocument(COLLECTIONS.samawaProfiles, {
        userId: userData.uid,
        gender: form.gender,
        ktpUrl: form.ktpUrl,
        recommendationUrl: form.recommendationUrl,
        visionMission: form.visionMission,
        criteria: form.criteria,
        amalanRutin: form.amalanRutin,
        skillBekal: form.skillBekal,
        status: "unverified"
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-teal mb-4" />
        <h2 className="text-2xl font-bold text-teal-deep mb-2">Akses Terbatas</h2>
        <p className="text-muted-foreground mb-6">Anda harus login untuk mengakses Samawa Space.</p>
        <Button onClick={() => router.push("/login")} className="bg-teal text-white">Login Sekarang</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center py-10 px-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-teal-deep mb-2">Alhamdulillah, Biodata Diterima</h2>
            <p className="text-muted-foreground mb-6">
              Profil Anda sedang dalam tahap verifikasi oleh Tim Admin / Musyrif. Mohon perbanyak doa agar prosesnya dilancarkan. Anda akan bisa mengakses fitur Jelajah setelah diverifikasi.
            </p>
            <Button onClick={() => router.push("/samawa")} variant="outline" className="w-full">Kembali ke Beranda Samawa</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-24 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-teal-deep mb-3">Biodata Barokah</h1>
          <p className="text-muted-foreground">Isi profil Anda dengan niat yang jujur dan tulus demi membangun ikhtiar yang diridhai-Nya.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gerbang Samawa: Verifikasi Dokumen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-deep">Gerbang Samawa (Verifikasi)</CardTitle>
              <CardDescription>Dokumen ini rahasia, hanya digunakan oleh admin untuk memastikan keamanan lingkungan Samawa Space.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Jenis Kelamin (Ikhwan / Akhwat) <span className="text-red-500">*</span></Label>
                <Select value={form.gender} onValueChange={(v) => setForm({...form, gender: v})} required>
                  <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ikhwan">Ikhwan (Laki-laki)</SelectItem>
                    <SelectItem value="Akhwat">Akhwat (Perempuan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>KTP Asli <span className="text-red-500">*</span></Label>
                  <input type="file" ref={ktpRef} className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "ktp")} />
                  {form.ktpUrl ? (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> KTP Berhasil Diupload
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full gap-2" onClick={() => ktpRef.current?.click()} disabled={uploadingKtp}>
                      <Upload className="w-4 h-4" /> {uploadingKtp ? "Mengupload..." : "Upload KTP"}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Format JPG/PNG/PDF maks 2MB.</p>
                </div>

                <div className="space-y-2">
                  <Label>Surat Rekomendasi Ustadz/Kiai <span className="text-red-500">*</span></Label>
                  <input type="file" ref={recRef} className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "rec")} />
                  {form.recommendationUrl ? (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Surat Berhasil Diupload
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full gap-2" onClick={() => recRef.current?.click()} disabled={uploadingRec}>
                      <Upload className="w-4 h-4" /> {uploadingRec ? "Mengupload..." : "Upload Surat"}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Format JPG/PNG/PDF maks 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Isi Biodata Barokah */}
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-deep">Profil & Karakter</CardTitle>
              <CardDescription>Jelaskan kepribadian, visi, dan amalan Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Visi Rumah Tangga <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Ceritakan gambaran keluarga seperti apa yang ingin Anda bangun bersama kelak..." 
                  rows={4} required 
                  value={form.visionMission} onChange={e => setForm({...form, visionMission: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label>3 Kriteria Wajib Pasangan <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Sebutkan 3 sifat atau kriteria mutlak yang harus dimiliki calon pasangan Anda..." 
                  rows={3} required 
                  value={form.criteria} onChange={e => setForm({...form, criteria: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label>Amalan Rutin / Ibadah Harian <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Misal: Tilawah 1 juz sehari, Sholat Dhuha, Hafalan Qur'an 5 Juz, dll." 
                  rows={3} required 
                  value={form.amalanRutin} onChange={e => setForm({...form, amalanRutin: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label>Skill & Bekal Nikah <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Bakat atau persiapan yang sudah Anda miliki (misal: bisa memasak, mengelola keuangan, ilmu parenting Islami)." 
                  rows={3} required 
                  value={form.skillBekal} onChange={e => setForm({...form, skillBekal: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-teal hover:bg-teal-dark text-white text-lg py-6 rounded-xl shadow-lg" disabled={loading || uploadingKtp || uploadingRec}>
            {loading ? "Menyimpan Biodata..." : "Kirim Biodata Barokah"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
