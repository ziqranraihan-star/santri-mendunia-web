"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function EditPesantrenForm() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", category: "modern", location: "", websiteUrl: "", imageUrl: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  
  useEffect(() => {
    if (!id) { router.push("/admin/pesantren"); return; }
    getDocument(COLLECTIONS.pesantren, id).then((data: any) => {
      if (data) setForm({ name: data.name || "", description: data.description || "", category: data.category || "modern", location: data.location || "", websiteUrl: data.websiteUrl || "", imageUrl: data.imageUrl || "" });
      setInitialLoading(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (id) await updateDocument(COLLECTIONS.pesantren, id, { name: form.name, description: form.description, category: form.category, location: form.location, websiteUrl: form.websiteUrl, imageUrl: form.imageUrl });
      router.push("/admin/pesantren");
    } catch { alert("Gagal menyimpan data pesantren"); } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/pesantren"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Edit Info Pesantren</h1></div>
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

export default function EditPesantrenPage() {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}><EditPesantrenForm /></Suspense>;
}
