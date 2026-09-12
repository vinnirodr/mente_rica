/**
 * Quantas mensagens do histórico vão para o modelo a cada turno. O diário de
 * conversa do usuário continua inteiro no aparelho — isto limita só o que é
 * enviado, porque cada turno extra é custo de entrada em toda mensagem.
 *
 * Compartilhado entre cliente e servidor de propósito: o cliente corta antes de
 * enviar e o servidor corta de novo ao receber.
 */
export const MAX_HISTORY = 10;

/**
 * Teto de sanidade para o tamanho do corpo, não regra de produto.
 *
 * Precisa ser generoso: o cliente manda o histórico já cortado, mas uma cópia
 * antiga do JavaScript em cache pode mandar a conversa inteira. Rejeitar por
 * tamanho de histórico trancaria o usuário fora do chat — foi exatamente o
 * defeito que existia aqui.
 */
export const MAX_HISTORY_ACCEPTED = 500;
