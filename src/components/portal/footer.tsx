import Link from "next/link";
import { Sparkles } from "lucide-react";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/santrimenduniaofficial", icon: "📸" },
  { label: "TikTok", href: "https://www.tiktok.com/@santrimenduniaofficial", icon: "🎵" },
  { label: "YouTube", href: "https://youtube.com/@santrimenduniatv", icon: "▶️" },
  { label: "WhatsApp", href: "https://wa.me/6282298409860", icon: "💬" },
];

const links = [
  { title: "Menu", items: [
    { label: "Beranda", href: "/" },
    { label: "Berita", href: "/berita" },
    { label: "Beasiswa", href: "/beasiswa" },
    { label: "Kursus", href: "/kursus" },
  ]},
  { title: "Layanan", items: [
    { label: "Donasi", href: "/donasi" },
    { label: "Tour & Travel", href: "#" },
    { label: "INKOPONTREN", href: "#" },
    { label: "Job & Magang", href: "#" },
  ]},
  { title: "Informasi", items: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Kontak", href: "/tentang#kontak" },
    { label: "Admin Panel", href: "/login" },
    { label: "Download App", href: "#" },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-teal-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <span className="text-lg font-bold">Santri Mendunia</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Dari pesantren untuk dunia. Platform edukasi, beasiswa, dan pemberdayaan santri Indonesia.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-sm" title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          {links.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold mb-3 text-gold">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-white/50">© 2026 Santri Mendunia. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
