"use client";
import Navbar from "@/components/portal/navbar";
import Footer from "@/components/portal/footer";
import { Badge } from "@/components/ui/badge";
import {
  Award, BookOpen, Briefcase, GraduationCap, Users,
  CheckCircle, Clock, FileText, Star, ChevronRight, Phone
} from "lucide-react";
import { useState } from "react";

// ─── Data Lengkap Program ─────────────────────────────────────────────────────
const programs = [
  {
    id: "bahasa",
    category: "A. Pelatihan Standardisasi Bahasa",
    subtitle: "Preparation & Mock Test",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    border: "border-blue-200",
    items: [
      {
        title: "TOEFL / IELTS Preparation Camp",
        type: "Intensif",
        typeColor: "bg-blue-100 text-blue-700",
        duration: "1–3 Bulan",
        sessions: "24–72 Sesi",
        level: "Intermediate – Advanced",
        description:
          "Program persiapan intensif TOEFL ITP/iBT dan IELTS Academic yang mencakup seluruh section: Listening, Reading, Writing, dan Speaking. Dirancang khusus untuk santri dan mahasiswa yang ingin menembus persyaratan beasiswa LPDP, BPI, dan universitas luar negeri.",
        highlights: [
          "Modul lengkap 4 skill: Listening, Reading, Writing, Speaking",
          "Try Out (Mock Test) resmi di akhir program",
          "Target minimal TOEFL 500+ / IELTS 6.0+",
          "Kelas kecil maksimal 15 peserta",
          "Tutor berpengalaman LPDP & certified examiner",
          "Materi digital + rekaman sesi",
        ],
        syllabus: [
          "Minggu 1–2: Diagnostik awal & Foundation Skills",
          "Minggu 3–6: Core Training per skill",
          "Minggu 7–10: Exam Strategy & Practice Test",
          "Minggu 11–12: Mock Test Final & Review",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "TOAFL Preparation",
        type: "Preparation",
        typeColor: "bg-sky-100 text-sky-700",
        duration: "4–8 Minggu",
        sessions: "16–32 Sesi",
        level: "Menengah – Mahir",
        description:
          "Persiapan intensif Tes Kemampuan Bahasa Arab (TOAFL) yang menjadi syarat masuk Al-Azhar Mesir, beasiswa Kemenag Timur Tengah, dan LPDP Program Afirmasi. Kurikulum mencakup Nahwu, Sharaf, Mufrodat, Qira'ah, Istima', dan Kitabah resmi.",
        highlights: [
          "Fokus Istima', Qira'ah, Kitabah & Kalam",
          "Target skor TOAFL 450+ (setara B2 Arab)",
          "Mentor alumni Al-Azhar & LIPIA berpengalaman",
          "Latihan soal dari bank soal TOAFL resmi",
          "Bimbingan pendaftaran beasiswa Arab",
          "Sertifikat kelulusan program",
        ],
        syllabus: [
          "Pekan 1–2: Qawa'id & Mufrodat Dasar Akademis",
          "Pekan 3–5: Maharat Istima' & Qira'ah",
          "Pekan 6–7: Maharat Kitabah & Kalam",
          "Pekan 8: Simulasi & Evaluasi Akhir",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Simulasi Ujian TOEFL ITP Prediction",
        type: "Mock Test",
        typeColor: "bg-indigo-100 text-indigo-700",
        duration: "1 Hari",
        sessions: "1 Sesi Ujian Lengkap",
        level: "Semua Level",
        description:
          "Layanan tes TOEFL ITP Prediction Score resmi dengan sertifikat dari lembaga mitra Santri Mendunia. Cocok untuk keperluan melamar beasiswa, persyaratan kampus, atau mengukur kemampuan bahasa Inggris secara resmi sebelum mendaftar ujian asli.",
        highlights: [
          "Sertifikat prediction score resmi dari lembaga mitra",
          "Format ujian identik dengan TOEFL ITP asli",
          "3 section: Listening, Structure, Reading",
          "Hasil & analisis per section diberikan hari itu juga",
          "Dapat digunakan untuk pendaftaran LPDP/BPI",
          "Tempat terbatas, pendaftaran wajib H-3",
        ],
        syllabus: [
          "07.30 – 08.00: Registrasi & Briefing",
          "08.00 – 10.00: Pelaksanaan Ujian (3 Section)",
          "10.00 – 11.00: Koreksi & Analisis",
          "11.00: Penerimaan Sertifikat Prediction Score",
        ],
        price: "Hubungi Admin",
      },
    ],
  },
  {
    id: "profesi",
    category: "B. Pelatihan Profesi Kemendikbud/BNSP",
    subtitle: "Vokasi & Sertifikasi",
    icon: Briefcase,
    color: "text-orange-600",
    bg: "bg-orange-600/10",
    border: "border-orange-200",
    items: [
      {
        title: "Pelatihan Juru Sembelih Halal (JULEHA)",
        type: "Sertifikasi MUI",
        typeColor: "bg-orange-100 text-orange-700",
        duration: "3–5 Hari",
        sessions: "40 Jam Pelatihan",
        level: "Semua Level",
        description:
          "Pelatihan Juru Sembelih Halal (JULEHA) yang mengacu pada standar MUI dan SNI, lengkap dengan sertifikasi resmi. Program ini sangat relevan bagi santri yang ingin bekerja di rumah pemotongan hewan, restoran halal, eksportir daging, atau membuka usaha kuliner halal.",
        highlights: [
          "Sertifikasi resmi dari MUI",
          "Materi syariat & teknis penyembelihan halal",
          "Praktek langsung di fasilitas RPA/RPH mitra",
          "Materi animal welfare & standar ekspor",
          "Diakui di pasar lokal & internasional",
          "Bonus: Materi manajemen usaha kuliner halal",
        ],
        syllabus: [
          "Hari 1: Fiqh Penyembelihan & Syarat Halal",
          "Hari 2–3: Teknis Penyembelihan & Higiene Pangan",
          "Hari 4: Praktek Lapangan (Supervised)",
          "Hari 5: Ujian Kompetensi & Sertifikasi",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Pelatihan & Sertifikasi Muthaowwif",
        type: "Sertifikasi BNSP",
        typeColor: "bg-amber-100 text-amber-700",
        duration: "5–7 Hari",
        sessions: "50 Jam Pelatihan",
        level: "Semua Level",
        description:
          "Program sertifikasi Pembimbing Haji & Umrah (Muthaowwif) yang terstandarisasi oleh BNSP dan Kemenag RI. Menjadi panduan profesional bagi calon pembimbing agar mampu memberikan pelayanan ibadah haji dan umrah yang aman, nyaman, dan sesuai syariat.",
        highlights: [
          "Sertifikasi resmi BNSP & diakui Kemenag",
          "Fiqh Haji & Umrah komprehensif",
          "Manajemen jamaah & kedaruratan",
          "Praktek simulasi manasik & bimbingan",
          "Etika profesi & komunikasi efektif",
          "Peluang bergabung dengan biro travel mitra",
        ],
        syllabus: [
          "Hari 1–2: Fiqh & Regulasi Haji/Umrah",
          "Hari 3: Manajemen Jamaah & Logistik",
          "Hari 4: Simulasi Manasik & Praktik Bimbingan",
          "Hari 5–6: K3 Jamaah & Penanganan Darurat",
          "Hari 7: Ujian Kompetensi & Sertifikasi BNSP",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Pelatihan Barista & Manajemen Kedai Kopi",
        type: "Vokasi",
        typeColor: "bg-yellow-100 text-yellow-700",
        duration: "3–5 Hari",
        sessions: "30 Jam Pelatihan",
        level: "Pemula – Menengah",
        description:
          "Pelatihan barista profesional plus manajemen bisnis kedai kopi yang dirancang untuk alumni pesantren, koperasi santri, dan wirausahawan muda. Program ini mencakup teknik menyeduh kopi hingga strategi pengelolaan kedai yang profitable.",
        highlights: [
          "Teknik brewing manual & mesin espresso",
          "Latte art dasar hingga menengah",
          "Manajemen menu, harga, & stok",
          "Strategi pemasaran digital untuk kedai kopi",
          "Cocok untuk koperasi & BUMDES pesantren",
          "Sertifikat kompetensi barista",
        ],
        syllabus: [
          "Hari 1: Pengenalan Kopi & Cupping Session",
          "Hari 2: Teknik Brewing & Pengoperasian Mesin",
          "Hari 3: Latte Art & Menu Development",
          "Hari 4: Manajemen Kedai & Keuangan Dasar",
          "Hari 5: Praktik Final & Penilaian",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Sertifikasi Digital Marketer BNSP",
        type: "Sertifikasi BNSP",
        typeColor: "bg-rose-100 text-rose-700",
        duration: "3–5 Hari",
        sessions: "30–40 Jam",
        level: "Menengah",
        description:
          "Program persiapan sertifikasi Digital Marketer dari BNSP yang mencakup seluruh unit kompetensi: Social Media Marketing, SEO, Content Creation, hingga Analitik Digital. Sangat relevan bagi santri yang ingin berkarir di industri digital atau membuka jasa digital marketing.",
        highlights: [
          "Sertifikat BNSP diakui secara nasional",
          "SEO, SEM, Social Media & Email Marketing",
          "Analitik Google Analytics & Meta Ads",
          "Praktik langsung mengelola kampanye nyata",
          "Strategi konten Islami & branding pesantren",
          "Kelas dipersiapkan untuk Uji Kompetensi LSP",
        ],
        syllabus: [
          "Hari 1: Digital Marketing Landscape & Strategi",
          "Hari 2: Social Media & Content Marketing",
          "Hari 3: SEO & SEM Praktikal",
          "Hari 4: Analytics, Reporting & Optimasi",
          "Hari 5: Simulasi Uji Kompetensi BNSP",
        ],
        price: "Hubungi Admin",
      },
    ],
  },
  {
    id: "bootcamp",
    category: "C. Bootcamp Scholarship",
    subtitle: "Supercamp Beasiswa",
    icon: GraduationCap,
    color: "text-teal-600",
    bg: "bg-teal-600/10",
    border: "border-teal-200",
    items: [
      {
        title: "Mentoring Tembus LPDP / BPI",
        type: "Mentoring",
        typeColor: "bg-teal-100 text-teal-700",
        duration: "4–8 Minggu",
        sessions: "32 Sesi Intensif",
        level: "Sarjana / Magister",
        description:
          "Program mentoring end-to-end untuk menembus beasiswa LPDP dan Beasiswa Pemerintah Indonesia (BPI). Dipandu oleh alumni LPDP yang telah berhasil. Mencakup seluruh tahapan seleksi: berkas, wawancara, hingga Leaderless Group Discussion (LGD).",
        highlights: [
          "Pendampingan dari alumni LPDP aktif",
          "Review esai beasiswa 1-on-1",
          "Mock interview dan mock LGD berkali-kali",
          "Strategi pemilihan kampus & program studi",
          "Panduan pendaftaran online lengkap",
          "Grup alumni untuk networking pasca lolos",
        ],
        syllabus: [
          "Fase 1: Self Assessment & Goal Setting",
          "Fase 2: Persiapan Berkas (CV, Esai, Rencana Studi)",
          "Fase 3: Simulasi Seleksi Administrasi",
          "Fase 4: Mock Interview & LGD (Berulang)",
          "Fase 5: Finalisasi & Pendampingan Daftar Ulang",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Bootcamp Timur Tengah",
        type: "Bootcamp",
        typeColor: "bg-green-100 text-green-700",
        duration: "3–6 Minggu",
        sessions: "24 Sesi + Praktek",
        level: "Lulusan Pesantren / MA",
        description:
          "Program persiapan khusus jalur beasiswa ke Timur Tengah: PUSIBA Mesir, Beasiswa Kemenag, Kerajaan Arab Saudi, dan program bilateral lainnya. Difokuskan pada penguasaan Bahasa Arab akademis, psikotes, dan wawancara dengan atase pendidikan.",
        highlights: [
          "Materi Bahasa Arab akademis & percakapan",
          "Simulasi wawancara dengan atase pendidikan",
          "Psikotes & tes logika standar",
          "Praktek TOAFL dan sertifikasi bahasa Arab",
          "Panduan berkas: ijazah, transkrip, rekomendasi",
          "Info jalur PUSIBA, Kemenag, Azhar, & swasta",
        ],
        syllabus: [
          "Minggu 1–2: Arabic Academic Language",
          "Minggu 3: Psikotes & Tes Logika",
          "Minggu 4: Persiapan Berkas & Esai",
          "Minggu 5: Mock Interview Bahasa Arab",
          "Minggu 6: TOAFL Prediction Test",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Bootcamp Eropa & Turki",
        type: "Bootcamp",
        typeColor: "bg-cyan-100 text-cyan-700",
        duration: "6–10 Minggu",
        sessions: "40 Sesi Intensif",
        level: "Sarjana – S2",
        description:
          "Persiapan komprehensif untuk beasiswa bergengsi: Turkiye Burslari (YTB), Chevening (UK), Erasmus Mundus (EU), dan beasiswa bilateral Eropa lainnya. Mencakup IELTS preparation, motivation letter, personal statement, sampai mock interview dalam Bahasa Inggris.",
        highlights: [
          "Persiapan IELTS 6.0+ terintegrasi",
          "Workshop penulisan Motivation Letter & SOP",
          "Mock interview panel Bahasa Inggris",
          "Strategi riset kampus & program terbaik",
          "Networking dengan alumni Turki, Eropa aktif",
          "Panduan visa & pra-keberangkatan",
        ],
        syllabus: [
          "Fase 1: IELTS Intensif & Target Skor",
          "Fase 2: Research Proposal & Personal Statement",
          "Fase 3: Motivation Letter & CV Akademik",
          "Fase 4: Mock Interview Panel Bahasa Inggris",
          "Fase 5: Pendaftaran Online & Finalisasi Berkas",
        ],
        price: "Hubungi Admin",
      },
    ],
  },
  {
    id: "kaderisasi",
    category: "D. Kaderisasi Ulama & Pedagogik",
    subtitle: "Tahassus",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    border: "border-purple-200",
    items: [
      {
        title: "Sertifikasi Guru Ngaji",
        type: "Pedagogik",
        typeColor: "bg-purple-100 text-purple-700",
        duration: "5–7 Hari",
        sessions: "50 Jam Pelatihan",
        level: "Semua Ustaz/Ustazah",
        description:
          "Program sertifikasi dan standarisasi metode pengajaran Al-Qur'an mencakup metode Qiraati, Iqro, dan Yanbua. Ditujukan bagi para ustaz dan ustazah yang ingin mendapatkan ijazah resmi pengajaran dari lembaga yang berwenang.",
        highlights: [
          "Ijazah resmi metode Qiraati / Iqro / Yanbua",
          "Standarisasi makharijul huruf & tajwid",
          "Teknik mengajar anak usia dini & dewasa",
          "Manajemen TPQ/TPA yang efektif",
          "Psikologi belajar Al-Qur'an anak",
          "Sertifikat kompetensi pengajar resmi",
        ],
        syllabus: [
          "Hari 1–2: Fiqh Al-Qur'an & Ilmu Tajwid Lanjutan",
          "Hari 3: Metodologi Pengajaran Qiraati/Iqro/Yanbua",
          "Hari 4: Teknik Mengajar & Manajemen Kelas",
          "Hari 5–6: Micro Teaching & Evaluasi",
          "Hari 7: Ujian Kompetensi & Penyerahan Ijazah",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Pelatihan Metodologi Dakwah Kontemporer",
        type: "Dakwah",
        typeColor: "bg-fuchsia-100 text-fuchsia-700",
        duration: "3–5 Hari",
        sessions: "24 Jam Pelatihan",
        level: "Da'i Muda – Berpengalaman",
        description:
          "Pelatihan intensif metodologi dakwah yang relevan dengan tantangan era digital dan isu kontemporer. Peserta dibekali dengan teknik public speaking, penguasaan media digital, cara menghadapi isu-isu aktual dengan pendekatan fiqh yang bijak dan kontekstual.",
        highlights: [
          "Teknik public speaking & storytelling dakwah",
          "Dakwah digital: YouTube, Instagram, TikTok",
          "Fiqh Dakwah & pendekatan lintas komunitas",
          "Cara merespon isu kontroversial secara bijak",
          "Manajemen majelis taklim modern",
          "Sertifikat kecakapan da'i dari Santri Mendunia",
        ],
        syllabus: [
          "Hari 1: Metodologi Dakwah dalam Al-Qur'an & Sunnah",
          "Hari 2: Public Speaking & Retorika Dakwah",
          "Hari 3: Dakwah Digital & Pembuatan Konten",
          "Hari 4: Simulasi Ceramah & Isu Kontemporer",
          "Hari 5: Evaluasi & Sertifikasi",
        ],
        price: "Hubungi Admin",
      },
      {
        title: "Standarisasi Imam Masjid & Pengelolaan DKM",
        type: "Tahassus",
        typeColor: "bg-violet-100 text-violet-700",
        duration: "3 Hari",
        sessions: "24 Jam Pelatihan",
        level: "Imam Masjid & Pengurus DKM",
        description:
          "Program pelatihan dan standarisasi kompetensi Imam Masjid serta manajemen Dewan Kemakmuran Masjid (DKM) secara profesional. Mencakup aspek ibadah, kepemimpinan, administrasi keuangan masjid, hingga program pemberdayaan jamaah.",
        highlights: [
          "Standar bacaan shalat & hafalan imam",
          "Fiqh Imam: hukum-hukum keimaman",
          "Manajemen keuangan & administrasi masjid",
          "Program pemberdayaan ekonomi jamaah",
          "Strategi mengaktifkan kaum muda di masjid",
          "Sertifikat standarisasi imam dari MUI/Kemenag mitra",
        ],
        syllabus: [
          "Hari 1: Fiqh Imam & Standar Ibadah",
          "Hari 2: Leadership & Manajemen DKM Profesional",
          "Hari 3: Program Masjid & Pemberdayaan Jamaah",
        ],
        price: "Hubungi Admin",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
function ProgramCard({ item, catColor }: { item: typeof programs[0]["items"][0]; catColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden ${open ? "shadow-xl" : ""}`}>
      <div className="p-6 flex-1">
        <Badge className={`${item.typeColor} border-none text-xs font-semibold mb-3`}>{item.type}</Badge>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal transition-colors mb-3 leading-snug">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
          <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {item.sessions}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {item.level}</span>
        </div>

        {/* Toggle Detail */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
        >
          {open ? "Sembunyikan Detail" : "Lihat Detail Program"}
          <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>

        {open && (
          <div className="mt-5 space-y-4 border-t pt-4">
            {/* Highlights */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Yang Akan Kamu Dapatkan</p>
              <ul className="space-y-1.5">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {/* Syllabus */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Silabus</p>
              <ol className="space-y-1.5 list-none">
                {item.syllabus.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-teal/10 text-teal text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <a
          href="https://wa.me/6281234567890?text=Halo%20Santri%20Mendunia%2C%20saya%20ingin%20mendaftar%20program%20"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm bg-teal text-white hover:bg-teal-dark transition-colors"
        >
          <Phone className="w-4 h-4" /> Daftar Sekarang
        </a>
      </div>
    </div>
  );
}

export default function TesPublicPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        {/* Hero */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-teal-deep mb-4">
            Pusat Pelatihan & Sertifikasi
          </h1>
          <p className="text-lg text-muted-foreground">
            Tingkatkan kompetensi, raih beasiswa impian, dan dapatkan sertifikasi profesi resmi bersama Santri Mendunia.
          </p>

          {/* Quick Nav */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {programs.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:shadow-md ${p.bg} ${p.color} border-current/20`}
              >
                {p.subtitle}
              </a>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div className="space-y-20">
          {programs.map((cat) => {
            const Icon = cat.icon;
            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className={`flex items-center gap-3 mb-8 p-4 rounded-2xl border ${cat.border} ${cat.bg}`}>
                  <div className={`p-2.5 rounded-xl bg-white shadow-sm`}>
                    <Icon className={`w-7 h-7 ${cat.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{cat.category}</h2>
                    <p className={`text-sm font-medium ${cat.color}`}>{cat.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, i) => (
                    <ProgramCard key={i} item={item} catColor={cat.color} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA Bottom */}
        <div className="mt-20 bg-gradient-to-r from-teal-deep to-teal rounded-3xl p-10 text-center text-white">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Siap Meningkatkan Kompetensimu?</h2>
          <p className="text-white/80 mb-6">Konsultasikan program yang sesuai dengan tujuanmu bersama tim Santri Mendunia.</p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Santri%20Mendunia%2C%20saya%20ingin%20konsultasi%20program%20pelatihan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-teal-deep font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Phone className="w-5 h-5" /> Konsultasi Gratis via WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
