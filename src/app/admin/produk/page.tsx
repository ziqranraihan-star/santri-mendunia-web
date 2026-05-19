"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface ProductItem { id: string; name: string; category: string; pesantrenName: string; price: number; stock: number; soldCount: number; rating: number; isActive: boolean; }
const columns: Column<ProductItem>[] = [
  { key: "name", label: "Produk", render: (i) => <div><p className="font-medium max-w-xs truncate">{i.name}</p><p className="text-xs text-muted-foreground">{i.pesantrenName}</p></div> },
  { key: "category", label: "Kategori", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.category}</Badge> },
  { key: "price", label: "Harga", render: (i) => <span className="text-sm">Rp {i.price?.toLocaleString()}</span> },
  { key: "stock", label: "Stok", render: (i) => <span className={`text-sm font-medium ${i.stock < 5 ? "text-destructive" : ""}`}>{i.stock}</span> },
  { key: "soldCount", label: "Terjual", render: (i) => <span className="text-sm tabular-nums">{i.soldCount}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function ProdukPage() {
  const [data, setData] = useState<ProductItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<ProductItem>(COLLECTIONS.products, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus produk ini?")) return; await deleteDocument(COLLECTIONS.products, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="INKOPONTREN" description="Kelola produk UMKM pesantren" columns={columns} data={data} loading={loading} createHref="/admin/produk/buat" createLabel="Tambah Produk" editHref={(id) => `/admin/produk/edit?id=${id}`} onDelete={handleDelete} searchField={"name" as keyof ProductItem} />;
}
