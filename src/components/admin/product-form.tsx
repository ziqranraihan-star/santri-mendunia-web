"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";
import { LEGALITY_OPTIONS, PRODUCT_CATEGORIES, ProductRecord, ProductVariant } from "@/lib/product";

export interface ProductFormValue {
  name: string;
  description: string;
  category: string;
  pesantrenName: string;
  stock: string;
  weight: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  basePrice: string;
  platformMargin: string;
  originalPrice: string;
  imageUrls: string[];
  purchaseUrl: string;
  legalities: string[];
  legalityNumber: string;
  isSantriMade: boolean;
  variants: Array<{ name: string; price: string; stock: string }>;
}

export const EMPTY_PRODUCT_FORM: ProductFormValue = {
  name: "",
  description: "",
  category: "makanan",
  pesantrenName: "",
  stock: "0",
  weight: "",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  basePrice: "0",
  platformMargin: "0",
  originalPrice: "",
  imageUrls: [],
  purchaseUrl: "",
  legalities: [],
  legalityNumber: "",
  isSantriMade: true,
  variants: [],
};

export function productToForm(product: Partial<ProductRecord>): ProductFormValue {
  const basePrice = product.basePrice ?? product.price ?? 0;
  return {
    ...EMPTY_PRODUCT_FORM,
    name: product.name || "",
    description: product.description || "",
    category: product.category || "makanan",
    pesantrenName: product.pesantrenName || "",
    stock: String(product.stock ?? 0),
    weight: product.weight == null ? "" : String(product.weight),
    lengthCm: product.lengthCm == null ? "" : String(product.lengthCm),
    widthCm: product.widthCm == null ? "" : String(product.widthCm),
    heightCm: product.heightCm == null ? "" : String(product.heightCm),
    basePrice: String(basePrice),
    platformMargin: String(product.platformMargin ?? Math.max(0, (product.price || 0) - basePrice)),
    originalPrice: product.originalPrice == null ? "" : String(product.originalPrice),
    imageUrls: product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [],
    purchaseUrl: product.purchaseUrl || "",
    legalities: product.legalities || [],
    legalityNumber: product.legalityNumber || "",
    isSantriMade: product.isSantriMade !== false,
    variants: (product.variants || []).map((variant) => ({
      name: variant.name,
      price: String(variant.price),
      stock: String(variant.stock),
    })),
  };
}

export function productFormPayload(form: ProductFormValue): Omit<ProductRecord, "id"> {
  const basePrice = Number(form.basePrice) || 0;
  const platformMargin = Number(form.platformMargin) || 0;
  const imageUrls = form.imageUrls.slice(0, 5);
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    pesantrenName: form.pesantrenName.trim(),
    stock: Number.parseInt(form.stock) || 0,
    weight: form.weight ? Number(form.weight) : null,
    lengthCm: form.lengthCm ? Number(form.lengthCm) : null,
    widthCm: form.widthCm ? Number(form.widthCm) : null,
    heightCm: form.heightCm ? Number(form.heightCm) : null,
    basePrice,
    platformMargin,
    price: basePrice + platformMargin,
    originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
    imageUrls,
    imageUrl: imageUrls[0] || undefined,
    purchaseUrl: normalizeExternalUrl(form.purchaseUrl) || undefined,
    legalities: form.legalities,
    legalityNumber: form.legalityNumber.trim(),
    isSantriMade: form.isSantriMade,
    variants: form.variants
      .filter((variant) => variant.name.trim())
      .map<ProductVariant>((variant) => ({
        name: variant.name.trim(),
        price: Number(variant.price) || basePrice + platformMargin,
        stock: Number.parseInt(variant.stock) || 0,
      })),
  };
}

interface ProductFormProps {
  initialValue?: ProductFormValue;
  submitLabel?: string;
  onSubmit: (payload: Omit<ProductRecord, "id">) => Promise<void>;
}

