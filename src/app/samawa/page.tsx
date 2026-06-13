"use client";

import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Users, ArrowRight, BookOpen } from "lucide-react";

export default function SamawaSpacePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-teal/5 rounded-b-[4rem]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 text-teal-deep font-medium text-sm mb-6">
            <Heart className="w-4 h-4 text-teal" />
            <span>Ruang Ikhtiar Menuju Rumah Sakinah</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-deep tracking-tight mb-6 leading-tight">
            Samawa <span className="text-gold">Space</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Bukan sekadar mencari, tapi ikhtiar menemukan dengan niat suci. Ruang aman bagi santri dan alumni untuk membangun rumah tangga yang Sakinah, Mawaddah, dan Warahmah.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/samawa/daftar">
              <Button size="lg" className="bg-teal hover:bg-teal-dark text-white rounded-full px-8 w-full sm:w-auto">
                Isi Biodata Barokah
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#filosofi">
              <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto text-teal-deep border-teal/20 hover:bg-teal/5">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="filosofi" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-teal-deep mb-4">Kenapa Berbeda?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dibangun dengan nilai-nilai Islami, Samawa Space menjaga proses ta'aruf agar tetap terjaga syariatnya.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-teal-deep mb-3">Niat yang Terjaga</h3>
            <p className="text-muted-foreground leading-relaxed">
              Setiap kandidat yang terdaftar adalah mereka yang memiliki niat serius menuju akad nikah, bukan sekadar mencoba-coba.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full">Fitur Utama</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-teal-deep mb-3">Lingkungan Aman</h3>
            <p className="text-muted-foreground leading-relaxed">
              Verifikasi ketat menggunakan KTP & Surat Rekomendasi Pengasuh. Proses chat juga didampingi dan dibatasi waktu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-teal-deep mb-3">Pendampingan Wali</h3>
            <p className="text-muted-foreground leading-relaxed">
              Interaksi selalu transparan. Ada Musyrif atau Wali Digital yang akan mendampingi proses menuju Nadhor.
            </p>
          </div>
        </div>
      </section>

      {/* Alur CTA */}
      <section className="py-24 bg-teal-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Mulai Ikhtiar Anda Sekarang</h2>
          <p className="text-teal-50 text-lg mb-10 max-w-2xl mx-auto">
            Jangan menunggu kebetulan. Jodoh terbaik datang di waktu terbaik dari Allah, namun kita diwajibkan menjemputnya dengan cara yang paling berkah.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-black text-gold mb-4">1</div>
              <h4 className="font-bold mb-2">Daftar & Verifikasi</h4>
              <p className="text-sm text-teal-50/80">Lengkapi KTP & Surat Rekomendasi.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-black text-gold mb-4">2</div>
              <h4 className="font-bold mb-2">Jelajah Kandidat</h4>
              <p className="text-sm text-teal-50/80">Ajukan ta'aruf secara eksklusif.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-black text-gold mb-4">3</div>
              <h4 className="font-bold mb-2">Chat Terbimbing</h4>
              <p className="text-sm text-teal-50/80">Berdiskusi dalam pengawasan musyrif.</p>
            </div>
          </div>
          <Link href="/samawa/daftar">
            <Button size="lg" className="bg-gold hover:bg-yellow-500 text-teal-deep font-bold rounded-full px-10">
              Bismillah, Daftar Samawa Space
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
