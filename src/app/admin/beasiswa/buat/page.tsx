"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";


export default function BuatBeasiswaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", provider: "", category: "dalam_negeri", level: "s1", region: "", country: "", registrationUrl: "", deadline: "", imageUrl: "", benefits: "", requirements: "", documents: "", tips: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createDocument(COLLECTIONS.scholarships, { title: form.title, description: form.description, provider: form.provider, category: form.category, level: form.level, region: form.region, country: form.country, registrationUrl: form.registrationUrl, imageUrl: form.imageUrl, tips: form.tips, deadline: new Date(form.deadline), benefits: form.benefits.split("\n").filter(Boolean), requirements: form.requirements.split("\n").filter(Boolean), documents: form.documents.split("\n").filter(Boolean), isFeatured: false, isActive: true, viewCount: 0 });
      router.push("/admin/beasiswa");
    } catch { alert("Gagal menyimpan"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/beasiswa"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div><h1 className="text-2xl font-bold text-teal-deep">Tambah Beasiswa</h1></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle className="text-base">Informasi Utama</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><Label>Judul *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Provider *</Label><Input value={form.provider} onChange={(e) => set("provider", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deskripsi *</Label><Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><Select value={form.category} onValueChange={(v) => set("category", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dalam_negeri">Dalam Negeri</SelectItem><SelectItem value="luar_negeri">Luar Negeri</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Jenjang</Label><Select value={form.level} onValueChange={(v) => set("level", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="s1">S1</SelectItem><SelectItem value="s2">S2</SelectItem><SelectItem value="s3">S3</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Deadline *</Label><Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Negara</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
            <div className="space-y-2"><Label>Region</Label><Input value={form.region} onChange={(e) => set("region", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>URL Pendaftaran</Label><Input value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Gambar</Label><Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Detail (satu per baris)</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><Label>Benefit</Label><Textarea rows={3} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} /></div>
          <div className="space-y-2"><Label>Persyaratan</Label><Textarea rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} /></div>
          <div className="space-y-2"><Label>Dokumen</Label><Textarea rows={3} value={form.documents} onChange={(e) => set("documents", e.target.value)} /></div>
          <div className="space-y-2"><Label>Tips</Label><Textarea rows={2} value={form.tips} onChange={(e) => set("tips", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/beasiswa"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