export function ProductForm({ initialValue = EMPTY_PRODUCT_FORM, submitLabel = "Simpan", onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValue>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sellingPrice = useMemo(() => (Number(form.basePrice) || 0) + (Number(form.platformMargin) || 0), [form.basePrice, form.platformMargin]);
  const set = <K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) => setForm((previous) => ({ ...previous, [key]: value }));

  const toggleLegality = (value: string) => {
    set("legalities", form.legalities.includes(value) ? form.legalities.filter((item) => item !== value) : [...form.legalities, value]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.imageUrls.length) return setError("Minimal satu foto produk wajib diunggah.");
    if (!isValidExternalUrl(form.purchaseUrl)) return setError("URL WhatsApp tidak valid. Gunakan tautan seperti https://wa.me/628123456789.");
    if (form.legalities.length && !form.legalityNumber.trim()) return setError("Nomor sertifikasi/izin edar wajib diisi ketika legalitas dipilih.");
    if (form.originalPrice && Number(form.originalPrice) <= sellingPrice) return setError("Harga coret harus lebih besar daripada harga jual.");
    setLoading(true);
    try {
      await onSubmit(productFormPayload(form));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Produk gagal disimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Informasi Dasar Produk</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Nama Produk *</Label><Input value={form.name} onChange={(event) => set("name", event.target.value)} required /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Kategori Produk *</Label><Select value={form.category} onValueChange={(value) => set("category", value || "makanan")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRODUCT_CATEGORIES.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Nama Pesantren *</Label><Input value={form.pesantrenName} onChange={(event) => set("pesantrenName", event.target.value)} required /></div>
          </div>
          <div className="space-y-2"><Label>Deskripsi Produk *</Label><Textarea rows={4} value={form.description} onChange={(event) => set("description", event.target.value)} required /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Spesifikasi & Logistik</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2"><Label>Berat Bersih (gram)</Label><Input type="number" min="0" value={form.weight} onChange={(event) => set("weight", event.target.value)} /></div>
          <div className="space-y-2"><Label>Panjang (cm)</Label><Input type="number" min="0" value={form.lengthCm} onChange={(event) => set("lengthCm", event.target.value)} /></div>
          <div className="space-y-2"><Label>Lebar (cm)</Label><Input type="number" min="0" value={form.widthCm} onChange={(event) => set("widthCm", event.target.value)} /></div>
          <div className="space-y-2"><Label>Tinggi (cm)</Label><Input type="number" min="0" value={form.heightCm} onChange={(event) => set("heightCm", event.target.value)} /></div>
          <div className="space-y-2"><Label>Stok Awal *</Label><Input type="number" min="0" value={form.stock} onChange={(event) => set("stock", event.target.value)} required /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Media Produk</CardTitle></CardHeader>
        <CardContent><ProductImageUpload value={form.imageUrls} onChange={(value) => set("imageUrls", value)} onError={setError} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Harga & Penjualan (Internal)</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2"><Label>Harga Net Pesantren (Rp) *</Label><Input type="number" min="0" value={form.basePrice} onChange={(event) => set("basePrice", event.target.value)} required /></div>
          <div className="space-y-2"><Label>Margin Platform (Rp)</Label><Input type="number" min="0" value={form.platformMargin} onChange={(event) => set("platformMargin", event.target.value)} /></div>
          <div className="space-y-2"><Label>Harga Jual Aplikasi (Rp)</Label><Input value={sellingPrice.toLocaleString("id-ID")} readOnly className="bg-muted" /><p className="text-xs text-muted-foreground">Dihitung otomatis.</p></div>
          <div className="space-y-2"><Label>Harga Coret (Rp)</Label><Input type="number" min="0" value={form.originalPrice} onChange={(event) => set("originalPrice", event.target.value)} placeholder="Opsional" /><p className="text-xs text-muted-foreground">Harus lebih besar daripada harga jual.</p></div>
          <div className="space-y-2 md:col-span-2"><Label>URL WhatsApp Business *</Label><Input type="url" inputMode="url" value={form.purchaseUrl} onChange={(event) => set("purchaseUrl", event.target.value)} placeholder="https://wa.me/628123456789" required /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Legalitas & Sertifikasi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {LEGALITY_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.legalities.includes(value)} onChange={() => toggleLegality(value)} /> {label}</label>
            ))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSantriMade} onChange={(event) => set("isSantriMade", event.target.checked)} /> 100% Karya Santri</label>
          </div>
          <div className="space-y-2"><Label>Nomor Sertifikasi / Izin Edar {form.legalities.length ? "*" : "(opsional)"}</Label><Input value={form.legalityNumber} onChange={(event) => set("legalityNumber", event.target.value)} required={form.legalities.length > 0} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between"><CardTitle>Varian Rasa / Ukuran</CardTitle><Button type="button" size="sm" variant="outline" onClick={() => set("variants", [...form.variants, { name: "", price: String(sellingPrice), stock: "0" }])}><Plus className="mr-1 h-4 w-4" /> Tambah Varian</Button></CardHeader>
        <CardContent className="space-y-3">
          {!form.variants.length && <p className="text-sm text-muted-foreground">Tidak ada varian. Tambahkan jika produk memiliki rasa atau ukuran berbeda.</p>}
          {form.variants.map((variant, index) => (
            <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <Input aria-label={`Nama varian ${index + 1}`} placeholder="Contoh: Pedas 250 g" value={variant.name} onChange={(event) => set("variants", form.variants.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
              <Input aria-label={`Harga varian ${index + 1}`} type="number" min="0" placeholder="Harga" value={variant.price} onChange={(event) => set("variants", form.variants.map((item, itemIndex) => itemIndex === index ? { ...item, price: event.target.value } : item))} />
              <Input aria-label={`Stok varian ${index + 1}`} type="number" min="0" placeholder="Stok" value={variant.stock} onChange={(event) => set("variants", form.variants.map((item, itemIndex) => itemIndex === index ? { ...item, stock: event.target.value } : item))} />
              <Button type="button" size="icon" variant="destructive" onClick={() => set("variants", form.variants.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="flex justify-end"><Button type="submit" className="gap-2 bg-teal hover:bg-teal-dark" disabled={loading}><Save className="h-4 w-4" />{loading ? "Menyimpan..." : submitLabel}</Button></div>
    </form>
  );
}
