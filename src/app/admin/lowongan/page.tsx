"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";


interface JobItem { id: string; title: string; company: string; type: string; location: string; isRemote: boolean; salary: string; isActive: boolean; deadline: string; }
const columns: Column<JobItem>[] = [
  { key: "title", label: "Posisi", render: (i) => <div><p className="font-medium max-w-xs truncate">{i.title}</p><p className="text-xs text-muted-foreground">{i.company}</p></div> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.type}</Badge> },
  { key: "location", label: "Lokasi", render: (i) => <span className="text-sm">{i.isRemote ? "🏠 Remote" : i.location}</span> },
  { key: "salary", label: "Gaji", render: (i) => <span className="text-sm">{i.salary || "-"}</span> },
  { key: "deadline", label: "Deadline", render: (i) => { const d = i.deadline; return d ? <span className="text-xs text-muted-foreground">{(new Date(d).toLocaleDateString("id-ID"))}</span> : <span className="text-xs">-</span>; } },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function LowonganPage() {
  const [data, setData] = useState<JobItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<JobItem>(COLLECTIONS.jobs, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.jobs, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Job & Magang" description="Kelola lowongan kerja dan magang" columns={columns} data={data} loading={loading} createHref="/admin/lowongan/buat" createLabel="Tambah Lowongan" editHref={(id) => `/admin/lowongan/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
