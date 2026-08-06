"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ExternalLink, ShoppingBag, Star } from "lucide-react";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, getDocuments, orderBy } from "@/lib/supabase/client";
import { formatRupiah, ProductRecord, productImages, productWhatsAppUrl } from "@/lib/product";

export default function ProductPublicPage() {
  const [data, setData] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocuments<ProductRecord>(COLLECTIONS.products, [orderBy("createdAt", "desc")])
      .then((items) => setData(items.filter((item) => item.isActive !== false)))
      .catch(() => setError("Produk belum dapat dimuat. Silakan coba kembali."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-teal-deep"><Image src="/logo-goexpro.jpeg" alt="Logo Santri Go Ekspor" width={52} height={52} className="h-13 w-13 rounded-full object-contain" /> Santri Go Ekspor</h1>
          <p className="mt-1 text-muted-foreground">Dukung kemandirian pesantren dengan membeli produk unggulan karya santri</p>
        </div>
        {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />)}</div>
        ) : data.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 py-20 text-center text-muted-foreground">Belum ada produk yang tersedia.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.map((product) => {
              const images = productImages(product);
              const hasDiscount = Number(product.originalPrice || 0) > Number(product.price || 0);
              return (
                <article key={product.id} className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <Link href={`/produk/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
                    {images[0] ? <img src={images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center"><ShoppingBag className="h-12 w-12 text-muted-foreground/20" /></span>}
                    {hasDiscount && <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">DISKON</span>}
                  </Link>
                  <div className="flex flex-1 flex-col p-3">
                    <Link href={`/produk/${product.id}`}><h2 className="line-clamp-2 text-sm font-bold hover:text-teal">{product.name}</h2></Link>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.pesantrenName}</p>
                    <div className="mt-2">
                      {hasDiscount && <div className="text-xs text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</div>}
                      <div className="font-bold text-orange-600">{formatRupiah(product.price)}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {Number(product.rating || 0).toFixed(1)} <span>•</span> {product.soldCount || 0} terjual</div>
                    <p className="my-2 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                    {(product.isSantriMade || product.legalities?.length) && <div className="mb-3 flex items-center gap-1 text-[10px] font-medium text-teal"><BadgeCheck className="h-3.5 w-3.5" /> {product.legalities?.includes("halal") ? "Halal • " : ""}{product.isSantriMade ? "100% Karya Santri" : "Produk Terverifikasi"}</div>}
                    <div className="mt-auto grid gap-2 sm:grid-cols-2">
                      <Link href={`/produk/${product.id}`}><Button size="sm" variant="outline" className="w-full text-xs">Lihat Detail</Button></Link>
                      {product.purchaseUrl && <a href={productWhatsAppUrl(product)} target="_blank" rel="noopener noreferrer"><Button size="sm" className="w-full bg-orange-500 text-xs hover:bg-orange-600">Beli <ExternalLink className="ml-1 h-3 w-3" /></Button></a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
