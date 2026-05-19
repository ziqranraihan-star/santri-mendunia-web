"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import { createDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";


export default function BuatBeritaPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    summary: "",
    category: "terkini",
    imageUrl: "",
    tags: "",
    isFeatured: false,
    isTrending: false,
  });

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar (JPG, PNG, WebP, dll)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fileName = `news/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { data, error } = await supabase.storage
      .from('public')
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error(error);
      alert("Gagal mengupload gambar");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('public').getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, imageUrl: publicUrlData.publicUrl }));
    setUploadProgress(100);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDocument(COLLECTIONS.news, {
        title: form.title,
        content: form.content,
        summary: form.summary,
        category: form.category,
        imageUrl: form.imageUrl,
        authorId: userData?.uid || "",
        authorName: userData?.name || "Admin",
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
        viewCount: 0,
        likeCount: 0,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isActive: true,
        publishedAt: new Date().toISOString(),
      });
      router.push("/admin/berita");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan berita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/berita">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">Tulis Berita Baru</h1>
          <p className="text-sm text-muted-foreground">Buat artikel untuk Santri News</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Berita</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Berita *</Label>
              <Input id="title" placeholder="Santri Jatim Raih Juara Internasional..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Ringkasan</Label>
              <Textarea id="summary" placeholder="Ringkasan singkat berita..." rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten Berita *</Label>
              <ReactQuill 
                theme="snow" 
                value={form.content} 
                onChange={(val) => setForm({ ...form, content: val })} 
                className="bg-white min-h-[300px]" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Detail & Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terkini">Terkini</SelectItem>
                    <SelectItem value="motivasi">Motivasi</SelectItem>
                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                    <SelectItem value="pesantren">Pesantren</SelectItem>
                    <SelectItem value="inspiratif">Inspiratif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (pisahkan koma)</Label>
                <Input id="tags" placeholder="pendidikan, santri, beasiswa" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>

            {/* Upload Gambar */}
            <div className="space-y-2">
              <Label>Gambar Berita</Label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {form.imageUrl ? (
                <div className="relative group">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-52 object-cover rounded-lg border" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                    <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-1" /> Ganti
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setForm({ ...form, imageUrl: "" })}>
                      <X className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 hover:border-teal rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-teal/5"
                >
                  {uploading ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-teal/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-teal animate-pulse" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Mengupload... {uploadProgress}%</p>
                      <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                        <div className="bg-teal h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Klik untuk upload atau drag & drop</p>
                      <p className="text-xs text-gray-500">JPG, PNG, WebP — Maks 5MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
                Tampilkan di Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} className="rounded" />
                Tandai sebagai Trending
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/berita"><Button variant="outline">Batal</Button></Link>
          <Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading || uploading}>
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Publish Berita"}
          </Button>
        </div>
      </form>
    </div>
  );
}
