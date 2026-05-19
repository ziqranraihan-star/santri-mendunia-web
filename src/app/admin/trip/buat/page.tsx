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


export default function BuatTripPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", destination: "", duration: "", type: "Study banding", price: 0, isActive: true });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await createDocument(COLLECTIONS.trips, { ...form, price: Number(form.price), rating: 5.0, createdAt: new Date().toISOString() }); router.push("/admin/trip"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/trip"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold">Tambah Trip Baru</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
            <div className="space-y-2"><Label>Nama Trip</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Destinasi / Negara</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Durasi (Misal: 3 Hari 2 Malam)</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Tipe Trip</Label><Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v || "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Study banding">Study Banding</SelectItem><SelectItem value="Edu Trip">Edu Trip</SelectItem><SelectItem value="Ziarah Internasional">Ziarah Internasional</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Harga Paket (Rp)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} required /></div>
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif</div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/trip"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Simpan</Button></div>
      </form>
    </div>
  );
}
