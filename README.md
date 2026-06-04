# MindRich

> Mude sua mentalidade. **Mude seus resultados.**

Sistema pessoal de desenvolvimento financeiro e mental, **para qualquer pessoa — tenha
lido o livro ou não**. O usuário entra pelo problema que vive hoje; a partir de um
**diagnóstico de bloqueios**, o app traça um caminho personalizado pelos 13 Princípios
de Napoleon Hill, com foco na **prática guiada**, no **acompanhamento** e nos
**lembretes inteligentes** que levam do saber ao fazer.

Esta é a **Fase 1: protótipo de UX/UI completo** — todas as telas principais
navegáveis, com dados simulados (sem backend). É a fundação visual sobre a qual a
fatia vertical real (Supabase, Claude API, Stripe, FCM) será construída.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens da identidade visual (azul-noturno + dourado)
- **Framer Motion** — transições e microinterações (< 300ms)
- **Zustand** + `persist` — estado e persistência local (simula a sincronização)

## Rodando

```bash
npm install
npm run dev
# http://localhost:3000
```

Primeira visita → onboarding. O progresso é salvo no `localStorage`; recarregar
retoma de onde parou. Para recomeçar: **Perfil → Reiniciar progresso**.

## Telas

| Rota | O que demonstra |
| --- | --- |
| `/onboarding` | 5 passos: boas-vindas (foco no problema), diagnóstico de mentalidade **e bloqueios** → "comece por aqui", "Seu Grande Objetivo" (validação inline), horário dos lembretes, compromisso com o caminho personalizado |
| `/dashboard` | Grande Objetivo em destaque, sequência (streak), progresso dos 13 princípios, próxima ação do coach |
| `/principles` | Grid com título acessível + nome clássico de Hill, princípio recomendado em destaque ("Comece por aqui"), paywall (Free → Pro) |
| `/principles/[id]` | Aprender (texto + áudio) → exercício guiado → reflexão + feedback de IA (alinhamento/lacuna/ação) com loading e retry |
| `/journal` | Heatmap de consistência, check-in de 1 toque, histórico pesquisável |
| `/coach` | Chat com tom "Napoleon Hill", indicador de digitação, histórico persistido |
| `/notifications` | Central de notificações + agendador de lembretes com **"Testar agora"** (push simulado in-app) |
| `/settings` | Perfil, Grande Objetivo editável, gestão de planos, acesso às notificações |

## Arquitetura

- `lib/store.ts` — fonte única da verdade (usuário, progresso, diário, chat, notificações).
- `lib/mock/` — dados simulados: princípios (paráfrase própria, sem texto literal do
  livro), quiz e o simulador do Coach IA.
- `lib/notifications.ts` — agendador de lembretes simulado; interface pronta para
  trocar por Firebase Cloud Messaging.
- `lib/analytics.ts` — eventos PostHog tipados (no-op no protótipo).
- `components/ui/` — design system reutilizado por todas as telas.

## Próximos passos (Fase 2)

Plugar serviços reais por trás das interfaces já desenhadas: Supabase (auth/dados),
Claude API (coach), Stripe (assinaturas) e FCM (push). Depois: gamificação e
Master Mind Groups.
