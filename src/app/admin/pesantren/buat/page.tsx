"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";
import { getMutationErrorMessage } from "@/lib/supabase-error";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

export default function BuatPesantrenPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", category: "modern", location: "", websiteUrl: "", imageUrl: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `pesantren/${Date.now()}_${sanitizeFileName(file.name)}`;
      const { error } = await supabase.storage
        .from("public")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from("public").getPublicUrl(fileName);
      set("imageUrl", data.publicUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal upload gambar. Pastikan bucket public dan policy storage sudah aktif.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!isValidExternalUrl(form.websiteUrl)) {
      setSubmitError("URL Website/Media Sosial tidak valid. Gunakan alamat seperti https://instagram.com/namaakun.");
      return;
    }
    setLoading(true);
    try {
      await createDocument(COLLECTIONS.pesantren, {
        name: form.name,
        description: form.description,
        category: form.category,
        location: form.location,
        websiteUrl: normalizeExternalUrl(form.websiteUrl) || null,
        imageUrl: form.imageUrl,
        isFeatured: false,
        isActive: true,
        viewCount: 0,
      });
      router.push("/admin/pesantren");
    } catch (error) {
      console.error(error);
      setSubmitError(getMutationErrorMessage(error, "data pesantren"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/pesantren"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Tambah Info Pesantren</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Nama Pesantren *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="modern">Modern</option><option value="salaf">Salaf (Tradisional)</option><option value="terpadu">Terpadu</option></select></div>
            <div className="space-y-2"><Label>Lokasi (Kota/Kabupaten)</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Deskripsi Singkat</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Website/Media Sosial</Label><Input type="url" inputMode="url" placeholder="https://instagram.com/namaakun" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Gambar Utama Pesantren</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            {form.imageUrl ? (
              <div className="relative group">
                <img src={form.imageUrl} alt="Preview gambar pesantren" className="w-full h-56 object-cover rounded-lg border" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                  <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> Ganti
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={() => set("imageUrl", "")}>
                    <X className="w-4 h-4 mr-1" /> Hapus
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-300 hover:border-teal rounded-lg p-8 text-center transition-colors hover:bg-teal/5 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  {uploading ? <Upload className="w-6 h-6 text-teal animate-pulse" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-700">{uploading ? "Mengupload gambar..." : "Klik untuk upload gambar/pamflet"}</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP - Maks 5MB</p>
              </button>
            )}
          </div>
        </CardContent></Card>
        {submitError && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{submitError}</div>}
        <div className="flex justify-end gap-3"><Link href="/admin/pesantren"><Button type="button" variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading || uploading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}
