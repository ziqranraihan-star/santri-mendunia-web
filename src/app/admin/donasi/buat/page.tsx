"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";


export default function BuatDonasiPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Sosial", targetAmount: 0, isActive: true });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await createDocument(COLLECTIONS.donations, { ...form, targetAmount: Number(form.targetAmount), collectedAmount: 0, createdAt: new Date().toISOString() }); router.push("/admin/donasi"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/donasi"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold">Buat Kampanye Donasi</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
            <div className="space-y-2"><Label>Judul Kampanye</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Kategori</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Sosial">Sosial & Keumatan</SelectItem><SelectItem value="Pendidikan">Pendidikan</SelectItem><SelectItem value="Kemanusiaan">Kemanusiaan</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Target Rupiah</Label><Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif</div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/donasi"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Simpan</Button></div>
      </form>
    </div>
  );
}
