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

O **Coach IA é real**: roda na Claude API por trás de rotas do servidor, e a chave
nunca chega ao navegador. Ainda é simulado apenas o **lembrete**, que só aparece
dentro do app e não como push.

**Hospedagem: Vercel.** O deploy é automático a cada push na `main`. O app saiu do
GitHub Pages porque static export não tem servidor — a chave da Claude API ficaria
exposta no navegador, o que bloqueava o Coach IA real. O endereço antigo
(`vinnirodr.github.io/mente_rica`) serve apenas um aviso de mudança, publicado pelo
workflow `pages-redirect`.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens da identidade visual (azul-noturno + dourado)
- **Framer Motion** — transições e microinterações (< 300ms)
- **Zustand** + `persist` — estado e persistência local (simula a sincronização)

## Rodando

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # sem isso o Coach responde 503
npm run dev
# http://localhost:3000
```

Na Vercel, a mesma variável fica em **Settings → Environment Variables**. Ela é lida
apenas no servidor — não use o prefixo `NEXT_PUBLIC_`, que a exporia no navegador.

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
- `lib/mock/` — conteúdo estático: princípios (paráfrase própria, sem texto literal
  do livro), quiz e conquistas.
- `app/api/coach/` — rotas do Coach IA. `feedback` devolve o retorno estruturado
  (alinhamento/lacuna/ação) via saída estruturada; `chat` responde em streaming.
  Ambas usam `claude-opus-5` — trocar o modelo é uma linha em `lib/coach/client.ts`.
- `lib/rate-limit.ts` — limite por IP (10 reflexões e 30 mensagens por hora).
  **É em memória, então na Vercel vale por instância** — freia uso acidental, não
  abuso determinado. A proteção real depende de contas (próximo passo).
- `lib/notifications.ts` — agendador de lembretes simulado; interface pronta para
  trocar por Firebase Cloud Messaging.
- `lib/analytics.ts` — eventos PostHog tipados (ainda no-op).
- `lib/export.ts` — backup dos dados em JSON (Perfil → Exportar meus dados).
- `public/sw.js` — service worker: cache do app para uso offline e instalação.
- `components/ui/` — design system reutilizado por todas as telas.

O estado persistido é versionado (`STORE_VERSION` em `lib/store.ts`). **Ao mudar o
formato do estado, suba a versão e trate o caso no `migrate`** — sem isso o merge
raso do Zustand quebra quem já usa o app.

### Endereço do site

`metadataBase` (em `app/layout.tsx`) é derivado do ambiente, nesta ordem:
`NEXT_PUBLIC_SITE_URL` → a URL de produção que a Vercel injeta → `localhost:3000`.
Ao apontar um domínio próprio, basta definir `NEXT_PUBLIC_SITE_URL` nas variáveis
do projeto — não há endereço fixo no código.

### Workflows

- `ci.yml` — build + checagem de tipos em todo PR e na `main`.
- `pages-redirect.yml` — manual: publica no GitHub Pages o aviso de mudança de
  endereço (`gh-pages-redirect/`), recebendo a URL nova como parâmetro.

## Próximos passos

1. **Contas e sincronização** — Supabase (auth + banco com RLS). Além de sincronizar
   entre aparelhos, é o que permite limitar o Coach por usuário: hoje o endpoint é
   público e cada chamada custa dinheiro.
2. **Push de verdade** — Web Push (VAPID) + agendamento server-side dos lembretes.
3. **Analytics, jurídico e landing** — PostHog, política de privacidade (LGPD) e
   uma página inicial que explique o produto.
4. **Cobrança** — Stripe, quando o beta terminar.
