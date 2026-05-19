"use client";
import { useEffect, useState } from "react";
import { getDocuments, updateDocument, COLLECTIONS, orderBy } from "@/lib/supabase/client";
import DataTable, { Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";


interface UserItem { id: string; name: string; email: string; role: string; pesantrenOrigin: string; isActive: boolean; createdAt: string; }
const columns: Column<UserItem>[] = [
  { key: "name", label: "Nama", render: (i) => <div><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.email}</p></div> },
  { key: "role", label: "Role", render: (i) => <Badge className={i.role === "admin" ? "bg-gold/20 text-gold-dark" : "bg-teal-surface text-teal-deep"} variant="secondary">{i.role}</Badge> },
  { key: "pesantrenOrigin", label: "Pesantren", render: (i) => <span className="text-sm">{i.pesantrenOrigin || "-"}</span> },
  { key: "createdAt", label: "Bergabung", render: (i) => { const d = i.createdAt; return d ? <span className="text-xs text-muted-foreground">{(new Date(d).toLocaleDateString("id-ID"))}</span> : <span>-</span>; } },
  { key: "isActive", label: "Status", render: (i) => <Badge className={i.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}>{i.isActive ? "Aktif" : "Nonaktif"}</Badge> },
];
export default function PenggunaPage() {
  const [data, setData] = useState<UserItem[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const items = await getDocuments<UserItem>(COLLECTIONS.users, [orderBy("createdAt", "desc")]); setData(items); setLoading(false); })(); }, []);
  return <DataTable title="Pengguna" description="Kelola data pengguna aplikasi" columns={columns} data={data} loading={loading} searchField={"name" as keyof UserItem} />;
}
