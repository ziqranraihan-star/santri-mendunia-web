"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface CourseItem { id: string; title: string; type: string; level: string; mentorId: string; price: number; isFree: boolean; enrolledCount: number; rating: number; isActive: boolean; }
const columns: Column<CourseItem>[] = [
  { key: "title", label: "Judul", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.type?.replace("_", " ")}</Badge> },
  { key: "level", label: "Level", render: (i) => <Badge variant="outline" className="capitalize text-xs">{i.level}</Badge> },
  { key: "price", label: "Harga", render: (i) => <span className="text-sm">{i.isFree ? "GRATIS" : `Rp ${i.price.toLocaleString()}`}</span> },
  { key: "enrolledCount", label: "Peserta", render: (i) => <span className="text-sm tabular-nums">{i.enrolledCount}</span> },
  { key: "rating", label: "Rating", render: (i) => <span className="text-sm">⭐ {i.rating.toFixed(1)}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];

export default function KursusPage() {
  const [data, setData] = useState<CourseItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<CourseItem>(COLLECTIONS.courses, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus kursus ini?")) return; await deleteDocument(COLLECTIONS.courses, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Kursus" description="Kelola kursus dan pelatihan" columns={columns} data={data} loading={loading} createHref="/admin/kursus/buat" createLabel="Tambah Kursus" editHref={(id) => `/admin/kursus/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
