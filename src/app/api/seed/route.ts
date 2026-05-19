import { NextResponse } from "next/server";
import { createDocument, COLLECTIONS } from "@/lib/supabase/client";


const coursesData = [
  // A. Linguistik (Bahasa)
  {
    title: "Bahasa Arab Komunikasi (Untuk Umrah/Haji/Timur Tengah)",
    description: "Pelajari bahasa Arab praktis untuk kebutuhan komunikasi sehari-hari, sangat cocok bagi calon jamaah umrah, haji, atau santri yang bermimpi studi ke Timur Tengah. Kurikulum interaktif dengan native speaker.",
    type: "bahasa", level: "pemula", language: "Arab",
    price: 150000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["arab", "umrah", "timur tengah"]
  },
  {
    title: "Kaidah Nahwu & Shorof Terapan",
    description: "Metode cepat dan efektif membaca serta memahami Kitab Kuning. Pendekatan praktis yang mengubah teori tata bahasa Arab menjadi skill membaca teks gundul secara aplikatif.",
    type: "kitab_kuning", level: "menengah", language: "Arab",
    price: 200000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1590457631899-7833076bc120?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["nahwu", "shorof", "kitab kuning"]
  },
  {
    title: "Persiapan Wawancara Beasiswa dengan Bahasa Arab",
    description: "Latihan intensif menghadapi sesi wawancara beasiswa Timur Tengah (seperti Al-Azhar, KSA, dll). Simulasi realistik bersama mentor berpengalaman.",
    type: "soft_skill", level: "lanjutan", language: "Arab",
    price: 0, is_free: true, 
    thumbnail_url: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["beasiswa", "wawancara", "arab"]
  },
  {
    title: "English for Islamic Studies",
    description: "Kuasai kosakata dan frasa esensial untuk mendakwahkan Islam di kancah internasional. Membuka cakrawala pemahaman literatur Islam berbahasa Inggris.",
    type: "bahasa", level: "menengah", language: "Inggris",
    price: 250000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["inggris", "dakwah", "islamic studies"]
  },
  {
    title: "Basic Conversation untuk Pertukaran Pelajar",
    description: "Persiapkan diri Anda untuk program pertukaran pelajar internasional. Fokus pada percakapan sehari-hari, perkenalan budaya, dan survival English.",
    type: "bahasa", level: "pemula", language: "Inggris",
    price: 0, is_free: true, 
    thumbnail_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["conversation", "inggris", "exchange"]
  },
  {
    title: "Academic Writing: Menulis Esai Beasiswa",
    description: "Panduan langkah demi langkah membuat personal statement, motivation letter, dan esai akademik yang memikat komite beasiswa luar negeri.",
    type: "soft_skill", level: "lanjutan", language: "Inggris",
    price: 300000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["essay", "writing", "beasiswa"]
  },

  // B. Kewirausahaan (Wirausaha)
  {
    title: "Dasar-dasar Digital Marketing untuk Pesantren",
    description: "Pelajari cara memasarkan produk karya santri atau pesantren menggunakan Facebook, Instagram, dan TikTok Ads secara efektif dan efisien.",
    type: "wirausaha", level: "pemula", language: "Indonesia",
    price: 100000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["digital marketing", "ads", "bisnis"]
  },
  {
    title: "Manajemen Keuangan Syariah untuk Bisnis Pemula",
    description: "Tata kelola keuangan usaha skala kecil menengah (UMKM) dengan prinsip-prinsip ekonomi syariah yang transparan dan bebas riba.",
    type: "wirausaha", level: "menengah", language: "Indonesia",
    price: 120000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["keuangan", "syariah", "bisnis"]
  },
  {
    title: "Copywriting Islami: Berjualan Tanpa Melanggar Syariat",
    description: "Teknik menulis teks iklan (copywriting) yang menghipnotis pembaca namun tetap mengedepankan etika bisnis Islam, tanpa overclaim dan tipu daya.",
    type: "wirausaha", level: "pemula", language: "Indonesia",
    price: 0, is_free: true, 
    thumbnail_url: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["copywriting", "bisnis", "marketing"]
  },
  {
    title: "Ekspor Produk Lokal: Pesantren Menembus Pasar Global",
    description: "Strategi komprehensif mengekspor produk lokal pesantren. Pahami regulasi, perizinan, dan cara mencari buyer internasional.",
    type: "wirausaha", level: "lanjutan", language: "Indonesia",
    price: 500000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["ekspor", "bisnis global"]
  },

  // C. Digital & Media Kreatif
  {
    title: "Desain Grafis Dasar untuk Dakwah",
    description: "Tingkatkan kualitas visual dakwah Anda! Belajar desain grafis menggunakan Canva dan Adobe Illustrator khusus untuk konten media sosial Islami.",
    type: "digital", level: "pemula", language: "Indonesia",
    price: 80000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["desain", "dakwah visual", "canva"]
  },
  {
    title: "Video Editing untuk Konten Santri",
    description: "Pelatihan mengedit video yang sinematik dan menarik menggunakan CapCut dan Premiere Pro, cocok untuk membuat Santri News atau vlog pesantren.",
    type: "digital", level: "menengah", language: "Indonesia",
    price: 150000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["video editing", "capcut", "konten kreator"]
  },
  {
    title: "Pemrograman (Coding) Dasar Web Pesantren",
    description: "Mulai karir di dunia teknologi! Belajar dasar-dasar HTML, CSS, dan Javascript untuk membangun profil website lembaga atau pesantren.",
    type: "digital", level: "pemula", language: "Indonesia",
    price: 250000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["coding", "website", "pemrograman"]
  },
  {
    title: "Prompt Engineering: Bijak Menggunakan AI",
    description: "Kuasai cara memberikan perintah (prompt) yang tepat ke ChatGPT dan AI lainnya. Optimalkan produktivitas riset dan dakwah tanpa kehilangan orisinalitas.",
    type: "digital", level: "pemula", language: "Indonesia",
    price: 0, is_free: true, 
    thumbnail_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["ai", "chatgpt", "prompt engineering"]
  },

  // D. Soft Skills
  {
    title: "Public Speaking & Retorika Dakwah Modern",
    description: "Atasi rasa gugup dan tampil percaya diri di depan umum. Pelajari teknik vokal, body language, dan penyusunan materi dakwah yang persuasif.",
    type: "soft_skill", level: "menengah", language: "Indonesia",
    price: 120000, is_free: false, 
    thumbnail_url: "https://images.unsplash.com/photo-1475721028070-2051152d1b11?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["public speaking", "dakwah", "komunikasi"]
  },
  {
    title: "Leadership: Manajemen Keorganisasian Pesantren",
    description: "Membangun karakter kepemimpinan transformasional. Pelajari cara mengelola tim, mengatasi konflik, dan menggerakkan roda organisasi (OSIS/BEM/Pesantren).",
    type: "soft_skill", level: "menengah", language: "Indonesia",
    price: 0, is_free: true, 
    thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    is_active: true, tags: ["leadership", "kepemimpinan", "organisasi"]
  },
];

