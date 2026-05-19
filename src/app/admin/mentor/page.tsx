"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface MentorItem { id: string; name: string; expertise: string; specialization: string; isActive: boolean; rating: number; totalSessions: number; }
const columns: Column<MentorItem>[] = [
  { key: "name", label: "Nama", render: (i) => <p className="font-medium">{i.name}</p> },
  { key: "expertise", label: "Keahlian", render: (i) => <span className="text-sm">{i.expertise || "-"}</span> },
  { key: "specialization", label: "Spesialisasi", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.specialization || "-"}</Badge> },
  { key: "rating", label: "Rating", render: (i) => <span className="text-sm">⭐ {(i.rating || 0).toFixed(1)}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function MentorPage() {
  const [data, setData] = useState<MentorItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<MentorItem>(COLLECTIONS.mentors, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.mentors, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Info Pesantren" description="Kelola data mentor dan ustadz" columns={columns} data={data} loading={loading} createHref="/admin/mentor/buat" createLabel="Tambah Mentor" editHref={(id) => `/admin/mentor/edit?id=${id}`} onDelete={handleDelete} searchField={"name" as keyof MentorItem} />;
}
