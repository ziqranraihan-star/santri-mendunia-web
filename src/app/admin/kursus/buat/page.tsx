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

export default function BuatKursusPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "bahasa", level: "pemula", language: "", price: "0", thumbnailUrl: "", tags: "", mentorId: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const price = parseFloat(form.price) || 0;
      await createDocument(COLLECTIONS.courses, {
        title: form.title,
        description: form.description,
        type: form.type,
        level: form.level,
        language: form.language,
        price,
        is_free: price === 0,
        thumbnail_url: form.thumbnailUrl,
        mentor_id: form.mentorId,
        total_lessons: 0,
        total_duration: 0,
        enrolled_count: 0,
        rating: 0,
        is_featured: false,
        is_active: true,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      router.push("/admin/kursus");
    } catch { alert("Gagal"); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/kursus"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Tambah Kursus</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Judul *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deskripsi *</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Tipe</Label><Select value={form.type} onValueChange={(v) => set("type", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bahasa">Bahasa</SelectItem><SelectItem value="soft_skill">Soft Skill</SelectItem><SelectItem value="kitab_kuning">Kitab Kuning</SelectItem><SelectItem value="digital">Digital</SelectItem><SelectItem value="wirausaha">Wirausaha</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Level</Label><Select value={form.level} onValueChange={(v) => set("level", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pemula">Pemula</SelectItem><SelectItem value="menengah">Menengah</SelectItem><SelectItem value="lanjutan">Lanjutan</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Harga (0=Gratis)</Label><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Bahasa</Label><Input value={form.language} onChange={(e) => set("language", e.target.value)} placeholder="Indonesia / Arab / Inggris" /></div>
          <div className="space-y-2"><Label>Thumbnail URL</Label><Input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} /></div>
          <div className="space-y-2"><Label>Tags (koma)</Label><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/kursus"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
