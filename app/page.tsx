"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { FullScreenLoader } from "@/components/ui/Loader";

// Gate de entrada: aguarda a hidratação do store (localStorage) e direciona
// para o onboarding (se incompleto) ou para o dashboard.
export default function Home() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const completed = useStore((s) => s.onboarding.completed);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(completed ? "/dashboard" : "/onboarding");
  }, [hydrated, completed, router]);

  return <FullScreenLoader />;
}
