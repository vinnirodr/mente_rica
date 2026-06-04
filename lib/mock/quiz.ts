import type { MindsetProfile } from "@/lib/types";

// Diagnóstico de mentalidade do onboarding (US-02): 10 perguntas, cada opção
// pontua para um arquétipo. O resultado posiciona o usuário em um perfil simples
// que personaliza mensagens ao longo do app.

export interface QuizOption {
  label: string;
  profile: MindsetProfile;
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
      { label: "Imagino grandes possibilidades", profile: "Sonhador" },
      { label: "Penso no que posso construir hoje", profile: "Construtor" },
      { label: "Quero agir imediatamente", profile: "Executor" },
      { label: "Analiso o melhor caminho", profile: "Estrategista" },
    ],
  },
  {
    id: 2,
    question: "Diante de uma meta ambiciosa, meu primeiro impulso é...",
    options: [
      { label: "Sonhar com o resultado", profile: "Sonhador" },
      { label: "Dividir em etapas concretas", profile: "Construtor" },
      { label: "Começar agora", profile: "Executor" },
      { label: "Mapear riscos e rotas", profile: "Estrategista" },
    ],
  },
  {
    id: 3,
    question: "O que mais me trava hoje?",
    options: [
      { label: "Falta de clareza do objetivo", profile: "Sonhador" },
      { label: "Não saber por onde começar", profile: "Construtor" },
      { label: "Procrastinação", profile: "Executor" },
      { label: "Excesso de análise", profile: "Estrategista" },
    ],
  },
  {
    id: 4,
    question: "Eu me sinto mais vivo quando...",
    options: [
      { label: "Visualizo o que é possível", profile: "Sonhador" },
      { label: "Vejo algo tomando forma", profile: "Construtor" },
      { label: "Risco tarefas da lista", profile: "Executor" },
      { label: "Encontro o caminho ótimo", profile: "Estrategista" },
    ],
  },
  {
    id: 5,
    question: "Minha relação com planejamento é...",
    options: [
      { label: "Prefiro inspiração a planos", profile: "Sonhador" },
      { label: "Gosto de planos simples", profile: "Construtor" },
      { label: "Planejo pouco, ajo muito", profile: "Executor" },
      { label: "Planejo em detalhes", profile: "Estrategista" },
    ],
  },
  {
    id: 6,
    question: "Quando algo dá errado, eu...",
    options: [
      { label: "Busco um novo sonho", profile: "Sonhador" },
      { label: "Reconstruo passo a passo", profile: "Construtor" },
      { label: "Tento de novo rápido", profile: "Executor" },
      { label: "Reviso a estratégia", profile: "Estrategista" },
    ],
  },
  {
    id: 7,
    question: "O dinheiro, para mim, representa...",
    options: [
      { label: "Liberdade e possibilidades", profile: "Sonhador" },
      { label: "Segurança que construo", profile: "Construtor" },
      { label: "Resultado de ação", profile: "Executor" },
      { label: "Um jogo a ser vencido", profile: "Estrategista" },
    ],
  },
  {
    id: 8,
    question: "Meu maior talento é...",
    options: [
      { label: "Visão", profile: "Sonhador" },
      { label: "Consistência", profile: "Construtor" },
      { label: "Velocidade", profile: "Executor" },
      { label: "Discernimento", profile: "Estrategista" },
    ],
  },
  {
    id: 9,
    question: "Eu cresço mais quando alguém me...",
    options: [
      { label: "Inspira com uma grande visão", profile: "Sonhador" },
      { label: "Mostra o próximo passo", profile: "Construtor" },
      { label: "Cobra ação", profile: "Executor" },
      { label: "Desafia meu raciocínio", profile: "Estrategista" },
    ],
  },
  {
    id: 10,
    question: "Em 12 meses, quero principalmente...",
    options: [
      { label: "Clareza sobre meu propósito", profile: "Sonhador" },
      { label: "Hábitos sólidos", profile: "Construtor" },
      { label: "Resultados visíveis", profile: "Executor" },
      { label: "Um plano vencedor", profile: "Estrategista" },
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

export function scoreQuiz(answers: MindsetProfile[]): {
  profile: MindsetProfile;
  description: string;
} {
  const tally = answers.reduce<Record<string, number>>((acc, p) => {
    acc[p] = (acc[p] ?? 0) + 1;
    return acc;
  }, {});
  const profile = (Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Construtor") as MindsetProfile;
  return { profile, description: PROFILE_DESCRIPTIONS[profile] };
}
