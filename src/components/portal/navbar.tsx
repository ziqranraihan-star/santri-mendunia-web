"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDocuments, COLLECTIONS } from "@/lib/supabase/client";

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

interface SearchResult {
  id: string;
  title: string;
  type: string;
  href: string;
  subtitle?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open search with keyboard shortcut Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  // Search across all content types
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const q = query.toLowerCase();
        const [news, scholarships, courses, jobs, ebooks, trips] = await Promise.all([
          getDocuments(COLLECTIONS.news, [], 50),
          getDocuments(COLLECTIONS.scholarships, [], 50),
          getDocuments(COLLECTIONS.courses, [], 50),
          getDocuments(COLLECTIONS.jobs, [], 50),
          getDocuments(COLLECTIONS.ebooks, [], 50),
          getDocuments(COLLECTIONS.trips, [], 50),
        ]);
        const all: SearchResult[] = [
          ...news.filter((i: any) => i.title?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "📰 Berita", href: `/berita/${i.id}`, subtitle: i.summary,
          })),
          ...scholarships.filter((i: any) => i.title?.toLowerCase().includes(q) || i.provider?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "🎓 Beasiswa", href: `/beasiswa/${i.id}`, subtitle: i.provider,
          })),
          ...courses.filter((i: any) => i.title?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "📚 Kursus", href: `/kursus/${i.id}`, subtitle: i.description,
          })),
          ...jobs.filter((i: any) => i.title?.toLowerCase().includes(q) || i.company?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "💼 Lowongan", href: `/lowongan/${i.id}`, subtitle: i.company,
          })),
          ...ebooks.filter((i: any) => i.title?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "📖 E-Book", href: `/ebook/${i.id}`, subtitle: i.author,
          })),
          ...trips.filter((i: any) => i.title?.toLowerCase().includes(q)).map((i: any) => ({
            id: i.id, title: i.title, type: "✈️ Trip", href: `/trip/${i.id}`, subtitle: i.destination,
          })),
        ];
        setResults(all.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Santri Mendunia"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
              <span className="text-lg font-bold text-teal-deep hidden sm:block">Santri Mendunia</span>
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

            {/* Search + Admin + Mobile Toggle */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-teal/50 hover:bg-teal-surface/30 transition-all duration-200 text-sm"
                aria-label="Cari konten"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:block">Cari...</span>
                <span className="hidden lg:flex items-center gap-0.5 text-xs bg-muted rounded px-1.5 py-0.5 font-mono text-muted-foreground">
                  ⌘K
                </span>
              </button>

              {/* Admin Button (desktop only) */}
              <Link href="/login" className="hidden md:block">
                <Button variant="outline" size="sm" className="border-teal text-teal hover:bg-teal-surface font-semibold">
                  Admin
                </Button>
              </Link>

              {/* Mobile toggle */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {open && (
            <div className="md:hidden border-t border-border/50 bg-white/95 backdrop-blur-lg">
              <div className="px-4 pt-2 pb-4 space-y-1">
                {/* Mobile Search */}
                <button
                  onClick={() => { setOpen(false); setSearchOpen(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted transition-colors text-sm mb-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari beasiswa, kursus, berita...</span>
                </button>

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

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div
            ref={searchRef}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
            style={{ animation: "slideDown 0.2s ease-out" }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
              <Search className="w-5 h-5 text-teal flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari beasiswa, kursus, berita, lowongan..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults([]); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); setResults([]); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1"
              >
                Esc
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searching && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Mencari...
                </div>
              )}

              {!searching && query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-muted-foreground text-sm">Tidak ada hasil untuk <strong>&ldquo;{query}&rdquo;</strong></p>
                </div>
              )}

              {!searching && results.length > 0 && (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result.href)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-teal-surface/50 transition-colors text-left group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-teal bg-teal-surface px-2 py-0.5 rounded-full">{result.type}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-teal-deep truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{result.subtitle}</p>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs mt-1 flex-shrink-0">→</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Links when no query */}
              {!query && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Jelajahi Cepat</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "🎓 Beasiswa", href: "/beasiswa" },
                      { label: "📚 Kursus Online", href: "/kursus" },
                      { label: "📰 Santri News", href: "/berita" },
                      { label: "💼 Lowongan Kerja", href: "/lowongan" },
                      { label: "📖 E-Book", href: "/ebook" },
                      { label: "✈️ Tour & Travel", href: "/trip" },
                    ].map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleSelect(item.href)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/60 hover:bg-teal-surface hover:border-teal/30 transition-all text-sm font-medium text-foreground text-left"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
