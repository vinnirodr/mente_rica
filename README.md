# MindRich

> Mude sua mentalidade. **Mude seus resultados.**

Sistema pessoal de desenvolvimento financeiro e mental, **para qualquer pessoa — tenha
lido o livro ou não**. O usuário entra pelo problema que vive hoje; a partir de um
**diagnóstico de bloqueios**, o app traça um caminho personalizado pelos 13 Princípios
de Napoleon Hill, com foco na **prática guiada**, no **acompanhamento** e nos
**lembretes inteligentes** que levam do saber ao fazer.

Estado atual: **beta gratuito e aberto**, instalável como PWA. Todo o produto roda
no navegador — o progresso fica no `localStorage` do aparelho, sem conta e sem
servidor. Os planos exibidos no Perfil são uma prévia: nada é cobrado no beta.

O que ainda é simulado: o **Coach IA** responde por templates (não há chamada à
Claude API) e os **lembretes** só aparecem dentro do app, não como push. Trocar
essas duas peças por serviços reais exige backend — ver "Próximos passos".

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
| `/principles` | Grid com título acessível + nome clássico de Hill, princípio recomendado em destaque ("Comece por aqui"), desbloqueio progressivo pela prática |
| `/principles/[id]` | Aprender → exercício guiado (respostas salvas) → reflexão + feedback de IA (alinhamento/lacuna/ação) com loading e retry |
| `/journal` | Heatmap de consistência, check-in de 1 toque, histórico pesquisável |
| `/coach` | Chat com tom "Napoleon Hill", indicador de digitação, histórico persistido |
| `/notifications` | Central de notificações + agendador de lembretes com **"Testar agora"** (push simulado in-app) |
| `/settings` | Perfil, Grande Objetivo editável, prévia dos planos, exportação dos dados, acesso às notificações |

## Arquitetura

- `lib/store.ts` — fonte única da verdade (usuário, progresso, diário, chat, notificações).
- `lib/mock/` — dados simulados: princípios (paráfrase própria, sem texto literal do
  livro), quiz e o simulador do Coach IA.
- `lib/notifications.ts` — agendador de lembretes simulado; interface pronta para
  trocar por Firebase Cloud Messaging.
- `lib/analytics.ts` — eventos PostHog tipados (ainda no-op).
- `lib/export.ts` — backup dos dados em JSON (Perfil → Exportar meus dados).
- `public/sw.js` — service worker: cache do app para uso offline e instalação.
- `components/ui/` — design system reutilizado por todas as telas.

O estado persistido é versionado (`STORE_VERSION` em `lib/store.ts`). **Ao mudar o
formato do estado, suba a versão e trate o caso no `migrate`** — sem isso o merge
raso do Zustand quebra quem já usa o app.

## Próximos passos

O bloqueio para o Coach IA real é a hospedagem: em static export a chave da API
ficaria exposta no navegador. O caminho é migrar para uma plataforma com servidor
(Vercel) e então:

1. **Coach IA real** — Route Handler + Claude API, com rate limiting por usuário.
2. **Contas e sincronização** — Supabase (auth + banco com RLS), importando o
   `localStorage` de quem já usa o beta.
3. **Push de verdade** — Web Push (VAPID) + agendamento server-side dos lembretes.
4. **Analytics, jurídico e landing** — PostHog, política de privacidade (LGPD) e
   uma página inicial que explique o produto.
5. **Cobrança** — Stripe, quando o beta terminar.
