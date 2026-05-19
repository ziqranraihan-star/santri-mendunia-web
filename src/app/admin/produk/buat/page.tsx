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

export default function BuatProdukPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "makanan", price: "0", stock: "0", weight: "", pesantrenName: "", imageUrls: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createDocument(COLLECTIONS.products, { name: form.name, description: form.description, category: form.category, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0, weight: form.weight ? parseFloat(form.weight) : null, pesantrenName: form.pesantrenName, sellerId: "", imageUrls: form.imageUrls.split("\n").filter(Boolean), isFeatured: false, isActive: true, soldCount: 0, rating: 0 });
      router.push("/admin/produk");
    } catch { alert("Gagal"); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/produk"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Tambah Produk</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Nama Produk *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deskripsi *</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Nama Pesantren *</Label><Input value={form.pesantrenName} onChange={(e) => set("pesantrenName", e.target.value)} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><Select value={form.category} onValueChange={(v) => set("category", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="makanan">Makanan</SelectItem><SelectItem value="kerajinan">Kerajinan</SelectItem><SelectItem value="fashion">Fashion</SelectItem><SelectItem value="herbal">Herbal</SelectItem><SelectItem value="lainnya">Lainnya</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Harga (Rp) *</Label><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Stok</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Berat (gram)</Label><Input type="number" value={form.weight} onChange={(e) => set("weight", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Gambar (satu per baris)</Label><Textarea rows={3} value={form.imageUrls} onChange={(e) => set("imageUrls", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/produk"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
