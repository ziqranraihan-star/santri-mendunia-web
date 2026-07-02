"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import Link from "next/link";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

function listToText(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function EditBeasiswaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", provider: "", category: "dalam_negeri", level: "s1", region: "", country: "", registrationUrl: "", deadline: "", imageUrl: "", benefits: "", requirements: "", documents: "", tips: "", isActive: true });
  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!id) {
      router.push("/admin/beasiswa");
      return;
    }

    getDocument(COLLECTIONS.scholarships, id)
      .then((data: any) => {
        if (!data) {
          router.push("/admin/beasiswa");
          return;
        }

        const deadline = data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : "";
        setForm({
          title: data.title || "",
          description: data.description || "",
          provider: data.provider || "",
          category: data.category || "dalam_negeri",
          level: data.level || "s1",
          region: data.region || "",
          country: data.country || "",
          registrationUrl: data.registrationUrl || "",
          deadline,
          imageUrl: data.imageUrl || "",
          benefits: listToText(data.benefits),
          requirements: listToText(data.requirements),
          documents: listToText(data.documents),
          tips: data.tips || "",
          isActive: data.isActive !== false,
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Gagal memuat data beasiswa");
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
      const fileName = `scholarships/${Date.now()}_${sanitizeFileName(file.name)}`;
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
    if (!id) return;

    setLoading(true);
    try {
      await updateDocument(COLLECTIONS.scholarships, id, {
        title: form.title,
        description: form.description,
        provider: form.provider,
        category: form.category,
        level: form.level,
        region: form.region,
        country: form.country,
        registrationUrl: form.registrationUrl,
        imageUrl: form.imageUrl,
        tips: form.tips,
        deadline: new Date(form.deadline),
        benefits: form.benefits.split("\n").map((item) => item.trim()).filter(Boolean),
        requirements: form.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
        documents: form.documents.split("\n").map((item) => item.trim()).filter(Boolean),
        isActive: form.isActive,
      });
      router.push("/admin/beasiswa");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center py-20">Memuat...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/beasiswa"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div><h1 className="text-2xl font-bold text-teal-deep">Edit Beasiswa</h1></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle className="text-base">Informasi Utama</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><Label>Judul *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Provider *</Label><Input value={form.provider} onChange={(e) => set("provider", e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deskripsi *</Label><Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Kategori</Label><Select value={form.category} onValueChange={(v) => set("category", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dalam_negeri">Dalam Negeri</SelectItem><SelectItem value="luar_negeri">Luar Negeri</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Jenjang</Label><Select value={form.level} onValueChange={(v) => set("level", v || "")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="s1">S1</SelectItem><SelectItem value="s2">S2</SelectItem><SelectItem value="s3">S3</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Deadline *</Label><Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Negara</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
            <div className="space-y-2"><Label>Region</Label><Input value={form.region} onChange={(e) => set("region", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>URL Pendaftaran</Label><Input value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Pamflet/Gambar Beasiswa</Label>
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
                <img src={form.imageUrl} alt="Preview pamflet beasiswa" className="w-full h-56 object-cover rounded-lg border" />
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
                <p className="text-sm font-medium text-gray-700">{uploading ? "Mengupload gambar..." : "Klik untuk upload pamflet/gambar"}</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP - Maks 5MB</p>
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="rounded" />
            Aktif dan tampil di publik
          </label>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Detail (satu per baris)</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><Label>Benefit</Label><Textarea rows={3} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} /></div>
          <div className="space-y-2"><Label>Persyaratan</Label><Textarea rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} /></div>
          <div className="space-y-2"><Label>Dokumen</Label><Textarea rows={3} value={form.documents} onChange={(e) => set("documents", e.target.value)} /></div>
          <div className="space-y-2"><Label>Tips</Label><Textarea rows={2} value={form.tips} onChange={(e) => set("tips", e.target.value)} /></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/beasiswa"><Button variant="outline">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading || uploading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}</Button></div>
      </form>
    </div>
  );
}

export default function EditBeasiswaPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Memuat...</div>}>
      <EditBeasiswaContent />
    </Suspense>
  );
}
