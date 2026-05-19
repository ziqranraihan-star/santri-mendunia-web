"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, updateDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface BannerItem { created_at?: string; id: string; title: string; imageUrl: string; targetUrl: string; isActive: boolean; order: number; }
const columns: Column<BannerItem>[] = [
  { key: "imageUrl", label: "Preview", render: (i) => i.imageUrl ? <img src={i.imageUrl} alt="" className="w-24 h-12 object-cover rounded" /> : <div className="w-24 h-12 bg-muted rounded" /> },
  { key: "title", label: "Judul", render: (i) => <p className="font-medium">{i.title}</p> },
  { key: "order", label: "Urutan", render: (i) => <span className="text-sm tabular-nums">{String(i.order || 0)}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
  { key: "created_at", label: "Dibuat", render: (i) => <span className="text-sm">{(i.created_at ? new Date(i.created_at) : new Date()).toLocaleDateString()}</span> },
];
export default function BannerPage() {
  const [data, setData] = useState<BannerItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<BannerItem>(COLLECTIONS.banners, [orderBy("order")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.banners, id); setData((p) => p.filter((i) => i.id !== id)); };
  const toggleActive = async (id: string, current: boolean) => { try { await updateDocument(COLLECTIONS.banners, id, { isActive: !current }); setData(data.map(d => d.id === id ? { ...d, isActive: !current } : d)); } catch (e) { alert("Gagal"); } };
  return <DataTable title="Banner" description="Kelola banner promo di homepage" columns={columns} data={data} loading={loading} createHref="/admin/banner/buat" createLabel="Tambah Banner" editHref={(id) => `/admin/banner/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
