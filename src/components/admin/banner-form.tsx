"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import {
  COLLECTIONS,
  createDocument,
  supabase,
  updateDocument,
} from "@/lib/supabase/client";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";
import { getMutationErrorMessage } from "@/lib/supabase-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface BannerFormValue {
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

interface BannerFormProps {
  bannerId?: string;
  initialValue?: Partial<BannerFormValue>;
}

const emptyValue: BannerFormValue = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
}

export default function BannerForm({
  bannerId,
  initialValue,
}: BannerFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<BannerFormValue>({
    ...emptyValue,
    ...initialValue,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const set = <K extends keyof BannerFormValue>(
    key: K,
    value: BannerFormValue[K],
  ) => setForm((previous) => ({ ...previous, [key]: value }));

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("File banner harus berupa gambar.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("Ukuran gambar maksimal 5MB.");
      return;
    }

    setErrorMessage("");
    setUploading(true);
    try {
      const fileName = `banners/${Date.now()}_${sanitizeFileName(file.name)}`;
      const { error } = await supabase.storage
        .from("public")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("public").getPublicUrl(fileName);
      set("imageUrl", data.publicUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Gagal mengunggah gambar. Pastikan bucket public dan policy storage aktif.",
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.imageUrl) {
      setErrorMessage("Gambar banner wajib diunggah.");
      return;
    }
    if (form.linkUrl && !isValidExternalUrl(form.linkUrl)) {
      setErrorMessage(
        "Tautan banner tidak valid. Gunakan alamat seperti https://santrimendunia.org/beasiswa.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        imageUrl: form.imageUrl,
        linkUrl: normalizeExternalUrl(form.linkUrl) || null,
        isActive: form.isActive,
      };

      if (bannerId) {
        await updateDocument(COLLECTIONS.banners, bannerId, payload);
      } else {
        await createDocument(COLLECTIONS.banners, payload);
      }
      router.push("/admin/banner");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(getMutationErrorMessage(error, "banner"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banner">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">
            {bannerId ? "Edit Banner" : "Tambah Banner"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Banner aktif akan tampil pada beranda aplikasi setelah refresh.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Tautan tujuan (opsional)</Label>
              <Input
                id="linkUrl"
                type="url"
                inputMode="url"
                placeholder="https://santrimendunia.org/beasiswa"
                value={form.linkUrl}
                onChange={(event) => set("linkUrl", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gambar Banner *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
              />
              {form.imageUrl ? (
                <div className="relative overflow-hidden rounded-lg border">
                  <img
                    src={form.imageUrl}
                    alt="Pratinjau banner"
                    className="h-60 w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-black/50 p-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-1 h-4 w-4" /> Ganti
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => set("imageUrl", "")}
                    >
                      <X className="mr-1 h-4 w-4" /> Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition-colors hover:border-teal hover:bg-teal/5 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Upload className="mx-auto h-8 w-8 animate-pulse text-teal" />
                  ) : (
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  )}
                  <p className="mt-3 text-sm font-medium">
                    {uploading ? "Mengunggah gambar..." : "Klik untuk unggah"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, atau WebP — maksimal 5MB
                  </p>
                </button>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => set("isActive", event.target.checked)}
              />
              Tampilkan banner di aplikasi
            </label>
          </CardContent>
        </Card>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/admin/banner">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-teal hover:bg-teal-dark"
            disabled={saving || uploading}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
