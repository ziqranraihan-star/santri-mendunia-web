"use client";

import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";


interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  deadline: string;
}

const columns: Column<ScholarshipItem>[] = [
  { key: "title", label: "Judul", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "provider", label: "Provider", render: (i) => <span className="text-sm">{i.provider}</span> },
  { key: "level", label: "Jenjang", render: (i) => <Badge variant="secondary" className="uppercase text-xs">{i.level}</Badge> },
  { key: "category", label: "Kategori", render: (i) => <Badge variant="outline" className="capitalize text-xs">{i.category?.replace("_", " ")}</Badge> },
  { key: "deadline", label: "Deadline", render: (i) => { const d = i.deadline || new Date(); return <span className="text-xs text-muted-foreground">{(new Date(d).toLocaleDateString("id-ID"))}</span>; } },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];

export default function BeasiswaListPage() {
  const [data, setData] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const items = await getDocuments<ScholarshipItem>(COLLECTIONS.scholarships, [orderBy("createdAt", "desc")]);
      setData(items);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await deleteDocument(COLLECTIONS.scholarships, id);
    setData((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <DataTable
      title="Beasiswa"
      description="Kelola informasi beasiswa dalam dan luar negeri"
      columns={columns}
      data={data}
      loading={loading}
      createHref="/admin/beasiswa/buat"
      createLabel="Tambah Beasiswa"
      editHref={(id) => `/admin/beasiswa/edit?id=${id}`}
      onDelete={handleDelete}
      searchField="title"
    />
  );
}
