"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/lib/auth";
import { supabase, createDocument, updateDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Send, ShieldAlert, AlertTriangle, ArrowLeft, HeartHandshake, XCircle } from "lucide-react";

export default function ChatSamawaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: requestId } = use(params);
  const { userData, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userData || !requestId) return;
    
    fetchChatData();
    
    // Subscribe to new messages using real-time
    const channel = supabase.channel('chat_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'taaruf_messages', filter: `request_id=eq.${requestId}` }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData, requestId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatData = async () => {
    try {
      // Get request info
      const { data: reqData } = await supabase
        .from("taaruf_requests")
        .select(`
          *,
          sender:sender_id (name),
          receiver:receiver_id (name)
        `)
        .eq("id", requestId)
        .single();
        
      setRequestInfo(reqData);

      // Get messages
      const { data: msgData } = await supabase
        .from("taaruf_messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });
        
      setMessages(msgData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent, content?: string, isSystem = false) => {
    if (e) e.preventDefault();
    const textToSend = content || newMessage;
    if (!textToSend.trim()) return;
    
    try {
      setNewMessage("");
      await createDocument(COLLECTIONS.taarufMessages, {
        requestId: requestId,
        senderId: userData?.uid,
        content: textToSend,
        isSystem: isSystem
      });
    } catch (err) {
      alert("Gagal mengirim pesan");
    }
  };

  const handleEndChat = async () => {
    if(!confirm("Akhiri sesi ta'aruf ini secara baik-baik? Anda tidak akan bisa chat lagi.")) return;
    await updateDocument(COLLECTIONS.taarufRequests, requestId, { status: "closed" });
    sendMessage(undefined, "Sesi Ta'aruf telah diakhiri. Semoga Allah memberikan jodoh terbaik di waktu terbaik.", true);
    fetchChatData();
  };

  const handleProceedToWali = async () => {
    if(!confirm("Lanjutkan ke tahap serius (keterlibatan Wali / Nadhor)?")) return;
    await updateDocument(COLLECTIONS.taarufRequests, requestId, { status: "closed" }); // Change status logically in future
    sendMessage(undefined, "Alhamdulillah, kedua belah pihak sepakat melanjutkan ke tahap Nadhor / Wali. Silakan ikuti Panduan Nadhor.", true);
    fetchChatData();
    alert("Silakan hubungi Musyrif / Admin untuk pendampingan Nadhor.");
  };

  if (!user) return <div className="min-h-screen flex justify-center items-center"><ShieldAlert className="w-10 h-10 text-teal mb-4" />Silakan Login.</div>;
  if (loading || !requestInfo) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  const isClosed = requestInfo.status !== "chat_active";
  const partnerName = userData.uid === requestInfo.sender_id ? requestInfo.receiver?.name : requestInfo.sender?.name;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col bg-white border-x shadow-sm h-[calc(100vh-64px)] mt-16">
        
        {/* Chat Header */}
        <div className="p-4 border-b bg-teal-deep text-white flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <Link href="/samawa/lamaran"><Button variant="ghost" size="icon" className="text-white hover:bg-white/20"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h2 className="font-bold text-lg">Ruang Ta'aruf: {partnerName}</h2>
              <p className="text-xs text-teal-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Dipantau oleh Musyrif</p>
            </div>
          </div>
          {!isClosed && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleProceedToWali} className="bg-gold hover:bg-yellow-500 text-teal-deep font-bold hidden sm:flex"><HeartHandshake className="w-4 h-4 mr-1" /> Lanjut ke Wali</Button>
              <Button size="sm" onClick={handleEndChat} variant="destructive" className="hidden sm:flex"><XCircle className="w-4 h-4 mr-1" /> Akhiri</Button>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm text-center mb-6">
              <strong>Adab Chat Ta'aruf:</strong> Gunakan bahasa yang sopan, fokus pada persiapan pernikahan, tidak membahas hal-hal yang kurang pantas, dan ingat bahwa percakapan ini dapat dipantau oleh Musyrif.
            </div>

            {messages.map((msg, i) => {
              const isMe = msg.sender_id === userData.uid;
              
              if (msg.is_system) {
                return (
                  <div key={msg.id} className="text-center my-4">
                    <span className="bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">{msg.content}</span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-teal text-white rounded-tr-none' : 'bg-white border rounded-tl-none text-slate-800'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t">
          {isClosed ? (
            <div className="text-center p-3 text-muted-foreground bg-slate-100 rounded-lg text-sm">
              Sesi Ta'aruf ini telah ditutup.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button variant="outline" size="sm" className="whitespace-nowrap text-xs" onClick={() => sendMessage(undefined, "Apa visi utama antum/anti dalam membangun keluarga?")}>Tanya Visi</Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap text-xs" onClick={() => sendMessage(undefined, "Bagaimana pandangan antum/anti terkait manajemen keuangan keluarga?")}>Tanya Keuangan</Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap text-xs" onClick={() => sendMessage(undefined, "Apa prinsip pendidikan anak yang antum/anti yakini?")}>Tanya Pendidikan Anak</Button>
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input 
                  placeholder="Ketik pesan dengan adab Islami..." 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)}
                  className="rounded-full bg-slate-50 border-slate-200"
                />
                <Button type="submit" size="icon" className="rounded-full bg-teal hover:bg-teal-dark shadow-md shrink-0"><Send className="w-4 h-4" /></Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
