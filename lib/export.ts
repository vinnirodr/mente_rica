import { useStore } from "@/lib/store";

/**
 * Os dados do usuário vivem só no localStorage deste navegador — limpar os dados
 * do site, trocar de aparelho ou a expiração automática do Safari apagam tudo sem
 * aviso. Até existir conta e sincronização, exportar é a única forma de backup.
 */
export function exportUserData(): void {
  const s = useStore.getState();

  const payload = {
    app: "MindRich",
    exportedAt: new Date().toISOString(),
    user: s.user,
    progress: s.progress,
    journal: s.journal,
    chat: s.chat,
    reminders: s.reminders,
    bestStreak: s.bestStreak,
    xp: s.xp,
    unlockedAchievements: s.unlockedAchievements,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mindrich-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
