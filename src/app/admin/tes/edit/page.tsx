"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function EditTesContent() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", type: "Bootcamp", price: "0", thumbnailUrl: "", totalQuestions: 0, duration: 0, isActive: true });

  useEffect(() => {
    if (!id) return router.push("/admin/tes");
    getDocument(COLLECTIONS.tests, id).then((data: any) => {
      if (data) setForm({ title: data.title||"", description: data.description||"", type: data.type||"Bootcamp", price: (data.price||0).toString(), thumbnailUrl: data.thumbnailUrl||"", totalQuestions: data.totalQuestions||0, duration: data.duration||0, isActive: data.isActive??true });
      setInitialLoading(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!id) return; setLoading(true);
    try { await updateDocument(COLLECTIONS.tests, id, { ...form, price: parseFloat(form.price)||0, totalQuestions: Number(form.totalQuestions), duration: Number(form.duration) }); router.push("/admin/tes"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };

  if (initialLoading) return <div>Memuat...</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/tes"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><div><h1 className="text-2xl font-bold">Edit Tes</h1></div></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle className="text-base">Informasi Tes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Judul Program</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Deskripsi Lengkap</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tipe / Kategori</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bootcamp">Bootcamp Scholarship</SelectItem>
                    <SelectItem value="Sertifikasi">Sertifikasi Profesi</SelectItem>
                    <SelectItem value="Kaderisasi">Kaderisasi Ulama</SelectItem>
                    <SelectItem value="Pelatihan">Pelatihan Bahasa</SelectItem>
                    <SelectItem value="TOEFL">Tes TOEFL</SelectItem>
                    <SelectItem value="TOAFL">Tes TOAFL</SelectItem>
                    <SelectItem value="IELTS">Tes IELTS</SelectItem>
                    <SelectItem value="Umum">Tes Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Harga (0=Gratis)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            </div>
            
            <div className="space-y-2"><Label>Thumbnail URL</Label><Input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="URL Gambar Header" /></div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-4">
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Durasi Ujian (Menit) - Opsional</Label><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} /></div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Total Soal - Opsional</Label><Input type="number" value={form.totalQuestions} onChange={(e) => setForm({ ...form, totalQuestions: parseInt(e.target.value) || 0 })} /></div>
            </div>
            
            <div className="flex items-center gap-2 pt-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif dipublikasi</div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3"><Link href="/admin/tes"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Update</Button></div>
      </form>
    </div>
  );
}
export default function EditTesPage() { return <Suspense><EditTesContent /></Suspense>; }
