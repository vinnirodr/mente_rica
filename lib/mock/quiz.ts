import type { Block, BlockId, Diagnosis, MindsetProfile } from "@/lib/types";

// Diagnóstico de mentalidade E bloqueios do onboarding (US-02): 10 perguntas.
// Cada opção pontua dois eixos:
//  - arquétipo (sabor de personalidade, mantido do v1.3)
//  - bloqueio (o que mais trava o usuário hoje) → mapeia para o princípio mais urgente.
// O resultado posiciona o usuário e recomenda por onde começar — sem pressupor que
// a pessoa tenha lido o livro.

// Cada bloqueio é atacado por um princípio específico (linguagem acessível).
export const BLOCKS: Record<BlockId, Block> = {
  clareza: { id: "clareza", label: "Falta de clareza do objetivo", principleId: 1 },
  confianca: { id: "confianca", label: "Medo e falta de confiança", principleId: 2 },
  decisao: { id: "decisao", label: "Procrastinação e indecisão", principleId: 7 },
  consistencia: { id: "consistencia", label: "Dificuldade de manter constância", principleId: 8 },
  foco: { id: "foco", label: "Dispersão e falta de foco", principleId: 10 },
  rede: { id: "rede", label: "Caminhar sozinho, sem apoio", principleId: 9 },
};

