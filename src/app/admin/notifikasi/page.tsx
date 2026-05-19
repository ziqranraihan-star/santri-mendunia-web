"use client";
import { useState } from "react";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

export default function NotifikasiPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "general" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await createDocument(COLLECTIONS.notifications, { title: form.title, body: form.body, type: form.type, isRead: false, targetAll: true });
      setSent(true); setForm({ title: "", body: "", type: "general" });
      setTimeout(() => setSent(false), 3000);
    } catch { alert("Gagal"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-teal-deep">Kirim Notifikasi</h1><p className="text-sm text-muted-foreground">Kirim notifikasi ke seluruh pengguna aplikasi</p></div>
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Judul Notifikasi *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Update Beasiswa Terbaru!" /></div>
          <div className="space-y-2"><Label>Isi Pesan *</Label><Textarea rows={4} value={form.body} onChange={(e) => set("body", e.target.value)} required placeholder="Beasiswa Turkiye Burslari 2027 sudah dibuka..." /></div>
          {sent && <p className="text-sm text-emerald-600 font-medium">✓ Notifikasi berhasil dikirim!</p>}
          <Button type="submit" className="bg-teal hover:bg-teal-dark gap-2" disabled={loading}><Send className="w-4 h-4" />{loading ? "Mengirim..." : "Kirim Notifikasi"}</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
