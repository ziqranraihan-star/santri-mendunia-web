"use client";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Briefcase, GraduationCap, Users } from "lucide-react";

const programs = [
  {
    category: "Pelatihan Standardisasi Bahasa (Preparation & Mock Test)",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    items: [
      { title: "TOEFL / IELTS Preparation Camp", desc: "Pelatihan 1-3 Bulan Intensif beserta Try Out (Mock Test) di akhir.", type: "Intensif" },
      { title: "TOAFL Preparation", desc: "Persiapan tembus Al-Azhar, Timur Tengah, atau LPDP (Tes Bahasa Arab).", type: "Preparation" },
      { title: "Simulasi Ujian Resmi", desc: "Layanan Tes TOEFL ITP Prediction dengan sertifikat langsung dari lembaga mitra.", type: "Mock Test" },
    ]
  },
  {
    category: "Pelatihan Profesi Kemendikbud/BNSP (Vokasi)",
    icon: Briefcase,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    items: [
      { title: "Pelatihan Juru Sembelih Halal (JULEHA)", desc: "Dilengkapi dengan Sertifikasi dari MUI.", type: "Sertifikasi" },
      { title: "Pelatihan & Sertifikasi Muthaowwif", desc: "Sertifikasi resmi untuk Pembimbing Haji & Umrah.", type: "Sertifikasi" },
      { title: "Pelatihan Barista & Manajemen Kedai Kopi", desc: "Cocok untuk dikelola oleh koperasi atau alumni pesantren.", type: "Vokasi" },
      { title: "Sertifikasi Digital Marketer", desc: "Sertifikasi resmi Digital Marketer dari BNSP.", type: "Sertifikasi BNSP" },
    ]
  },
  {
    category: "Bootcamp Scholarship (Supercamp Beasiswa)",
    icon: GraduationCap,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    items: [
      { title: "Mentoring Tembus LPDP / BPI", desc: "Dari persiapan berkas, esai, hingga mock-up interview.", type: "Mentoring" },
      { title: "Bootcamp Timur Tengah", desc: "Jalur persiapan PUSIBA, Kemenag, dan lainnya.", type: "Bootcamp" },
      { title: "Bootcamp Eropa & Turki", desc: "Persiapan Turkiye Burslari, Chevening, Erasmus+, dll.", type: "Bootcamp" },
    ]
  },
  {
    category: "Kaderisasi Ulama & Pedagogik (Tahassus)",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    items: [
      { title: "Sertifikasi Guru Ngaji", desc: "Sertifikasi Metode Qiraati / Iqro / Yanbua.", type: "Pedagogik" },
      { title: "Pelatihan Metodologi Dakwah", desc: "Pelatihan Metodologi Dakwah Kontemporer untuk era digital.", type: "Dakwah" },
      { title: "Standarisasi Imam Masjid", desc: "Pelatihan standarisasi Imam Masjid dan Pengelolaan DKM Profesional.", type: "Tahassus" },
    ]
  }
];

export default function TesPublicPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-teal-deep mb-4">
            Pusat Pelatihan & Sertifikasi
          </h1>
          <p className="text-lg text-muted-foreground">
            Tingkatkan kompetensi, raih beasiswa impian, dan dapatkan sertifikasi profesi resmi bersama Santri Mendunia.
          </p>
        </div>

        <div className="space-y-16">
          {programs.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <section key={idx}>
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                  <div className={`p-2 rounded-lg ${cat.bg}`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{cat.category}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border hover:border-teal/50 hover:shadow-lg transition-all p-6 flex flex-col group">
                      <div className="mb-4">
                        <Badge className="bg-teal/10 text-teal hover:bg-teal/20 border-none mb-3">{item.type}</Badge>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal transition-colors line-clamp-2">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm flex-grow">{item.desc}</p>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-50 text-teal-deep group-hover:bg-teal group-hover:text-white transition-colors">
                          Lihat Detail Program
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
