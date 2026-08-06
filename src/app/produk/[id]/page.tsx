"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Box, ExternalLink, Star } from "lucide-react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, getDocument } from "@/lib/supabase/client";
import { formatRupiah, LEGALITY_OPTIONS, ProductRecord, ProductVariant, productImages, productWhatsAppUrl } from "@/lib/product";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    getDocument<ProductRecord>(COLLECTIONS.products, id)
      .then((item) => {
        if (!item || item.isActive === false) return setError("Produk tidak ditemukan.");
        setProduct(item);
        setSelectedImage(productImages(item)[0] || "");
      })
      .catch(() => setError("Detail produk gagal dimuat."));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/produk" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal"><ArrowLeft className="h-4 w-4" /> Kembali ke produk</Link>
        {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : !product ? <div className="py-20 text-center text-muted-foreground">Memuat produk...</div> : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <div className="aspect-square overflow-hidden rounded-2xl border bg-muted">{selectedImage ? <img src={selectedImage} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Box className="h-16 w-16 text-muted-foreground/30" /></div>}</div>
              <div className="mt-3 grid grid-cols-5 gap-2">{productImages(product).map((url, index) => <button key={url} type="button" onClick={() => setSelectedImage(url)} className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === url ? "border-teal" : "border-transparent"}`}><img src={url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>
            </section>
            <section className="space-y-5">
              <div><p className="text-sm font-medium capitalize text-orange-600">{product.category}</p><h1 className="mt-1 text-3xl font-bold text-teal-deep">{product.name}</h1><p className="mt-1 text-muted-foreground">{product.pesantrenName}</p></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {Number(product.rating || 0).toFixed(1)} <span>•</span> {product.soldCount || 0} terjual <span>•</span> Stok {selectedVariant?.stock ?? product.stock}</div>
              <div>{Number(product.originalPrice || 0) > Number(product.price) && <div className="text-sm text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</div>}<div className="text-3xl font-bold text-orange-600">{formatRupiah(selectedVariant?.price ?? product.price)}</div></div>
              <p className="whitespace-pre-line leading-7 text-muted-foreground">{product.description}</p>
              {!!product.variants?.length && <div><h2 className="mb-2 font-semibold">Pilih Varian</h2><div className="flex flex-wrap gap-2">{product.variants.map((variant) => <Button key={variant.name} type="button" variant={selectedVariant?.name === variant.name ? "default" : "outline"} onClick={() => setSelectedVariant(variant)}>{variant.name} · {formatRupiah(variant.price)}</Button>)}</div></div>}
              <div className="rounded-xl border bg-teal/5 p-4"><h2 className="mb-2 font-semibold">Legalitas & Jaminan</h2><div className="flex flex-wrap gap-2">{product.legalities?.map((value) => <span key={value} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-teal"><BadgeCheck className="h-3.5 w-3.5" /> {LEGALITY_OPTIONS.find(([key]) => key === value)?.[1] || value}</span>)}{product.isSantriMade && <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-teal"><BadgeCheck className="h-3.5 w-3.5" /> 100% Karya Santri</span>}</div>{product.legalityNumber && <p className="mt-2 text-xs text-muted-foreground">Nomor izin/sertifikasi: {product.legalityNumber}</p>}</div>
              <div className="text-sm text-muted-foreground">Berat {product.weight || "-"} gram{product.lengthCm ? ` · Dimensi ${product.lengthCm} × ${product.widthCm || "-"} × ${product.heightCm || "-"} cm` : ""}</div>
              {product.purchaseUrl && <a href={productWhatsAppUrl(product, selectedVariant)} target="_blank" rel="noopener noreferrer" className="block"><Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">Pesan via WhatsApp <ExternalLink className="ml-2 h-4 w-4" /></Button></a>}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
