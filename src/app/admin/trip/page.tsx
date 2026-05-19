"use client";
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

interface TripItem { id: string; title: string; destination: string; duration: string; price: number; type: string; isActive: boolean; rating: number; }
const columns: Column<TripItem>[] = [
  { key: "title", label: "Trip", render: (i) => <p className="font-medium max-w-xs truncate">{i.title}</p> },
  { key: "destination", label: "Destinasi", render: (i) => <span className="text-sm">{i.destination || "-"}</span> },
  { key: "type", label: "Tipe", render: (i) => <Badge variant="secondary" className="capitalize text-xs">{i.type}</Badge> },
  { key: "price", label: "Harga", render: (i) => <span className="text-sm">Rp {i.price?.toLocaleString()}</span> },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{i.isActive ? "Aktif" : "Draft"}</Badge> },
];
export default function TripPage() {
  const [data, setData] = useState<TripItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<TripItem>(COLLECTIONS.trips, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Hapus?")) return; await deleteDocument(COLLECTIONS.trips, id); setData((p) => p.filter((i) => i.id !== id)); };
  return <DataTable title="Tour & Travel" description="Kelola paket trip edukatif" columns={columns} data={data} loading={loading} createHref="/admin/trip/buat" createLabel="Tambah Trip" editHref={(id) => `/admin/trip/edit?id=${id}`} onDelete={handleDelete} searchField="title" />;
}
