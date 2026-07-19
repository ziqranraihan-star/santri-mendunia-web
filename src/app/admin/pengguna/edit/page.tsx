"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const AVAILABLE_MENUS = [
  { id: "/admin/berita", label: "Berita & Artikel" },
  { id: "/admin/beasiswa", label: "Beasiswa" },
  { id: "/admin/kursus", label: "Kursus" },
  { id: "/admin/tes", label: "Pusat Pelatihan" },
  { id: "/admin/ebook", label: "Ruang Karya" },
  { id: "/admin/pesantren", label: "Info Pesantren" },
  { id: "/admin/lowongan", label: "Job & Magang" },
  { id: "/admin/trip", label: "Tour & Travel" },
  { id: "/admin/produk", label: "Santri Go Ekspor" },
  { id: "/admin/donasi", label: "Donasi" },
  { id: "/admin/samawa", label: "Samawa Space" },
];

function EditPenggunaForm() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("user");
  const [managedMenus, setManagedMenus] = useState<string[]>([]);
  
  useEffect(() => {
    if (!id) { router.push("/admin/pengguna"); return; }
    getDocument(COLLECTIONS.users, id).then((data: any) => {
      if (data) {
        setUser(data);
        setRole(data.role || "user");
        setManagedMenus(data.managedMenus || []);
      }
      setInitialLoading(false);
    });
  }, [id, router]);

  const handleMenuToggle = (menuId: string) => {
    setManagedMenus(prev => 
      prev.includes(menuId) ? prev.filter(m => m !== menuId) : [...prev, menuId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (id) await updateDocument(COLLECTIONS.users, id, { role, managedMenus });
      router.push("/admin/pengguna");
    } catch { alert("Gagal menyimpan pengaturan pengguna"); } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;
  if (!user) return <div className="p-8 text-center text-muted-foreground">Pengguna tidak ditemukan</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/pengguna"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold text-teal-deep">Pengaturan Akses PIC</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Nama Pengguna</Label>
            <Input value={user.name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email || ""} disabled />
          </div>
          
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-lg font-bold">Jabatan (Role)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "user", label: "User Biasa", desc: "Hanya akses aplikasi" },
                { id: "pic", label: "PIC (Penanggung Jawab)", desc: "Akses menu tertentu di Admin Panel" },
                { id: "admin", label: "Admin Utama", desc: "Akses penuh ke semua fitur" }
              ].map(r => (
                <div key={r.id} onClick={() => setRole(r.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${role === r.id ? 'border-teal bg-teal/5' : 'border-border hover:border-teal/50'}`}>
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {role === "pic" && (
            <div className="space-y-3 pt-4 border-t animate-in fade-in slide-in-from-top-4">
              <Label className="text-lg font-bold">Hak Akses Menu (Untuk PIC)</Label>
              <p className="text-sm text-muted-foreground mb-4">Centang menu apa saja yang bisa dikelola oleh PIC ini.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_MENUS.map(menu => (
                  <label key={menu.id} className="flex items-center space-x-3 p-3 rounded border hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal" checked={managedMenus.includes(menu.id)} onChange={() => handleMenuToggle(menu.id)} />
                    <span className="text-sm font-medium">{menu.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/pengguna"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan Pengaturan"}</Button></div>
      </form>
    </div>
  );
}

export default function EditPenggunaPage() {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}><EditPenggunaForm /></Suspense>;
}
