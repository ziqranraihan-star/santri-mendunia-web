"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createDocument } from "@/lib/supabase/client";
import { getMutationErrorMessage } from "@/lib/supabase-error";

export default function BuatProdukPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-2xl font-bold text-teal-deep">Tambah Produk ke Santri Go Ekspor</h1><p className="text-sm text-muted-foreground">Formulir produk pesantren mitra</p></div>
      </div>
      <ProductForm onSubmit={async (payload) => {
        try {
          await createDocument(COLLECTIONS.products, { ...payload, isFeatured: false, isActive: true, soldCount: 0, rating: 0 });
          router.push("/admin/produk");
        } catch (error) {
          throw new Error(getMutationErrorMessage(error, "produk"));
        }
      }} />
    </div>
  );
}
