"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function EditEbookContent() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ title: "", author: "", type: "Buku", category: "Pendidikan", isActive: true });
  useEffect(() => {
    if (!id) return router.push("/admin/ebook");
    getDocument(COLLECTIONS.ebooks, id).then((data: any) => {
      if (data) setForm({ title: data.title||"", author: data.author||"", type: data.type||"Buku", category: data.category||"Pendidikan", isActive: data.isActive??true });
      setInitialLoading(false);
    });
  }, [id, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!id) return; setLoading(true);
    try { await updateDocument(COLLECTIONS.ebooks, id, form); router.push("/admin/ebook"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };
  if (initialLoading) return <div>Memuat...</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/ebook"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold">Edit Ruang Karya</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
            <div className="space-y-2"><Label>Judul Karya</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Pencipta / Penulis</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tipe</Label><Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v || "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Buku">Buku</SelectItem><SelectItem value="Video">Video</SelectItem><SelectItem value="Audio">Audio</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Kategori</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif</div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/ebook"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Update</Button></div>
      </form>
    </div>
  );
}
export default function EditEbookPage() { return <Suspense><EditEbookContent /></Suspense>; }
