"use client";

import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";


interface NewsItem {
  id: string;
  title: string;
  category: string;
  authorName: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string;
}

const columns: Column<NewsItem>[] = [
  {
    key: "title",
    label: "Judul",
    render: (item) => (
      <div className="max-w-xs">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.authorName}</p>
      </div>
    ),
  },
  {
    key: "category",
    label: "Kategori",
    render: (item) => (
      <Badge variant="secondary" className="capitalize text-xs">
        {item.category}
      </Badge>
    ),
  },
  {
    key: "viewCount",
    label: "Views",
    render: (item) => <span className="text-sm tabular-nums">{item.viewCount.toLocaleString()}</span>,
  },
  {
    key: "isActive",
    label: "Status",
    render: (item) => (
      <Badge className={item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>
        {item.isActive ? "Aktif" : "Draft"}
      </Badge>
    ),
  },
  {
    key: "publishedAt",
    label: "Tanggal",
    render: (item) => {
      const d = item.publishedAt || new Date();
      return <span className="text-xs text-muted-foreground">{(new Date(d).toLocaleDateString("id-ID"))}</span>;
    },
  },
];

export default function BeritaListPage() {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const items = await getDocuments<NewsItem>(COLLECTIONS.news, [
      orderBy("createdAt", "desc"),
    ]);
    setData(items);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    await deleteDocument(COLLECTIONS.news, id);
    setData((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <DataTable
      title="Santri News"
      description="Kelola berita dan artikel untuk aplikasi"
      columns={columns}
      data={data}
      loading={loading}
      createHref="/admin/berita/buat"
      createLabel="Tulis Berita"
      editHref={(id) => `/admin/berita/edit?id=${id}`}
      onDelete={handleDelete}
      searchField="title"
    />
  );
}
