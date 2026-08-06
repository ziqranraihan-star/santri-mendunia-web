"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm, ProductFormValue, productToForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, getDocument, updateDocument } from "@/lib/supabase/client";
import { getMutationErrorMessage } from "@/lib/supabase-error";
import { ProductRecord } from "@/lib/product";

function EditProdukForm() {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const [initialValue, setInitialValue] = useState<ProductFormValue | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!id) return router.push("/admin/produk");
    getDocument<ProductRecord>(COLLECTIONS.products, id)
      .then((product) => product ? setInitialValue(productToForm(product)) : setLoadError("Produk tidak ditemukan."))
      .catch(() => setLoadError("Data produk gagal dimuat."));
  }, [id, router]);

  if (loadError) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{loadError}</div>;
  if (!initialValue) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/produk"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Edit Produk</h1></div>
      <ProductForm initialValue={initialValue} submitLabel="Perbarui Produk" onSubmit={async (payload) => {
        try {
          await updateDocument(COLLECTIONS.products, id!, payload);
          router.push("/admin/produk");
        } catch (error) {
          throw new Error(getMutationErrorMessage(error, "produk"));
        }
      }} />
    </div>
  );
}

export default function EditProdukPage() {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}><EditProdukForm /></Suspense>;
}
