"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface DonationItem { id: string; title: string; category: string; targetAmount: number; collectedAmount: number; isActive: boolean; }
const columns: Column<DonationItem>[] = [
  { key: "title", label: "Kampanye", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "category", label: "Kategori", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.category}</Badge> },
  { key: "targetAmount", label: "Target", render: (i) => <span className="text-sm">Rp {(i.targetAmount || 0).toLocaleString()}</span> },
  { key: "collectedAmount", label: "Terkumpul", render: (i) => <span className="text-sm font-medium text-teal">Rp {(i.collectedAmount || 0).toLocaleString()}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Selesai"}</Badge> },
];
export default function DonasiPage() {
  const [data, setData] = useState<DonationItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<DonationItem>(COLLECTIONS.donations, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.donations, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Donasi" description="Kelola kampanye donasi" columns={columns} data={data} loading={loading} createHref="/admin/donasi/buat" createLabel="Buat Kampanye" editHref={(id) => `/admin/donasi/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
