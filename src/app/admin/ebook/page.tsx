"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface EbookItem { id: string; title: string; author: string; type: string; category: string; isActive: boolean; downloadCount: number; }
const columns: Column<EbookItem>[] = [
  { key: "title", label: "Judul", render: (i) => <div><p className="font-medium max-w-xs truncate">{i.title}</p><p className="text-xs text-muted-foreground">{i.author}</p></div> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.type}</Badge> },
  { key: "category", label: "Kategori", render: (i) => <Badge variant="outline" className="capitalize text-xs">{i.category}</Badge> },
  { key: "downloadCount", label: "Downloads", render: (i) => <span className="text-sm tabular-nums">{i.downloadCount || 0}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function EbookPage() {
  const [data, setData] = useState<EbookItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<EbookItem>(COLLECTIONS.ebooks, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.ebooks, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Ruang Kerja" description="Kelola e-book dan video" columns={columns} data={data} loading={loading} createHref="/admin/ebook/buat" createLabel="Tambah E-Book" editHref={(id) => `/admin/ebook/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
