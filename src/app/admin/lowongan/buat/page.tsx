"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";


export default function BuatLowonganPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", description: "", type: "kerja", location: "", isRemote: false, salary: "", applyUrl: "", applyWhatsapp: "", deadline: "", imageUrl: "", requirements: "" });
  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createDocument(COLLECTIONS.jobs, { ...form, deadline: form.deadline ? new Date(form.deadline) : null, requirements: (form.requirements as string).split("\n").filter(Boolean), isFeatured: false, isActive: true, viewCount: 0 });
      router.push("/admin/lowongan");
    } catch { alert("Gagal"); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/lowongan"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Tambah Lowongan</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Judul Posisi *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Perusahaan *</Label><Input value={form.company} onChange={(e) => set("company", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deskripsi *</Label><Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Tipe</Label><Select value={form.type} onValueChange={(v) => set("type", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="kerja">Kerja</SelectItem><SelectItem value="magang">Magang</SelectItem><SelectItem value="volunteer">Volunteer</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Lokasi</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
            <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isRemote} onChange={(e) => set("isRemote", e.target.checked)} /> Remote / WFH</label>
          <div className="space-y-2"><Label>Gaji</Label><Input value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="Rp 2-3 jt/bln" /></div>
          <div className="space-y-2"><Label>URL Apply</Label><Input value={form.applyUrl} onChange={(e) => set("applyUrl", e.target.value)} /></div>
          <div className="space-y-2"><Label>WhatsApp Apply</Label><Input value={form.applyWhatsapp} onChange={(e) => set("applyWhatsapp", e.target.value)} placeholder="6282298409860" /></div>
          <div className="space-y-2"><Label>Persyaratan (satu per baris)</Label><Textarea rows={4} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/lowongan"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
