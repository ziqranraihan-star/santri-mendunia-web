"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import Link from "next/link";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

function EditPesantrenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", category: "modern", location: "", websiteUrl: "", imageUrl: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!id) {
      router.push("/admin/pesantren");
      return;
    }

    getDocument(COLLECTIONS.pesantren, id)
      .then((data: any) => {
        if (data) {
          setForm({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "modern",
            location: data.location || "",
            websiteUrl: data.websiteUrl || "",
            imageUrl: data.imageUrl || "",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Gagal memuat data pesantren");
      })
      .finally(() => setInitialLoading(false));
  }, [id, router]);

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
    setLoading(true);
    try {
      if (id) {
        await updateDocument(COLLECTIONS.pesantren, id, {
          name: form.name,
          description: form.description,
          category: form.category,
          location: form.location,
          websiteUrl: form.websiteUrl,
          imageUrl: form.imageUrl,
        });
      }
      router.push("/admin/pesantren");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data pesantren");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/pesantren"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Edit Info Pesantren</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Nama Pesantren *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="modern">Modern</option><option value="salaf">Salaf (Tradisional)</option><option value="terpadu">Terpadu</option></select></div>
            <div className="space-y-2"><Label>Lokasi (Kota/Kabupaten)</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Deskripsi Singkat</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2"><Label>URL Website/Media Sosial</Label><Input type="url" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} /></div>
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
        <div className="flex justify-end gap-3"><Link href="/admin/pesantren"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading || uploading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}

export default function EditPesantrenPage() {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}><EditPesantrenForm /></Suspense>;
}
