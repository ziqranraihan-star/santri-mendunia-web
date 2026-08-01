"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

interface ProductImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onError: (message: string) => void;
}

export function ProductImageUpload({ value, onChange, onError }: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    onError("");
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      onError("Foto produk harus berformat JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      onError("Ukuran foto produk maksimal 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `products/${Date.now()}_${sanitizeFileName(file.name)}`;
      const { error } = await supabase.storage.from("public").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("public").getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (error) {
      console.error("Product image upload failed:", error);
      onError("Gagal upload foto produk. Pastikan akun memiliki akses Santri Go Ekspor dan policy Storage sudah diperbarui.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Foto Utama Produk</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-lg border bg-muted">
          <img src={value} alt="Preview foto produk" className="h-64 w-full object-contain" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-black/55 p-3">
            <Button type="button" size="sm" variant="secondary" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-1 h-4 w-4" /> {uploading ? "Mengupload..." : "Ganti"}
            </Button>
            <Button type="button" size="sm" variant="destructive" disabled={uploading} onClick={() => onChange("")}>
              <X className="mr-1 h-4 w-4" /> Hapus
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-teal hover:bg-teal/5 disabled:cursor-not-allowed"
        >
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            {uploading ? <Upload className="h-6 w-6 animate-pulse text-teal" /> : <ImageIcon className="h-6 w-6 text-gray-400" />}
          </span>
          <span className="block text-sm font-medium text-gray-700">{uploading ? "Mengupload foto..." : "Klik untuk upload foto produk"}</span>
          <span className="mt-1 block text-xs text-gray-500">JPG, PNG, atau WebP — maksimal 5 MB</span>
        </button>
      )}
    </div>
  );
}
