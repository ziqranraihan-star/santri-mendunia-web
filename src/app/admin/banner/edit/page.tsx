"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BannerForm from "@/components/admin/banner-form";
import { COLLECTIONS, getDocument } from "@/lib/supabase/client";

interface BannerValue {
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

function EditBannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [initialValue, setInitialValue] = useState<BannerValue | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      router.replace("/admin/banner");
      return;
    }

    void getDocument<BannerValue>(COLLECTIONS.banners, id)
      .then((banner) => {
        if (!banner) {
          setErrorMessage("Banner tidak ditemukan.");
          return;
        }
        setInitialValue({
          title: banner.title || "",
          imageUrl: banner.imageUrl || "",
          linkUrl: banner.linkUrl || "",
          isActive: banner.isActive ?? true,
        });
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Banner gagal dimuat.");
      });
  }, [id, router]);

  if (errorMessage) {
    return <div role="alert" className="text-sm text-destructive">{errorMessage}</div>;
  }
  if (!id || !initialValue) return <div>Memuat banner...</div>;

  return <BannerForm bannerId={id} initialValue={initialValue} />;
}

export default function EditBannerPage() {
  return (
    <Suspense fallback={<div>Memuat banner...</div>}>
      <EditBannerContent />
    </Suspense>
  );
}
