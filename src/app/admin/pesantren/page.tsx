"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface PesantrenItem { id: string; name: string; category: string; location: string; isActive: boolean; viewCount: number; }
const columns: Column<PesantrenItem>[] = [
  { key: "name", label: "Pesantren", render: (i) => <div><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.location}</p></div> },
  { key: "category", label: "Kategori", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.category}</Badge> },
  { key: "viewCount", label: "Dilihat", render: (i) => <span className="text-sm tabular-nums">{i.viewCount}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];

export default function PesantrenPage() {
  const [data, setData] = useState<PesantrenItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<PesantrenItem>(COLLECTIONS.pesantren, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus info pesantren ini?")) return; await deleteDocument(COLLECTIONS.pesantren, id); setData((p) => p.filter((i) => i.id !== id)); };
  
  return <DataTable title="Info Pesantren" description="Kelola data informasi pondok pesantren" columns={columns} data={data} loading={loading} createHref="/admin/pesantren/buat" createLabel="Tambah Pesantren" editHref={(id) => `/admin/pesantren/edit?id=${id}`} onDelete={handleDelete} searchField={"name" as keyof PesantrenItem} />;
}
