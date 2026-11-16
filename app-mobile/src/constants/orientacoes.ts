import type { Alerta } from '@/types';

/**
 * Passo a passo "O que fazer agora" do detalhe do alerta (C3.3).
 * Baseado nas orientações gerais de Defesa Civil para enchentes, em linguagem simples.
 */

const EMERGENCIA = [
  'Saia de casa agora e vá para o abrigo mais próximo.',
  'Leve só o essencial: documentos, remédios e o celular.',
  'Ajude idosos, crianças e pessoas com deficiência a sair.',
  'Não atravesse ruas alagadas, nem a pé nem de carro.',
  'Se for seguro, desligue a energia no quadro de luz antes de sair.',
  'Em perigo, ligue 199 (Defesa Civil) ou 193 (Bombeiros).',
];

const ALERTA = [
  'Tire documentos, remédios e eletrônicos do chão.',
  'Deixe uma mochila pronta com documentos, remédios, água e carregador.',
  'Veja no app qual é o abrigo mais perto e combine com a família.',
  'Avise vizinhos idosos ou que precisam de ajuda.',
  'Fique de olho no app: se virar emergência, saia de casa.',
];

const ATENCAO = [
  'Acompanhe o nível do córrego pelo app.',
  'Guarde documentos e remédios em um lugar alto.',
  'Evite passar perto do córrego.',
];

const COMUNITARIO = [
  'Evite a região alagada.',
  'Tire objetos e documentos do chão.',
  'Se você também está vendo o alagamento, confirme o relato dos vizinhos na aba Reportar.',
  'Se a água subir, vá para o abrigo mais próximo.',
];

const PREVISAO = [
  'Deixe documentos e remédios em um lugar alto.',
  'Carregue o celular.',
  'Acompanhe o app nas próximas horas.',
];

export function passosDoAlerta(alerta: Alerta): string[] {
  if (alerta.tipo === 'COMUNITARIO') return COMUNITARIO;
  if (alerta.tipo === 'PREVISAO') return PREVISAO;
  if (alerta.faixa === 'EMERGENCIA' || alerta.severidade === 'CRITICA') return EMERGENCIA;
  if (alerta.faixa === 'ALERTA' || alerta.severidade === 'ALTA') return ALERTA;
  return ATENCAO;
}

/** Telefone da Defesa Civil (serviço público nacional). */
export const TELEFONE_DEFESA_CIVIL = '199';
