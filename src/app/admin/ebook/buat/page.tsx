"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, COLLECTIONS, supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";
import Link from "next/link";

export default function BuatEbookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    type: "Buku",
    category: "Pendidikan",
    thumbnailUrl: "",
    fileUrl: "",
    isActive: true,
  });

  // Upload cover image
  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return alert("File harus berupa gambar");
    if (file.size > 5 * 1024 * 1024) return alert("Ukuran file maksimal 5MB");
    setUploading(true);
    const fileName = `ebooks/cover_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { data, error } = await supabase.storage.from("public").upload(fileName, file, { upsert: false });
    if (error) { alert("Gagal upload gambar"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("public").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, thumbnailUrl: urlData.publicUrl }));
    setUploading(false);
  };

  // Upload PDF / document file
  const handleFileUpload = async (file: File) => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) return alert("File harus berupa PDF atau Word");
    if (file.size > 50 * 1024 * 1024) return alert("Ukuran file maksimal 50MB");
    setUploading(true);
    const fileName = `ebooks/doc_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { data, error } = await supabase.storage.from("public").upload(fileName, file, { upsert: false });
    if (error) { alert("Gagal upload dokumen"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("public").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, fileUrl: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDocument(COLLECTIONS.ebooks, {
        ...form,
        downloadCount: 0,
        createdAt: new Date().toISOString(),
      });
      router.push("/admin/ebook");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan: " + (err.message || "Pastikan tabel 'ebooks' di Supabase memiliki kolom 'description', 'thumbnail_url', dan 'file_url'."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ebook"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">Tambah Konten Ruang Karya</h1>
          <p className="text-sm text-muted-foreground">Unggah buku, dokumen, atau karya digital</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Karya</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Karya *</Label>
              <Input id="title" placeholder="Contoh: Panduan Menulis Esai LPDP" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Pencipta / Penulis *</Label>
              <Input id="author" placeholder="Nama penulis atau lembaga" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea id="description" placeholder="Jelaskan isi konten secara singkat..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe Konten</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v || "Buku" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buku">📚 Buku / E-Book</SelectItem>
                    <SelectItem value="Modul">📋 Modul Pelatihan</SelectItem>
                    <SelectItem value="Panduan">📝 Panduan / Guidebook</SelectItem>
                    <SelectItem value="Jurnal">🔬 Jurnal / Riset</SelectItem>
                    <SelectItem value="Video">🎥 Video</SelectItem>
                    <SelectItem value="Audio">🎙️ Audio / Podcast</SelectItem>
                    <SelectItem value="Infografis">🖼️ Infografis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "Pendidikan" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                    <SelectItem value="Beasiswa">Beasiswa</SelectItem>
                    <SelectItem value="Keislaman">Keislaman</SelectItem>
                    <SelectItem value="Kewirausahaan">Kewirausahaan</SelectItem>
                    <SelectItem value="Teknologi">Teknologi</SelectItem>
                    <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Cover */}
        <Card>
          <CardHeader><CardTitle className="text-base">Cover / Thumbnail</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {form.thumbnailUrl ? (
              <div className="relative group w-40">
                <img src={form.thumbnailUrl} alt="Cover" className="w-40 h-52 object-cover rounded-lg border" />
                <button type="button" onClick={() => setForm({ ...form, thumbnailUrl: "" })} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Upload Gambar Cover</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG — Maks 5MB</span>
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Upload File */}
        <Card>
          <CardHeader><CardTitle className="text-base">File Dokumen (PDF / Word)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {form.fileUrl ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <FileText className="w-6 h-6 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">File berhasil diupload</p>
                  <a href={form.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline truncate block">{form.fileUrl}</a>
                </div>
                <button type="button" onClick={() => setForm({ ...form, fileUrl: "" })} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors">
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Upload File PDF atau Word</span>
                <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — Maks 50MB</span>
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
              </label>
            )}
            <p className="text-xs text-muted-foreground">Atau masukkan URL file secara manual:</p>
            <Input placeholder="https://link-ke-file-dokumen.com/file.pdf" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
          <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
          <label htmlFor="isActive" className="text-sm">Publikasikan (tampilkan di halaman Ruang Karya)</label>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/ebook"><Button variant="outline" type="button">Batal</Button></Link>
          <Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading || uploading}>
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : uploading ? "Mengupload..." : "Simpan Karya"}
          </Button>
        </div>
      </form>
    </div>
  );
}
