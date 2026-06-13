"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function BuatPesantrenPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "modern", location: "", websiteUrl: "", imageUrl: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createDocument(COLLECTIONS.pesantren, { name: form.name, description: form.description, category: form.category, location: form.location, websiteUrl: form.websiteUrl, imageUrl: form.imageUrl, isFeatured: false, isActive: true, viewCount: 0 });
      router.push("/admin/pesantren");
    } catch { alert("Gagal menyimpan data pesantren"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/pesantren"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Tambah Info Pesantren</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Nama Pesantren *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="modern">Modern</option><option value="salaf">Salaf (Tradisional)</option><option value="terpadu">Terpadu</option></select></div>
            <div className="space-y-2"><Label>Lokasi (Kota/Kabupaten)</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Deskripsi Singkat</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Website/Media Sosial</Label><Input type="url" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Gambar Utama</Label><Input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/pesantren"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
