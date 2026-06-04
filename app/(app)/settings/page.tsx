"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Crown,
  LogOut,
  Pencil,
  Target,
  User as UserIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
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
  const setPlan = useStore((s) => s.setPlan);
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
                <Crown size={12} /> {PLAN_LABEL[user.plan]}
              </Badge>
              {user.mindsetProfile && <Badge tone="muted">{user.mindsetProfile}</Badge>}
            </div>
          </div>
        </Card>

        {/* DMP editável */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <Target size={18} className="text-gold" /> Objetivo Principal
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

        {/* Assinatura */}
        <button onClick={() => setPlanModal(true)} className="w-full text-left">
          <Card interactive className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Crown size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Gerenciar assinatura</p>
              <p className="text-xs text-ink-muted">Plano atual: {PLAN_LABEL[user.plan]}</p>
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

        <p className="pt-2 text-center text-xs text-ink-faint">
          MindRich · protótipo de UX · dados locais (mock)
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

      {/* Modal: planos */}
      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Seu plano">
        <div className="space-y-3">
          {PLANS.map((p) => {
            const active = user.plan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPlan(p.id);
                  setPlanModal(false);
                }}
                className={
                  "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors " +
                  (active ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20")
                }
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{PLAN_LABEL[p.id]}</p>
                  <p className="text-xs text-ink-muted">{p.perks}</p>
                </div>
                <span className="text-sm font-semibold text-gold">{p.price}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
