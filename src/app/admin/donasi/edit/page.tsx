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

function EditDonasiContent() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "Sosial", targetAmount: 0, isActive: true });
  useEffect(() => {
    if (!id) return router.push("/admin/donasi");
    getDocument(COLLECTIONS.donations, id).then((data: any) => {
      if (data) setForm({ title: data.title||"", category: data.category||"Sosial", targetAmount: data.targetAmount||0, isActive: data.isActive??true });
      setInitialLoading(false);
    });
  }, [id, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!id) return; setLoading(true);
    try { await updateDocument(COLLECTIONS.donations, id, { ...form, targetAmount: Number(form.targetAmount) }); router.push("/admin/donasi"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };
  if (initialLoading) return <div>Memuat...</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/donasi"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold">Edit Kampanye</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
            <div className="space-y-2"><Label>Judul Kampanye</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Kategori</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Sosial">Sosial & Keumatan</SelectItem><SelectItem value="Pendidikan">Pendidikan</SelectItem><SelectItem value="Kemanusiaan">Kemanusiaan</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Target Rupiah</Label><Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif</div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/donasi"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Update</Button></div>
      </form>
    </div>
  );
}
export default function EditDonasiPage() { return <Suspense><EditDonasiContent/></Suspense>; }
