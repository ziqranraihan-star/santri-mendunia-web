"use client";
import Link from "next/link";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Smartphone, Settings, CheckCircle2 } from "lucide-react";

export default function DownloadAppPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-deep via-teal-dark to-teal opacity-90 z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Versi Beta Tersedia
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Satu Aplikasi untuk <br className="hidden md:block" />
                  <span className="text-teal-100">Dunia Santri</span>
                </h1>
                <p className="text-lg md:text-xl text-teal-50 max-w-xl mx-auto lg:mx-0">
                  Akses kursus, temukan beasiswa, baca berita terkini, dan kembangkan diri Anda bersama ribuan santri lainnya di seluruh dunia.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <a href="/santri-mendunia-app.apk" download>
                    <Button size="lg" className="bg-white text-teal-deep hover:bg-gray-100 font-bold h-14 px-8 rounded-full shadow-xl w-full sm:w-auto">
                      <Download className="w-5 h-5 mr-2" />
                      Download APK (57 MB)
                    </Button>
                  </a>
                </div>
                <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-sm text-teal-100">
                  <ShieldCheck className="w-4 h-4 text-green-300" />
                  <span>Aman & Bebas Iklan</span>
                </div>
              </div>

              {/* Mockup & QR Code */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-xl">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-teal-deep text-xl mb-1">Scan untuk Download</h3>
                    <p className="text-sm text-muted-foreground">Gunakan kamera HP Anda untuk scan QR Code ini</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex justify-center mb-6">
                    {/* Generates a QR code pointing to this page */}
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.santrimendunia.org/app" alt="QR Code Download" className="w-48 h-48 rounded-lg shadow-sm" />
                  </div>
                  
                  <div className="flex items-center gap-4 bg-teal-50 p-4 rounded-xl">
                    <div className="bg-teal p-3 rounded-full text-white">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-teal-deep text-sm">Android Only</p>
                      <p className="text-xs text-muted-foreground">Versi iOS segera hadir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-teal-deep mb-4">Cara Instalasi yang Aman</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Karena aplikasi ini didownload langsung dari website resmi kami (bukan Play Store), Anda perlu mengizinkan instalasi terlebih dahulu. Jangan khawatir, aplikasi ini 100% aman.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-2xl p-8 border hover:shadow-lg transition-all text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-teal text-2xl font-bold mx-auto mb-6">1</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Download APK</h3>
                <p className="text-muted-foreground">Klik tombol download di atas dan tunggu hingga file <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">santri-mendunia-app.apk</span> selesai diunduh.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-2xl p-8 border hover:shadow-lg transition-all text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-teal mx-auto mb-6">
                  <Settings className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Izinkan Sumber</h3>
                <p className="text-muted-foreground">Buka file yang diunduh. Jika muncul peringatan, pilih <strong>Pengaturan (Settings)</strong> dan aktifkan <strong>"Izinkan dari sumber ini"</strong>.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-2xl p-8 border hover:shadow-lg transition-all text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 bg-teal shadow-md rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Instal & Buka</h3>
                <p className="text-muted-foreground">Kembali ke layar sebelumnya, klik <strong>Instal</strong>. Jika ada peringatan Google Play Protect, pilih <strong>"Tetap Instal (Install Anyway)"</strong>.</p>
              </div>
            </div>
            
            <div className="mt-16 bg-teal-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-100">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-10 h-10 text-teal shrink-0" />
                <div>
                  <h4 className="font-bold text-teal-deep text-lg">Kenapa muncul peringatan?</h4>
                  <p className="text-teal-900/70 text-sm mt-1">Sistem Android secara otomatis memperingatkan semua aplikasi yang didownload di luar Play Store. Karena saat ini aplikasi sedang dalam tahap rilis peluncuran eksklusif, peringatan tersebut wajar terjadi.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
