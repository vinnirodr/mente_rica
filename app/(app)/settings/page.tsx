"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Bell,
  ChevronRight,
  Crown,
  Download,
  LogOut,
  Pencil,
  Target,
  User as UserIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { exportUserData } from "@/lib/export";
import { TopBar } from "@/components/shell/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Plan } from "@/lib/types";

const PLAN_LABEL: Record<Plan, string> = { free: "Free", pro: "Pro", team: "Team" };

const PLANS: { id: Plan; price: string; perks: string }[] = [
  { id: "free", price: "R$ 0", perks: "3 primeiros princípios, 1 check-in/dia" },
  { id: "pro", price: "R$ 29,90/mês", perks: "Tudo liberado + coach IA ilimitado" },
  { id: "team", price: "R$ 79,90/mês", perks: "Pro + Master Mind para 10 pessoas" },
];

export default function SettingsPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setDmp = useStore((s) => s.setDmp);
  const resetAll = useStore((s) => s.resetAll);

  const [editDmp, setEditDmp] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [exchange, setExchange] = useState(user.dmp?.inExchange ?? "");
  const [valueStr, setValueStr] = useState(user.dmp ? String(user.dmp.value) : "");

  return (
    <div>
      <TopBar title="Perfil" />
      <div className="space-y-5 px-5 pb-6">
        {/* Cabeçalho do perfil */}
        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient font-display text-2xl text-night">
            {user.name.charAt(0).toUpperCase() || <UserIcon />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl text-ink">{user.name || "Você"}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone="gold">
                <Crown size={12} /> Beta
              </Badge>
              {user.mindsetProfile && <Badge tone="muted">{user.mindsetProfile}</Badge>}
            </div>
          </div>
        </Card>

        {/* DMP editável */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <Target size={18} className="text-gold" /> Meu Grande Objetivo
            </h2>
            <button
              onClick={() => setEditDmp(true)}
              className="inline-flex items-center gap-1 text-sm text-gold"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
          {user.dmp ? (
            <div className="space-y-1">
              <p className="font-display text-2xl text-ink">
                {user.dmp.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p className="text-sm text-ink-muted">{user.dmp.inExchange}</p>
              <p className="text-xs text-ink-faint">
                Prazo: {new Date(user.dmp.deadline).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Nenhum objetivo definido.</p>
          )}
        </Card>

        {/* Conquistas */}
        <button onClick={() => router.push("/achievements")} className="w-full text-left">
          <Card interactive className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Award size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Conquistas e XP</p>
              <p className="text-xs text-ink-muted">Badges, nível e progresso</p>
            </div>
            <ChevronRight size={18} className="text-ink-faint" />
          </Card>
        </button>

        {/* Assinatura */}
        <button onClick={() => setPlanModal(true)} className="w-full text-left">
          <Card interactive className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Crown size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Planos</p>
              <p className="text-xs text-ink-muted">Beta gratuito · tudo liberado</p>
            </div>
            <ChevronRight size={18} className="text-ink-faint" />
          </Card>
        </button>

        {/* Notificações */}
        <button onClick={() => router.push("/notifications")} className="w-full text-left">
          <Card interactive className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Bell size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Notificações e lembretes</p>
              <p className="text-xs text-ink-muted">Rituais, sequência e push</p>
            </div>
            <ChevronRight size={18} className="text-ink-faint" />
          </Card>
        </button>

        {/* Backup */}
        <button onClick={exportUserData} className="w-full text-left">
          <Card interactive className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Download size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Exportar meus dados</p>
              <p className="text-xs text-ink-muted">Baixe suas reflexões e seu progresso</p>
            </div>
            <ChevronRight size={18} className="text-ink-faint" />
          </Card>
        </button>

        <button
          onClick={() => {
            if (confirm("Reiniciar todo o progresso? Isso recomeça o onboarding.")) {
              resetAll();
              router.replace("/onboarding");
            }
          }}
          className="flex w-full items-center justify-center gap-2 py-3 text-sm text-ember"
        >
          <LogOut size={16} /> Reiniciar progresso
        </button>

        <p className="pt-2 text-center text-xs leading-relaxed text-ink-faint">
          MindRich · beta
          <br />
          Seus dados ficam salvos apenas neste navegador.
        </p>
      </div>

      {/* Modal: editar DMP */}
      <Modal open={editDmp} onClose={() => setEditDmp(false)} title="Editar objetivo">
        <div className="space-y-4">
          <Input
            label="Valor financeiro (R$)"
            inputMode="numeric"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value.replace(/\D/g, ""))}
          />
          <Textarea
            label="O que darei em troca"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {
              const value = Number(valueStr) || user.dmp?.value || 0;
              setDmp({
                value,
                deadline: user.dmp?.deadline ?? new Date(Date.now() + 31536000000).toISOString().slice(0, 10),
                inExchange: exchange.trim() || user.dmp?.inExchange || "",
                createdAt: user.dmp?.createdAt ?? new Date().toISOString(),
              });
              setEditDmp(false);
            }}
          >
            Salvar
          </Button>
        </div>
      </Modal>

      {/* Modal: planos — vitrine dos preços futuros. Durante o beta não há cobrança. */}
      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Planos">
        <div className="space-y-3">
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
            <p className="text-sm font-semibold text-gold">Beta gratuito</p>
            <p className="mt-1 text-xs leading-relaxed text-ink">
              Enquanto o MindRich está em beta, tudo é liberado e nada é cobrado. Os planos
              abaixo são uma prévia do que virá — você será avisado antes de qualquer mudança.
            </p>
          </div>

          {PLANS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{PLAN_LABEL[p.id]}</p>
                <p className="text-xs text-ink-muted">{p.perks}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink-faint">{p.price}</p>
                <p className="text-[10px] uppercase tracking-widest text-ink-faint">em breve</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
