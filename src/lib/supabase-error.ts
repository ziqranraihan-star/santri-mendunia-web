type SupabaseLikeError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function getMutationErrorMessage(error: unknown, subject = "data"): string {
  const value = (error && typeof error === "object" ? error : {}) as SupabaseLikeError;
  const message = value.message || (error instanceof Error ? error.message : String(error));

  if (/failed to fetch|network|fetch/i.test(message)) {
    return `Gagal menyimpan ${subject} karena koneksi ke database bermasalah. Coba lagi setelah koneksi Supabase pulih.`;
  }

  if (value.code === "42501" || /row-level security|permission denied|not allowed/i.test(message)) {
    return `Akun ini belum memiliki izin menyimpan ${subject}. Pastikan akun berstatus admin/PIC dan menu terkait sudah diberikan.`;
  }

  if (value.code === "PGRST204" || /column .* schema cache|could not find.*column/i.test(message)) {
    return `Struktur database ${subject} belum sinkron dengan aplikasi. Jalankan migrasi client_requested_fixes.sql di Supabase lalu coba lagi.`;
  }

  if (value.code === "23502") {
    return `Ada kolom wajib ${subject} yang belum terisi. Periksa kembali semua kolom bertanda *.`;
  }

  if (value.code === "22P02" || /invalid input syntax/i.test(message)) {
    return `Format salah satu kolom ${subject} tidak valid. Periksa tanggal dan URL lalu coba lagi.`;
  }

  return `Gagal menyimpan ${subject}: ${message || "kesalahan tidak diketahui"}`;
}
