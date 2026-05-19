"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface CourseItem {
  id: string;
  title: string;
  type: string;
  level: string;
  mentor_id: string;
  price: number;
  is_free: boolean;
  enrolled_count: number;
  rating: number;
  is_active: boolean;
  total_lessons: number;
}

const columns: Column<CourseItem>[] = [
  { key: "title", label: "Judul", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.type?.replace("_", " ")}</Badge> },
  { key: "level", label: "Level", render: (i) => <Badge variant="outline" className="capitalize text-xs">{i.level}</Badge> },
  { key: "price", label: "Harga", render: (i) => <span className="text-sm">{i.is_free ? "GRATIS" : `Rp ${(i.price || 0).toLocaleString()}`}</span> },
  { key: "total_lessons", label: "Materi", render: (i) => (
    <Link href={`/admin/kursus/${i.id}/materi`}>
      <Button size="sm" variant="outline" className="gap-1 text-xs h-7 border-teal text-teal hover:bg-teal hover:text-white">
        <BookOpen className="w-3 h-3" />{i.total_lessons ?? 0} Materi
      </Button>
    </Link>
  )},
  { key: "enrolled_count", label: "Peserta", render: (i) => <span className="text-sm tabular-nums">{i.enrolled_count}</span> },
  { key: "rating", label: "Rating", render: (i) => <span className="text-sm">⭐ {(i.rating || 0).toFixed(1)}</span> },
  { key: "is_active", label: "Status", render: (i) => <Badge className={i.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.is_active ? "Aktif" : "Draft"}</Badge> },
];

export default function KursusPage() {
  const [data, setData] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const items = await getDocuments<CourseItem>(COLLECTIONS.courses, [orderBy("created_at", "desc")]);
      setData(items);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kursus ini? Semua materi di dalamnya juga akan terhapus.")) return;
    await deleteDocument(COLLECTIONS.courses, id);
    setData((p) => p.filter((i) => i.id !== id));
  };

  return (
    <DataTable
      title="Kursus"
      description="Kelola kursus dan pelatihan santri"
      columns={columns}
      data={data}
      loading={loading}
      createHref="/admin/kursus/buat"
      createLabel="Tambah Kursus"
      editHref={(id) => `/admin/kursus/edit?id=${id}`}
      onDelete={handleDelete}
      searchField="title"
    />
  );
}
