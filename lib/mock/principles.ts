import type { Principle } from "@/lib/types";

// Os 13 Princípios de Napoleon Hill — TÍTULOS e CONTEÚDO em paráfrase própria.
// Nenhum texto literal do livro é reproduzido (mitigação de risco — seção 9 do escopo).
// Cada princípio traz introdução, dica prática, exercício guiado passo a passo e
// perguntas de check-in que rotacionam no Diário quando este é o princípio atual.

export const PRINCIPLES: Principle[] = [
  {
    id: 1,
    title: "Desejo",
    subtitle: "O ponto de partida de toda realização",
    intro:
      "Tudo começa com um desejo claro e ardente — não um simples 'gostaria', mas uma decisão definida sobre o que você quer e por quê. Quando o objetivo é específico, mensurável e carregado de emoção, sua mente passa a filtrar o mundo em busca de caminhos.",
    tip: "Escreva seu objetivo no presente, como se já fosse realidade, e leia em voz alta toda manhã e toda noite.",
    exercise: [
      { prompt: "Defina em uma frase o que você quer conquistar.", helper: "Seja específico: valor, prazo e contexto." },
      { prompt: "Por que isso importa profundamente para você?", helper: "A emoção é o combustível do desejo." },
      { prompt: "O que você está disposto a dar em troca?" },
    ],
    checkinQuestions: [
      "Você releu seu objetivo principal hoje?",
      "Que ação te aproximou do seu desejo?",
      "Qual emoção você sentiu ao visualizar a conquista?",
    ],
  },
  {
    id: 2,
    title: "Fé",
    subtitle: "Confiança aplicada ao objetivo",
    intro:
      "Fé aqui não é passividade — é a convicção treinada de que você é capaz. Repetição e autossugestão transformam um objetivo em uma certeza interior que orienta suas ações mesmo diante da dúvida.",
    tip: "Crie uma afirmação curta de confiança e repita-a com emoção antes de dormir.",
    exercise: [
      { prompt: "Escreva uma afirmação de confiança sobre sua capacidade." },
      { prompt: "Lembre uma conquista passada que prova que você consegue." },
      { prompt: "Que dúvida você escolhe substituir por certeza hoje?" },
    ],
    checkinQuestions: [
      "Você repetiu sua afirmação de confiança?",
      "Onde a dúvida apareceu e como você respondeu?",
      "Qual pequena vitória reforçou sua fé hoje?",
    ],
  },
  {
    id: 3,
    title: "Autossugestão",
    subtitle: "Programando a mente subconsciente",
    intro:
      "A mente subconsciente aceita aquilo que você repete com emoção. A autossugestão é a prática deliberada de plantar pensamentos dominantes que sustentam seu objetivo principal.",
    tip: "Visualize a conquista com o máximo de detalhes sensoriais por 5 minutos ao acordar.",
    exercise: [
      { prompt: "Descreva sua conquista usando os cinco sentidos." },
      { prompt: "Qual pensamento negativo recorrente você quer reprogramar?" },
      { prompt: "Crie a frase que substituirá esse pensamento." },
    ],
    checkinQuestions: [
      "Você fez sua visualização hoje?",
      "Qual pensamento dominante guiou seu dia?",
      "O que você plantou na sua mente antes de dormir?",
    ],
  },
  {
    id: 4,
    title: "Conhecimento Especializado",
    subtitle: "Saber aplicado vale mais que saber acumulado",
    intro:
      "Conhecimento só vira poder quando organizado e direcionado a um fim. Identifique exatamente quais competências o seu objetivo exige e busque-as de forma prática.",
    tip: "Liste as 3 habilidades que mais aceleram seu objetivo e dedique tempo diário a uma delas.",
    exercise: [
      { prompt: "Quais conhecimentos específicos seu objetivo exige?" },
      { prompt: "Onde você pode adquiri-los rapidamente?" },
      { prompt: "Qual será seu primeiro passo de estudo prático?" },
    ],
    checkinQuestions: [
      "O que você aprendeu de prático hoje?",
      "Como aplicou um novo conhecimento?",
      "Qual lacuna de habilidade ficou evidente?",
    ],
  },
  {
    id: 5,
    title: "Imaginação",
    subtitle: "A oficina onde os planos nascem",
    intro:
      "A imaginação combina ideias antigas em soluções novas. É a faculdade que transforma desejo em planos concretos e oportunidades onde outros veem obstáculos.",
    tip: "Reserve 10 minutos para imaginar três caminhos diferentes para o mesmo objetivo.",
    exercise: [
      { prompt: "Imagine uma solução não óbvia para seu maior obstáculo." },
      { prompt: "Combine duas ideias que normalmente não andam juntas." },
      { prompt: "Que oportunidade está escondida no seu problema atual?" },
    ],
    checkinQuestions: [
      "Que ideia nova surgiu hoje?",
      "Onde você enxergou oportunidade em vez de obstáculo?",
      "Qual plano criativo você esboçou?",
    ],
  },
  {
    id: 6,
    title: "Planejamento Organizado",
    subtitle: "Transformando desejo em ação prática",
    intro:
      "Desejo sem plano é fantasia. Planos práticos, revisados e ajustados quando falham, são a ponte entre a intenção e o resultado. A persistência ajusta o plano, nunca abandona o objetivo.",
    tip: "Quebre seu objetivo em marcos mensais e defina a próxima ação concreta de hoje.",
    exercise: [
      { prompt: "Qual é o próximo marco mensurável do seu objetivo?" },
      { prompt: "Liste 3 ações concretas para chegar lá." },
      { prompt: "Qual plano anterior falhou e o que você ajustaria?" },
    ],
    checkinQuestions: [
      "Qual ação do seu plano você executou hoje?",
      "Algum plano precisou de ajuste?",
      "O que ficou pendente para amanhã?",
    ],
  },
  {
    id: 7,
    title: "Decisão",
    subtitle: "O hábito de decidir com rapidez e firmeza",
    intro:
      "Quem realiza decide rápido e muda de ideia devagar. A procrastinação e a opinião alheia em excesso são inimigas da decisão. Definir-se é assumir o comando da própria vida.",
    tip: "Tome hoje uma decisão que você vinha adiando — por menor que seja.",
    exercise: [
      { prompt: "Qual decisão você vem adiando?" },
      { prompt: "O que o medo está tentando proteger?" },
      { prompt: "Que decisão você toma agora, sem mais adiar?" },
    ],
    checkinQuestions: [
      "Qual decisão você tomou hoje sem adiar?",
      "Onde a indecisão te custou tempo?",
      "De quem você buscou opinião — e foi útil?",
    ],
  },
  {
    id: 8,
    title: "Persistência",
    subtitle: "O esforço sustentado que vence a resistência",
    intro:
      "A persistência é a continuidade do esforço apesar das quedas. É um estado mental que pode ser cultivado com objetivo claro, desejo intenso, planos definidos e bons aliados.",
    tip: "Quando quiser desistir, faça apenas o menor próximo passo possível.",
    exercise: [
      { prompt: "Onde você costuma desistir cedo demais?" },
      { prompt: "Qual o menor passo que mantém o movimento?" },
      { prompt: "Quem ou o que pode te sustentar nos momentos difíceis?" },
    ],
    checkinQuestions: [
      "Onde você insistiu hoje apesar da resistência?",
      "Qual foi seu menor próximo passo?",
      "O que quase fez você parar?",
    ],
  },
  {
    id: 9,
    title: "Master Mind",
    subtitle: "A força da mente coletiva alinhada",
    intro:
      "Duas ou mais mentes em harmonia, focadas em um objetivo, criam uma terceira força invisível. Cercar-se das pessoas certas multiplica conhecimento, energia e oportunidades.",
    tip: "Identifique uma pessoa cujo crescimento te puxa para cima e marque uma conversa.",
    exercise: [
      { prompt: "Quem já faz parte do seu círculo de apoio?" },
      { prompt: "Que tipo de aliado falta no seu objetivo?" },
      { prompt: "Qual será seu próximo movimento para fortalecer essa rede?" },
    ],
    checkinQuestions: [
      "Com quem você trocou energia construtiva hoje?",
      "Como sua rede te ajudou a avançar?",
      "Que relação drena sua energia?",
    ],
  },
  {
    id: 10,
    title: "Energia Criativa",
    subtitle: "Transmutando impulso em realização",
    intro:
      "A energia que move desejos intensos pode ser canalizada para criação, foco e ação produtiva. Direcionar essa força em vez de desperdiçá-la é uma marca de quem realiza muito.",
    tip: "Quando sentir um pico de energia, direcione-o imediatamente para sua tarefa mais importante.",
    exercise: [
      { prompt: "Quando sua energia está no auge durante o dia?" },
      { prompt: "Para onde ela costuma se dispersar?" },
      { prompt: "Como canalizá-la para seu objetivo principal?" },
    ],
    checkinQuestions: [
      "Em que momento sua energia esteve no pico hoje?",
      "Você a direcionou para o que importa?",
      "O que dispersou seu foco?",
    ],
  },
  {
    id: 11,
    title: "Mente Subconsciente",
    subtitle: "O elo entre pensamento e realização",
    intro:
      "O subconsciente trabalha dia e noite com o material que você fornece. Alimentá-lo com emoções positivas e objetivos claros faz dele um aliado silencioso da sua conquista.",
    tip: "Antes de dormir, entregue ao subconsciente uma pergunta sobre seu objetivo.",
    exercise: [
      { prompt: "Que emoção dominante você tem alimentado?" },
      { prompt: "Qual pergunta você quer 'dormir pensando'?" },
      { prompt: "Como cultivar mais emoções positivas amanhã?" },
    ],
    checkinQuestions: [
      "Que emoção predominou no seu dia?",
      "Você entregou uma pergunta ao subconsciente?",
      "Qual ideia surgiu 'do nada' hoje?",
    ],
  },
  {
    id: 12,
    title: "O Cérebro",
    subtitle: "Transmissão e recepção de ideias",
    intro:
      "Nossa mente capta e emite ideias o tempo todo. Um ambiente mental e físico estimulante eleva a qualidade dos pensamentos que recebemos e das soluções que criamos.",
    tip: "Cuide do ambiente: ajuste o que você lê, ouve e com quem convive nesta semana.",
    exercise: [
      { prompt: "Que estímulos diários elevam seu pensamento?" },
      { prompt: "Quais ruídos mentais você quer reduzir?" },
      { prompt: "Como tornar seu ambiente mais inspirador?" },
    ],
    checkinQuestions: [
      "Que estímulo elevou suas ideias hoje?",
      "O que poluiu sua mente?",
      "Como você cuidou do seu ambiente?",
    ],
  },
  {
    id: 13,
    title: "O Sexto Sentido",
    subtitle: "A intuição treinada pela prática",
    intro:
      "Depois de aplicar os princípios anteriores, surge uma percepção mais fina — palpites e insights que guiam decisões. É a maturidade da mente que praticou consistentemente.",
    tip: "Registre seus palpites e revise depois quais se mostraram certeiros.",
    exercise: [
      { prompt: "Que intuição forte você teve recentemente?" },
      { prompt: "Você a seguiu ou ignorou? Qual o resultado?" },
      { prompt: "Como você pode confiar mais nos seus insights?" },
    ],
    checkinQuestions: [
      "Que intuição você teve hoje?",
      "Você confiou nela?",
      "O que sua percepção mais fina captou?",
    ],
  },
];

export function getPrinciple(id: number): Principle | undefined {
  return PRINCIPLES.find((p) => p.id === id);
}
