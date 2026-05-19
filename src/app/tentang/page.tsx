"use client";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Heart, Sparkles, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function TentangPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-deep to-teal py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Tentang Santri Mendunia</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Santri Mendunia adalah platform digital yang menghubungkan santri Indonesia dengan peluang global — 
              beasiswa, edukasi, kewirausahaan, dan jaringan alumni pesantren di seluruh dunia.
            </p>
          </div>
        </section>

        {/* Visi Misi */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-teal-surface rounded-2xl p-8">
              <h2 className="text-xl font-bold text-teal-deep mb-3">🎯 Visi</h2>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi platform terdepan dalam memberdayakan santri Indonesia agar mampu bersaing di kancah global 
                dengan tetap berpegang teguh pada nilai-nilai pesantren.
              </p>
            </div>
            <div className="bg-gold-surface rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gold-dark mb-3">🚀 Misi</h2>
              <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
                <li>• Menyediakan akses informasi beasiswa dalam dan luar negeri</li>
                <li>• Mengembangkan soft-skill dan hard-skill santri melalui kursus online</li>
                <li>• Memberdayakan ekonomi pesantren melalui INKOPONTREN</li>
                <li>• Mewadahi berita dan inspirasi dari dunia santri</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section id="kontak" className="bg-muted/50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-teal-deep text-center mb-8">Hubungi Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="https://wa.me/6282298409860" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-xl p-5 border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="font-semibold">WhatsApp</p><p className="text-sm text-muted-foreground">+62 822-9840-9860</p></div>
              </a>
              <a href="https://www.instagram.com/santrimenduniaofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-xl p-5 border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center"><span className="text-xl">📸</span></div>
                <div><p className="font-semibold">Instagram</p><p className="text-sm text-muted-foreground">@santrimenduniaofficial</p></div>
              </a>
              <a href="https://www.tiktok.com/@santrimenduniaofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-xl p-5 border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><span className="text-xl">🎵</span></div>
                <div><p className="font-semibold">TikTok</p><p className="text-sm text-muted-foreground">@santrimenduniaofficial</p></div>
              </a>
              <a href="https://youtube.com/@santrimenduniatv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-xl p-5 border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center"><span className="text-xl">▶️</span></div>
                <div><p className="font-semibold">YouTube</p><p className="text-sm text-muted-foreground">Santri Mendunia TV</p></div>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
