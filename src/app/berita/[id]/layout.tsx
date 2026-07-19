import { Metadata } from "next";
import { getDocument, getDocuments, where, COLLECTIONS } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let item: any = null;
  try {
    const routeId = decodeURIComponent(id);
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routeId)) {
      item = await getDocument(COLLECTIONS.news, routeId);
    } else {
      const items = await getDocuments(COLLECTIONS.news, [where("slug", "eq", routeId)]);
      item = items[0] || null;
    }
  } catch (error) {
    console.error("Failed to generate news metadata:", error);
    return {
      title: "Santri News",
      description: "Baca berita terkini di Santri Mendunia.",
    };
  }

  if (!item) {
    return { title: "Berita Tidak Ditemukan" };
  }

  return {
    title: item.title,
    description: item.summary || "Baca berita selengkapnya di Santri Mendunia.",
    openGraph: {
      title: item.title,
      description: item.summary || "Baca berita selengkapnya di Santri Mendunia.",
      images: item.imageUrl ? [item.imageUrl] : ["/logo.png"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary || "Baca berita selengkapnya di Santri Mendunia.",
      images: item.imageUrl ? [item.imageUrl] : ["/logo.png"],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
