"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { FullScreenLoader } from "@/components/ui/Loader";
import { BottomNav } from "@/components/shell/BottomNav";

// Shell das telas internas: garante onboarding concluído e monta a navegação.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const completed = useStore((s) => s.onboarding.completed);

  useEffect(() => {
    if (hydrated && !completed) router.replace("/onboarding");
  }, [hydrated, completed, router]);

  if (!hydrated || !completed) return <FullScreenLoader />;

  return (
    <div className="app-shell flex flex-col">
      <div className="flex-1 pb-2">{children}</div>
      <BottomNav />
    </div>
  );
}