export interface QuizOption {
  label: string;
  profile: MindsetProfile;
  block: BlockId;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Quando penso no meu futuro financeiro, eu...",
    options: [
      { label: "Imagino grandes possibilidades", profile: "Sonhador", block: "clareza" },
      { label: "Penso no que posso construir hoje", profile: "Construtor", block: "consistencia" },
      { label: "Quero agir imediatamente", profile: "Executor", block: "decisao" },
      { label: "Analiso o melhor caminho", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 2,
    question: "Diante de uma meta ambiciosa, meu primeiro impulso é...",
    options: [
      { label: "Sonhar com o resultado", profile: "Sonhador", block: "clareza" },
      { label: "Dividir em etapas concretas", profile: "Construtor", block: "consistencia" },
      { label: "Começar agora", profile: "Executor", block: "decisao" },
      { label: "Mapear riscos e rotas", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 3,
    question: "O que mais me trava hoje?",
    options: [
      { label: "Falta de clareza do objetivo", profile: "Sonhador", block: "clareza" },
      { label: "Não saber por onde começar", profile: "Construtor", block: "decisao" },
      { label: "Procrastinação", profile: "Executor", block: "decisao" },
      { label: "Excesso de análise", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 4,
    question: "Eu me sinto mais vivo quando...",
    options: [
      { label: "Visualizo o que é possível", profile: "Sonhador", block: "clareza" },
      { label: "Vejo algo tomando forma", profile: "Construtor", block: "consistencia" },
      { label: "Risco tarefas da lista", profile: "Executor", block: "decisao" },
      { label: "Encontro o caminho ótimo", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 5,
    question: "Minha relação com planejamento é...",
    options: [
      { label: "Prefiro inspiração a planos", profile: "Sonhador", block: "clareza" },
      { label: "Gosto de planos simples", profile: "Construtor", block: "consistencia" },
      { label: "Planejo pouco, ajo muito", profile: "Executor", block: "foco" },
      { label: "Planejo em detalhes", profile: "Estrategista", block: "decisao" },
    ],
  },
  {
    id: 6,
    question: "Quando algo dá errado, eu...",
    options: [
      { label: "Busco um novo sonho", profile: "Sonhador", block: "consistencia" },
      { label: "Reconstruo passo a passo", profile: "Construtor", block: "clareza" },
      { label: "Tento de novo rápido", profile: "Executor", block: "confianca" },
      { label: "Reviso a estratégia", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 7,
    question: "O dinheiro, para mim, representa...",
    options: [
      { label: "Liberdade e possibilidades", profile: "Sonhador", block: "clareza" },
      { label: "Segurança que construo", profile: "Construtor", block: "consistencia" },
      { label: "Resultado de ação", profile: "Executor", block: "decisao" },
      { label: "Um jogo a ser vencido", profile: "Estrategista", block: "confianca" },
    ],
  },
  {
    id: 8,
    question: "Meu maior talento é...",
    options: [
      { label: "Visão", profile: "Sonhador", block: "clareza" },
      { label: "Consistência", profile: "Construtor", block: "consistencia" },
      { label: "Velocidade", profile: "Executor", block: "decisao" },
      { label: "Discernimento", profile: "Estrategista", block: "foco" },
    ],
  },
  {
    id: 9,
    question: "Eu cresço mais quando alguém me...",
    options: [
      { label: "Inspira com uma grande visão", profile: "Sonhador", block: "confianca" },
      { label: "Mostra o próximo passo", profile: "Construtor", block: "rede" },
      { label: "Cobra ação", profile: "Executor", block: "rede" },
      { label: "Desafia meu raciocínio", profile: "Estrategista", block: "rede" },
    ],
  },
  {
    id: 10,
    question: "Em 12 meses, quero principalmente...",
    options: [
      { label: "Clareza sobre meu propósito", profile: "Sonhador", block: "clareza" },
      { label: "Hábitos sólidos", profile: "Construtor", block: "consistencia" },
      { label: "Resultados visíveis", profile: "Executor", block: "decisao" },
      { label: "Um plano vencedor", profile: "Estrategista", block: "foco" },
    ],
  },
];

const PROFILE_DESCRIPTIONS: Record<MindsetProfile, string> = {
  Sonhador:
    "Você enxerga longe. Seu próximo salto é transformar visão em planos concretos — o MindRich vai te ajudar a aterrissar seus sonhos.",
  Construtor:
    "Você avança com consistência. Vamos canalizar essa solidez em marcos claros rumo ao seu objetivo principal.",
  Executor:
    "Você age rápido. O MindRich vai dar direção ao seu ímpeto para que cada ação te aproxime do que importa.",
  Estrategista:
    "Você pensa com profundidade. Agora é hora de equilibrar análise e ação — e o coach vai te empurrar para o movimento.",
};

const BLOCK_INSIGHT: Record<BlockId, string> = {
  clareza: "Sem um alvo nítido, a energia se espalha. Vamos começar deixando seu objetivo cristalino.",
  confianca: "A dúvida trava mais gente do que a falta de talento. O primeiro passo é fortalecer sua confiança.",
  decisao: "Decidir rápido e agir é o que separa quem realiza de quem só planeja. Começamos por aqui.",
  consistencia: "Resultado vem da repetição. Vamos construir a constância que sustenta qualquer meta.",
  foco: "Atenção dispersa dilui o esforço. O ponto de partida é direcionar sua energia ao que importa.",
  rede: "Ninguém chega longe sozinho. Vamos fortalecer a rede de apoio ao seu redor.",
};

export interface DiagnosisResult extends Diagnosis {
  profile: MindsetProfile;
  description: string;
  insight: string; // porquê do princípio recomendado
}

export function scoreQuiz(answers: QuizOption[]): DiagnosisResult {
  const profileTally: Record<string, number> = {};
  const blockTally: Record<string, number> = {};
  for (const a of answers) {
    profileTally[a.profile] = (profileTally[a.profile] ?? 0) + 1;
    blockTally[a.block] = (blockTally[a.block] ?? 0) + 1;
  }

  const profile = (Object.entries(profileTally).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Construtor") as MindsetProfile;

  const rankedBlocks = (Object.entries(blockTally) as [BlockId, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const topBlocks = rankedBlocks.slice(0, 3).map(([id]) => id);
  const primary = topBlocks[0] ?? "clareza";

  return {
    profile,
    description: PROFILE_DESCRIPTIONS[profile],
    topBlocks,
    recommendedPrincipleId: BLOCKS[primary].principleId,
    insight: BLOCK_INSIGHT[primary],
  };
}
