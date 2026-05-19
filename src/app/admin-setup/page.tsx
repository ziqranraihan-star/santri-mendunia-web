"use client";
import { useState } from "react";
import { createAdminAccount } from "@/lib/auth";

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      await createAdminAccount("admin@santrimendunia.com", "Admin123!", "Admin Utama");
      setSuccess(true);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setSuccess(true);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Akses Klien</h1>
        <p className="text-sm text-gray-500 mb-6">Inisialisasi akun admin Anda untuk mengelola keseluruhan aplikasi M-Santri.</p>
        
        {success ? (
          <div className="text-green-600 font-medium bg-green-50 p-4 rounded-lg">
            <p>Berhasil Dibuat!</p>
            <p className="text-sm mt-2 font-mono text-left">
              <strong>Email:</strong> admin@santrimendunia.com<br/>
              <strong>Pass:</strong> Admin123!
            </p>
            <a href="/login" className="inline-block mt-4 text-blue-600 hover:underline">
              Pergi ke Halaman Login →
            </a>
          </div>
        ) : (
          <button
            onClick={handleSetup}
            disabled={loading}
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Menyiapkan Akun..." : "Aktifkan Akun Admin Utama"}
          </button>
        )}
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}
