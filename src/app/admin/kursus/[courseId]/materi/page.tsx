"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, getDocument, COLLECTIONS } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  ArrowLeft, Plus, Pencil, Trash2, GripVertical,
  PlayCircle, FileText, HelpCircle, Video, Save, X
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  type: "video" | "text" | "quiz";
  content_url: string | null;
  text_content: string | null;
  duration: number;
  is_free: boolean;
}

interface Course {
  id: string;
  title: string;
  total_lessons: number;
}

const emptyForm = {
  title: "",
  description: "",
  order: 1,
  type: "video" as "video" | "text" | "quiz",
  content_url: "",
  text_content: "",
  duration: 0,
  is_free: false,
};

export default function MateriKursusPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function loadData() {
    setLoading(true);
    try {
      const c = await getDocument(COLLECTIONS.courses, courseId);
      setCourse(c);
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });
      if (!error) setLessons(data || []);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditId(null);
    setForm({ ...emptyForm, order: lessons.length + 1 });
    setDialogOpen(true);
  }

  function openEdit(lesson: Lesson) {
    setEditId(lesson.id);
    setForm({
      title: lesson.title,
      description: lesson.description || "",
      order: lesson.order,
      type: lesson.type,
      content_url: lesson.content_url || "",
      text_content: lesson.text_content || "",
      duration: lesson.duration || 0,
      is_free: lesson.is_free,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return alert("Judul wajib diisi!");
    setSaving(true);
    try {
      const payload = {
        course_id: courseId,
        title: form.title,
        description: form.description || null,
        order: Number(form.order),
        type: form.type,
        content_url: form.content_url || null,
        text_content: form.text_content || null,
        duration: Number(form.duration) || 0,
        is_free: form.is_free,
      };

      if (editId) {
        const { error } = await supabase.from("lessons").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lessons").insert(payload);
        if (error) throw error;
        // Update total_lessons count
        await supabase
          .from("courses")
          .update({ total_lessons: lessons.length + 1 })
          .eq("id", courseId);
      }

      setDialogOpen(false);
      await loadData();
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm("Hapus materi ini?")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (!error) {
      const remaining = lessons.filter(l => l.id !== lessonId);
      setLessons(remaining);
      await supabase
        .from("courses")
        .update({ total_lessons: remaining.length })
        .eq("id", courseId);
    }
  }

  const typeIcon = (type: string) => {
    if (type === "video") return <PlayCircle className="w-4 h-4 text-blue-500" />;
    if (type === "text") return <FileText className="w-4 h-4 text-green-500" />;
    return <HelpCircle className="w-4 h-4 text-amber-500" />;
  };

  const typeLabel = (type: string) => {
    if (type === "video") return "Video";
    if (type === "text") return "Bacaan";
    return "Kuis";
  };

  const typeColor = (type: string) => {
    if (type === "video") return "bg-blue-50 text-blue-700 border-blue-200";
    if (type === "text") return "bg-green-50 text-green-700 border-green-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/kursus">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-teal-deep">Materi Kursus</h1>
          {course && <p className="text-sm text-muted-foreground mt-0.5">{course.title}</p>}
        </div>
        <Button onClick={openCreate} className="bg-teal hover:bg-teal-dark gap-2">
          <Plus className="w-4 h-4" /> Tambah Materi
        </Button>
      </div>

      {/* Stats */}
      {course && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Total Materi</p>
              <p className="text-2xl font-bold text-teal-deep">{lessons.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Video</p>
              <p className="text-2xl font-bold text-blue-600">{lessons.filter(l => l.type === "video").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Gratis</p>
              <p className="text-2xl font-bold text-emerald-600">{lessons.filter(l => l.is_free).length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Materi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Memuat...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Belum ada materi. Klik "Tambah Materi" untuk mulai.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-muted-foreground/40">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold w-5 text-center">{lesson.order}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {typeIcon(lesson.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      {lesson.is_free && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0 h-4 shrink-0">
                          GRATIS
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge variant="outline" className={`text-[10px] ${typeColor(lesson.type)}`}>
                        {typeLabel(lesson.type)}
                      </Badge>
                      {lesson.duration > 0 && (
                        <span className="text-xs text-muted-foreground">{lesson.duration} menit</span>
                      )}
                      {lesson.content_url && (
                        <a
                          href={lesson.content_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline truncate max-w-[200px]"
                        >
                          {lesson.content_url}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-teal"
                      onClick={() => openEdit(lesson)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Tambah/Edit Materi */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Materi" : "Tambah Materi Baru"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Judul */}
            <div className="space-y-1.5">
              <Label>Judul Materi *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="cth: Perkenalan & Kosakata Dasar"
              />
            </div>

            {/* Tipe & Urutan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tipe Materi</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm(p => ({ ...p, type: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">🎬 Video</SelectItem>
                    <SelectItem value="text">📄 Bacaan / Teks</SelectItem>
                    <SelectItem value="quiz">❓ Kuis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Urutan</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* URL Video (hanya jika tipe video) */}
            {form.type === "video" && (
              <div className="space-y-1.5">
                <Label>URL Video</Label>
                <Input
                  value={form.content_url}
                  onChange={(e) => setForm(p => ({ ...p, content_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Mendukung YouTube, Google Drive, atau URL video langsung
                </p>
                {/* Preview YouTube */}
                {form.content_url && (form.content_url.includes("youtube.com") || form.content_url.includes("youtu.be")) && (
                  <div className="mt-2 rounded-lg overflow-hidden aspect-video bg-black">
                    <iframe
                      src={getYoutubeEmbedUrl(form.content_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {/* Konten Teks */}
            {form.type === "text" && (
              <div className="space-y-1.5">
                <Label>Konten / Materi Teks</Label>
                <Textarea
                  rows={6}
                  value={form.text_content}
                  onChange={(e) => setForm(p => ({ ...p, text_content: e.target.value }))}
                  placeholder="Tulis materi bacaan di sini..."
                />
              </div>
            )}

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label>Deskripsi Singkat</Label>
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Apa yang dipelajari di materi ini?"
              />
            </div>

            {/* Durasi & Gratis */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Durasi (menit)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.duration}
                  onChange={(e) => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Akses</Label>
                <Select
                  value={form.is_free ? "free" : "paid"}
                  onValueChange={(v) => setForm(p => ({ ...p, is_free: v === "free" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">✅ Gratis (Preview)</SelectItem>
                    <SelectItem value="paid">🔒 Berbayar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-teal hover:bg-teal-dark gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getYoutubeEmbedUrl(url: string): string {
  try {
    // Handle youtu.be short links
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // Handle youtube.com/watch?v=...
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch {}
  return url;
}
