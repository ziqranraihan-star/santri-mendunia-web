"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    pesantren: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signUpUser(form);
      setSuccess("Pendaftaran berhasil! Silakan periksa email Anda (jika email konfirmasi diaktifkan), atau langsung menuju halaman login.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-surface via-white to-gold-surface p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal text-white mb-4 hover:bg-teal-dark transition-colors cursor-pointer shadow-lg shadow-teal/20">
              <Sparkles className="w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-teal-deep">Santri Mendunia</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat Akun Baru</p>
        </div>

        <Card className="border-0 shadow-xl shadow-black/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Daftar Akun</CardTitle>
            <CardDescription>Lengkapi data diri Anda di bawah ini</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Fulan bin Fulan" value={form.name} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="fulan123" value={form.username} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="fulan@example.com" value={form.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor WhatsApp</Label>
                <Input id="phoneNumber" type="tel" placeholder="081234567890" value={form.phoneNumber} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesantren">Asal Pondok Pesantren</Label>
                <Input id="pesantren" placeholder="Pondok Pesantren Al-Fulan" value={form.pesantren} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Minimal 6 karakter" minLength={6} value={form.password} onChange={handleChange} required />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
              {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">{success}</div>}
              
              <Button type="submit" className="w-full bg-teal hover:bg-teal-dark mt-2" disabled={loading}>
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-teal font-semibold hover:underline ml-1">
              Masuk di sini
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
