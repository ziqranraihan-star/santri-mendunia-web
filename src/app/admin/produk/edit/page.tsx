"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getMutationErrorMessage } from "@/lib/supabase-error";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";
import { ProductImageUpload } from "@/components/admin/product-image-upload";

function EditProdukForm() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", category: "makanan", price: "0", stock: "0", weight: "", pesantrenName: "", imageUrl: "", purchaseUrl: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  useEffect(() => {
    if (!id) { router.push("/admin/produk"); return; }
    getDocument(COLLECTIONS.products, id).then((data: any) => {
      if (data) setForm({ name: data.name || "", description: data.description || "", category: data.category || "makanan", price: data.price?.toString() || "0", stock: data.stock?.toString() || "0", weight: data.weight?.toString() || "", pesantrenName: data.pesantrenName || "", imageUrl: data.imageUrl || "", purchaseUrl: data.purchaseUrl || "" });
      setInitialLoading(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!isValidExternalUrl(form.purchaseUrl)) {
      setSubmitError("URL pembelian/WhatsApp tidak valid. Gunakan tautan seperti https://wa.me/628123456789.");
      return;
    }
    setLoading(true);
    try {
      if (id) await updateDocument(COLLECTIONS.products, id, { name: form.name.trim(), description: form.description.trim(), category: form.category, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0, weight: form.weight ? parseFloat(form.weight) : null, pesantrenName: form.pesantrenName.trim(), imageUrl: form.imageUrl || null, purchaseUrl: normalizeExternalUrl(form.purchaseUrl) || null });
      router.push("/admin/produk");
    } catch (error) { setSubmitError(getMutationErrorMessage(error, "produk")); } finally { setLoading(false); }
  };
  if (initialLoading) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/produk"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Edit Produk</h1></div>
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
          <ProductImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} onError={setSubmitError} />
          <div className="space-y-2"><Label>URL Pembelian / WhatsApp</Label><Input type="url" placeholder="https://..." value={form.purchaseUrl} onChange={(e) => set("purchaseUrl", e.target.value)} /></div>
        </CardContent></Card>
        {submitError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>}
        <div className="flex justify-end gap-3"><Link href="/admin/produk"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}

export default function EditProdukPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}>
      <EditProdukForm />
    </Suspense>
  );
}
