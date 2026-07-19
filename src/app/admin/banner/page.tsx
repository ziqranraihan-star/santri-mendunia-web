"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface BannerItem { createdAt?: string; id: string; title: string; imageUrl: string; linkUrl?: string; isActive: boolean; }
const columns: Column<BannerItem>[] = [
  { key: "imageUrl", label: "Preview", render: (i) => i.imageUrl ? <img src={i.imageUrl} alt="" className="w-24 h-12 object-cover rounded" /> : <div className="w-24 h-12 bg-muted rounded" /> },
  { key: "title", label: "Judul", render: (i) => <p className="font-medium">{i.title}</p> },
  { key: "linkUrl", label: "Tautan", render: (i) => <span className="block max-w-56 truncate text-sm text-muted-foreground">{i.linkUrl || "-"}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
  { key: "createdAt", label: "Dibuat", render: (i) => <span className="text-sm">{i.createdAt ? new Date(i.createdAt).toLocaleDateString("id-ID") : "-"}</span> },
];
export default function BannerPage() {
  const [data, setData] = useState<BannerItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<BannerItem>(COLLECTIONS.banners, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.banners, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Banner" description="Banner aktif di sini tampil otomatis pada beranda aplikasi." columns={columns} data={data} loading={loading} createHref="/admin/banner/buat" createLabel="Tambah Banner" editHref={(id) => `/admin/banner/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
