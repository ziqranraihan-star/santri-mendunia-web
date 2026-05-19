import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Santri Mendunia — Dari Pesantren untuk Dunia",
    template: "%s | Santri Mendunia",
  },
  description:
    "Portal berita, beasiswa, kursus, dan pengembangan santri Indonesia. Dari pesantren untuk dunia.",
  keywords: [
    "santri",
    "pesantren",
    "beasiswa",
    "kursus",
    "LPDP",
    "berita santri",
    "pendidikan Islam",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Santri Mendunia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cairo.variable}>
      <body className="antialiased">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
