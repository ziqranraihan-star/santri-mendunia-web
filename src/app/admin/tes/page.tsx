"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface TestItem { id: string; title: string; type: string; totalQuestions: number; duration: number; isActive: boolean; }
const columns: Column<TestItem>[] = [
  { key: "title", label: "Tes", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="uppercase text-xs">{i.type}</Badge> },
  { key: "totalQuestions", label: "Soal", render: (i) => <span className="text-sm">{i.totalQuestions || 0}</span> },
  { key: "duration", label: "Durasi", render: (i) => <span className="text-sm">{i.duration || 0} menit</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function TesPage() {
  const [data, setData] = useState<TestItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<TestItem>(COLLECTIONS.tests, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.tests, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Pusat Pelatihan" description="Kelola tes dan sertifikasi (TOAFL, TOEFL, IELTS)" columns={columns} data={data} loading={loading} createHref="/admin/tes/buat" createLabel="Tambah Tes" editHref={(id) => `/admin/tes/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
