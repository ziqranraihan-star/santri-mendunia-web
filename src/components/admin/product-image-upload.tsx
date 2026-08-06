"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Star, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 5;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

interface ProductImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onError: (message: string) => void;
}

export function ProductImageUpload({ value, onChange, onError }: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    onError("");
    if (value.length + files.length > MAX_IMAGES) {
      onError(`Galeri produk maksimal ${MAX_IMAGES} foto.`);
      return;
    }
    const invalidType = files.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
    if (invalidType) {
      onError(`"${invalidType.name}" bukan JPG, PNG, atau WebP.`);
      return;
    }
    const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      onError(`Ukuran "${oversized.name}" melebihi 5 MB.`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const fileName = `products/${Date.now()}_${crypto.randomUUID()}_${sanitizeFileName(file.name)}`;
        const { error } = await supabase.storage.from("public").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        uploaded.push(supabase.storage.from("public").getPublicUrl(fileName).data.publicUrl);
      }
      onChange([...value, ...uploaded]);
    } catch (error) {
      console.error("Product image upload failed:", error);
      onError("Gagal mengunggah foto. Pastikan akun memiliki akses Santri Go Ekspor dan policy Storage sudah diperbarui.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const makePrimary = (index: number) => {
    const next = [...value];
    const [selected] = next.splice(index, 1);
    onChange([selected, ...next]);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Galeri Foto Produk *</Label>
        <p className="mt-1 text-xs text-muted-foreground">Unggah 1–5 foto JPG/PNG/WebP, maksimal 5 MB per foto. Foto pertama menjadi foto utama.</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void handleUpload(Array.from(event.target.files || []))}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {value.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img src={url} alt={`Foto produk ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && <span className="absolute left-1 top-1 rounded bg-teal px-2 py-1 text-[10px] font-medium text-white">Utama</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/55 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              {index > 0 && (
                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" title="Jadikan foto utama" onClick={() => makePrimary(index)}>
                  <Star className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button type="button" size="icon" variant="destructive" className="h-7 w-7" title="Hapus foto" onClick={() => onChange(value.filter((_, photoIndex) => photoIndex !== index))}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {value.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 p-3 text-center transition-colors hover:border-teal hover:bg-teal/5 disabled:cursor-not-allowed"
          >
            <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              {uploading ? <Upload className="h-5 w-5 animate-pulse text-teal" /> : <ImageIcon className="h-5 w-5 text-gray-400" />}
            </span>
            <span className="block text-xs font-medium text-gray-700">{uploading ? "Mengunggah..." : "Tambah foto"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
