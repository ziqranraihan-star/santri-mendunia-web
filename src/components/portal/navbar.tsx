"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainLinks = [
  { label: "Beranda", href: "/" },
  { label: "Santri News", href: "/berita" },
  { label: "Beasiswa", href: "/beasiswa" },
  { label: "Kursus", href: "/kursus" },
];

const dropdownLinks = [
  { label: "Pusat Pelatihan", href: "/tes" },
  { label: "Ruang Karya", href: "/ebook" },
  { label: "Info Pesantren", href: "/mentor" },
  { label: "Job & Magang", href: "/lowongan" },
  { label: "Tour & Travel", href: "/trip" },
  { label: "INKOPONTREN", href: "/produk" },
];

const rightLinks = [
  { label: "Donasi", href: "/donasi" },
  { label: "Tentang", href: "/tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-teal-deep">Santri Mendunia</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-teal-surface text-teal-deep"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Layanan */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Layanan <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === link.href
                        ? "bg-teal-surface text-teal-deep font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-teal-surface text-teal-deep"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block">
              <Button variant="outline" size="sm" className="border-teal text-teal hover:bg-teal-surface">
                Admin
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden border-t border-border/50 bg-white/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {[...mainLinks, ...dropdownLinks, ...rightLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-teal-surface text-teal-deep"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border/50">
                <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-teal">
                  Admin Panel →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
