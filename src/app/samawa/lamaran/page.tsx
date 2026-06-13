"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { supabase, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Inbox, Send, ShieldAlert, Loader2, MessageCircle } from "lucide-react";

export default function LamaranSamawaPage() {
  const router = useRouter();
  const { userData, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }
    fetchRequests();
  }, [userData]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Ambil lamaran yang DITERIMA
      const { data: received } = await supabase
        .from("taaruf_requests")
        .select(`
          *,
          sender:sender_id (name, pesantren),
          sender_profile:samawa_profiles!sender_id (vision_mission, criteria, amalan_rutin, skill_bekal)
        `)
        .eq("receiver_id", userData?.uid)
        .order("created_at", { ascending: false });

      // Ambil lamaran yang DIKIRIM
      const { data: sent } = await supabase
        .from("taaruf_requests")
        .select(`
          *,
          receiver:receiver_id (name, pesantren)
        `)
        .eq("sender_id", userData?.uid)
        .order("created_at", { ascending: false });

      setReceivedRequests(received || []);
      setSentRequests(sent || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    if (!confirm("Dengan menekan tombol Sama-sama Ikhtiar, Anda akan membuka Ruang Chat Ta'aruf dengan kandidat ini. Anda yakin?")) return;
    try {
      await updateDocument(COLLECTIONS.taarufRequests, id, { status: "chat_active" });
      alert("Alhamdulillah! Ruang Ta'aruf berhasil dibuka.");
      fetchRequests();
      router.push(`/samawa/chat/${id}`);
    } catch (err) {
      alert("Gagal memproses.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Anda yakin menolak pengajuan ini? Keputusan tidak dapat dibatalkan.")) return;
    try {
      await updateDocument(COLLECTIONS.taarufRequests, id, { status: "rejected" });
      fetchRequests();
    } catch (err) {
      alert("Gagal memproses.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu Jawaban</Badge>;
      case "chat_active": return <Badge variant="outline" className="bg-teal-50 text-teal border-teal/20">Chat Aktif</Badge>;
      case "rejected": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
      case "closed": return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Ditutup</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-teal" /></div>;
  if (!user) return <div className="min-h-screen flex justify-center items-center"><ShieldAlert className="w-10 h-10 text-teal mb-4" />Silakan Login.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto px-4 py-12 sm:px-6 w-full space-y-10">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-teal-deep mb-2">Dashboard Lamaran</h1>
          <p className="text-muted-foreground">Kelola pengajuan Ta'aruf yang Anda kirim dan terima.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kolom Lamaran Diterima */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-deep flex items-center gap-2">
              <Inbox className="w-5 h-5 text-gold" /> Lamaran Masuk
            </h2>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-10 bg-white border border-dashed rounded-xl text-muted-foreground">Belum ada lamaran masuk.</div>
            ) : (
              receivedRequests.map(req => (
                <Card key={req.id} className="border-teal/10 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{req.sender?.name}</CardTitle>
                        <CardDescription>{req.sender?.pesantren}</CardDescription>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="font-semibold text-teal-deep mb-1">Alasan Mengajukan:</p>
                      <p className="text-gray-600">"{req.reason_text}"</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="font-semibold text-teal-deep mb-1">Visi Ta'aruf:</p>
                      <p className="text-gray-600">"{req.vision_text}"</p>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleAccept(req.id)} className="flex-1 bg-teal hover:bg-teal-dark text-white">Sama-sama Ikhtiar</Button>
                        <Button onClick={() => handleReject(req.id)} variant="outline" className="text-red-500 hover:bg-red-50">Tolak Halus</Button>
                      </div>
                    )}
                    {req.status === "chat_active" && (
                      <Link href={`/samawa/chat/${req.id}`}>
                        <Button className="w-full bg-gold hover:bg-yellow-500 text-teal-deep font-bold gap-2">
                          <MessageCircle className="w-4 h-4" /> Buka Ruang Ta'aruf
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Kolom Lamaran Terkirim */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-deep flex items-center gap-2">
              <Send className="w-5 h-5 text-teal" /> Lamaran Terkirim
            </h2>
            {sentRequests.length === 0 ? (
              <div className="text-center py-10 bg-white border border-dashed rounded-xl text-muted-foreground">Belum ada lamaran terkirim.</div>
            ) : (
              sentRequests.map(req => (
                <Card key={req.id} className="border-slate-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Kandidat: {req.receiver?.name}</CardTitle>
                        <CardDescription>Dikirim: {new Date(req.created_at).toLocaleDateString("id-ID")}</CardDescription>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {req.status === "chat_active" && (
                      <Link href={`/samawa/chat/${req.id}`}>
                        <Button className="w-full bg-teal hover:bg-teal-dark text-white gap-2">
                          <MessageCircle className="w-4 h-4" /> Lanjutkan Chat
                        </Button>
                      </Link>
                    )}
                    {req.status === "pending" && (
                      <p className="text-sm text-muted-foreground italic">Menunggu respon dari kandidat. Perbanyak doa.</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
