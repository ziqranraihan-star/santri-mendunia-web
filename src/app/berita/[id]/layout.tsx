import { Metadata } from "next";
import { getDocument, getDocuments, where, COLLECTIONS } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let item: any = null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    item = await getDocument(COLLECTIONS.news, id);
  } else {
    const items = await getDocuments(COLLECTIONS.news, [where("slug", "eq", id)]);
    item = items[0] || null;
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
