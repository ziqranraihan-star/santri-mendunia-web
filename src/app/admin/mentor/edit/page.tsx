"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function EditMentorContent() {
  const router = useRouter(); const searchParams = useSearchParams(); const id = searchParams.get("id");
  const [loading, setLoading] = useState(false); const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ name: "", expertise: "", specialization: "Agama", isActive: true });
  useEffect(() => {
    if (!id) return router.push("/admin/mentor");
    getDocument(COLLECTIONS.mentors, id).then((data: any) => {
      if (data) setForm({ name: data.name||"", expertise: data.expertise||"", specialization: data.specialization||"Agama", isActive: data.isActive??true });
      setInitialLoading(false);
    });
  }, [id, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!id) return; setLoading(true);
    try { await updateDocument(COLLECTIONS.mentors, id, form); router.push("/admin/mentor"); } 
    catch (err) { alert("Gagal"); } finally { setLoading(false); }
  };
  if (initialLoading) return <div>Memuat...</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Link href="/admin/mentor"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link><h1 className="text-2xl font-bold">Edit Mentor</h1></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
            <div className="space-y-2"><Label>Nama Mentor / Ustadz</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Keahlian (Expertise)</Label><Input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Spesialisasi</Label><Select value={form.specialization} onValueChange={(v) => setForm({ ...form, specialization: v || "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Agama">Agama</SelectItem><SelectItem value="Bahasa">Bahasa Arab/Inggris</SelectItem><SelectItem value="Umum">Umum</SelectItem></SelectContent></Select></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> status aktif</div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href="/admin/mentor"><Button variant="outline" type="button">Batal</Button></Link><Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2"/>Update</Button></div>
      </form>
    </div>
  );
}
export default function EditMentorPage() { return <Suspense><EditMentorContent/></Suspense>; }