const testsData = [
  // A. Preparation & Mock Test
  {
    title: "TOEFL / IELTS Preparation Camp",
    description: "Pelatihan 1-3 Bulan Intensif beserta Try Out (Mock Test) di akhir. Kami akan mendampingi Anda mencapai skor target untuk beasiswa luar negeri.",
    type: "Bootcamp", price: 1500000,
    thumbnail_url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop",
    total_questions: 120, duration: 180, is_active: true
  },
  {
    title: "TOAFL Preparation (Tes Bahasa Arab)",
    description: "Persiapan intensif tembus Universitas Al-Azhar Mesir, kampus Timur Tengah, atau LPDP Kemenag. Terdiri dari bedah soal dan simulasi komprehensif.",
    type: "Bootcamp", price: 1200000,
    thumbnail_url: "https://images.unsplash.com/photo-1601002241604-5825bc546ea4?q=80&w=600&auto=format&fit=crop",
    total_questions: 100, duration: 120, is_active: true
  },
  {
    title: "Simulasi Ujian Resmi TOEFL ITP Prediction",
    description: "Layanan tes TOEFL ITP Prediction online dengan output sertifikat langsung dari lembaga mitra resmi Santri Mendunia. Sangat akurat dan kredibel.",
    type: "TOEFL", price: 200000,
    thumbnail_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    total_questions: 140, duration: 115, is_active: true
  },

  // B. Pelatihan Profesi BNSP (Vokasi)
  {
    title: "Pelatihan Juru Sembelih Halal (JULEHA) + Sertifikasi MUI",
    description: "Sertifikasi resmi BNSP dan MUI untuk Juru Sembelih Halal. Menjamin kompetensi santri dalam memenuhi standar syariah dan kesehatan daging potong.",
    type: "Sertifikasi", price: 850000,
    thumbnail_url: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Pelatihan & Sertifikasi Muthaowwif",
    description: "Standarisasi kompetensi sebagai Pembimbing Haji & Umrah (Muthaowwif). Mencakup fiqih manasik, public speaking, dan manajemen krisis di tanah suci.",
    type: "Sertifikasi", price: 1000000,
    thumbnail_url: "https://images.unsplash.com/photo-1565552643954-1eb033b0ec71?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Pelatihan Barista & Manajemen Kedai Kopi",
    description: "Vocational training meracik kopi (Barista) dan mengelola bisnis kafe. Sangat relevan untuk dikembangkan sebagai unit usaha koperasi atau alumni pesantren.",
    type: "Sertifikasi", price: 500000,
    thumbnail_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Sertifikasi Digital Marketer BNSP",
    description: "Uji kompetensi resmi dari Badan Nasional Sertifikasi Profesi (BNSP) di bidang pemasaran digital. Buktikan keahlian Anda dengan sertifikat berlogo garuda.",
    type: "Sertifikasi", price: 950000,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    total_questions: 50, duration: 90, is_active: true
  },

  // C. Bootcamp Scholarship
  {
    title: "Supercamp LPDP / BPI (Biasiswa Pendidikan Indonesia)",
    description: "Mentoring eksklusif dan privat untuk menembus LPDP! Mulai dari persiapan berkas administrasi, review esai berulang kali, hingga mock-up interview dengan Awardee.",
    type: "Bootcamp", price: 2500000,
    thumbnail_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Bootcamp Timur Tengah (Jalur PUSIBA & Kemenag)",
    description: "Program asrama (offline/online) super intensif untuk seleksi beasiswa Kemenag RI (Mesir, Maroko, Sudan) dan persiapan kelas bahasa PUSIBA.",
    type: "Bootcamp", price: 3000000,
    thumbnail_url: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Bootcamp Eropa & Turki",
    description: "Bimbingan khusus mendaftar Turkiye Burslari Scholarship (YTB), Chevening (Inggris), dan Erasmus+ (Eropa). Bedah profil jurusan dan motivation letter.",
    type: "Bootcamp", price: 2000000,
    thumbnail_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },

  // D. Kaderisasi Ulama & Pedagogik
  {
    title: "Sertifikasi Guru Ngaji (Metode Qiraati/Iqro/Yanbua)",
    description: "Pelatihan standarisasi cara mengajar Al-Quran yang menyenangkan dan tartil, diakhiri dengan ujian Syahadah (Sertifikat mengajar resmi).",
    type: "Kaderisasi", price: 350000,
    thumbnail_url: "https://images.unsplash.com/photo-1609599006353-e629aaab315a?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Pelatihan Metodologi Dakwah Kontemporer",
    description: "Membekali dai dan asatidz dengan cara-cara pendekatan dakwah kultural dan sosiologis di masyarakat modern dan urban.",
    type: "Kaderisasi", price: 150000,
    thumbnail_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  },
  {
    title: "Standarisasi Imam Masjid dan Manajemen DKM",
    description: "Pelatihan profesional mengelola Dewan Kemakmuran Masjid (DKM). Dari manajemen kas, program kajian unggulan, hingga standar tahsin bagi Imam Rawatib.",
    type: "Kaderisasi", price: 200000,
    thumbnail_url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600&auto=format&fit=crop",
    total_questions: 0, duration: 0, is_active: true
  }
];

export async function GET() {
  try {
    let coursesAdded = 0;
    let testsAdded = 0;

    // Seed Courses
    for (const item of coursesData) {
      await createDocument(COLLECTIONS.courses, {
        ...item,
        mentor_id: "",
        total_lessons: 0,
        total_duration: 0,
        enrolled_count: 0,
        rating: 0,
        is_featured: false,
        created_at: new Date().toISOString(),
      });
      coursesAdded++;
    }

    // Seed Tests (Pusat Pelatihan)
    for (const item of testsData) {
      await createDocument(COLLECTIONS.tests, {
        ...item,
        created_at: new Date().toISOString(),
      });
      testsAdded++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil menginjeksi ${coursesAdded} kursus dan ${testsAdded} pelatihan/sertifikasi!` 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
