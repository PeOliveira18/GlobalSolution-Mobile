/**
 * Tipos do Serviço do Cidadão (.NET), espelhando os endpoints da C1.4 do PLANO.md.
 *
 * Regras da B3: campos em camelCase e enums como texto em MAIÚSCULAS.
 * Datas chegam como texto ISO 8601 com fuso. Os IDs de dispositivo e de relato local são GUIDs (texto).
 */

import type { Faixa } from './telemetria';

export type Severidade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

/** Subclasse do alerta no domínio (C1.3). */
export type TipoAlerta = 'SENSOR' | 'COMUNITARIO' | 'PREVISAO';

export type TipoOcorrencia = 'RUA_ALAGADA' | 'CORREGO_TRANSBORDANDO' | 'IMOVEL_ATINGIDO' | 'BUEIRO_ENTUPIDO';

export type StatusOcorrencia = 'ABERTA' | 'CONFIRMADA' | 'RESOLVIDA';

// ---------- Áreas ----------

/** Item de `GET /api/areas`. */
export type Area = {
  id: number;
  nome: string;
  bairro: string;
  latitude: number;
  longitude: number;
  raioMetros: number;
  /** De 1 (baixo) a 5 (alto). */
  nivelRiscoHistorico: number;
};

/** `GET /api/areas/{id}`. */
export type AreaDetalhe = Area & {
  alertasAtivos: number;
  ocorrenciasAbertas: number;
};

/** Item de `GET /api/areas/ranking?dias=7`. */
export type RankingArea = {
  areaRiscoId: number;
  nome: string;
  bairro: string;
  nivelRiscoHistorico: number;
  totalOcorrencias: number;
};

// ---------- Alertas ----------

/**
 * Item de `GET /api/alertas?areaId=&ativos=true` e resposta de `GET /api/alertas/{id}`.
 * Os campos opcionais do fim só vêm preenchidos no tipo de alerta correspondente.
 */
export type Alerta = {
  id: number;
  tipo: TipoAlerta;
  areaRiscoId: number;
  areaNome: string;
  severidade: Severidade;
  /** Texto pronto para o morador, gerado pelo servidor. */
  mensagem: string;
  /** Quanto maior, mais urgente. A lista já vem ordenada por ela. */
  prioridade: number;
  ativo: boolean;
  criadoEm: string;
  encerradoEm: string | null;
  // SENSOR
  sensorCodigo?: string | null;
  nivelCm?: number | null;
  faixa?: Faixa | null;
  // COMUNITARIO
  quantidadeRelatos?: number | null;
  // PREVISAO
  probabilidadeChuvaForte?: number | null;
  janelaHoras?: number | null;
};

// ---------- Ocorrências (relatos dos moradores) ----------

/** Corpo de `POST /api/ocorrencias`. Idempotente por `idLocalApp`. */
export type RegistrarOcorrenciaRequest = {
  /** Opcional: sem ele, o servidor descobre a área pela coordenada. */
  areaRiscoId?: number | null;
  tipo: TipoOcorrencia;
  /** Máximo de 280 caracteres. */
  descricao?: string | null;
  latitude: number;
  longitude: number;
  idLocalApp: string;
};

/** Relato devolvido pela API. A coordenada vem arredondada (~100 m) para proteger o morador. */
export type Ocorrencia = {
  id: number;
  areaRiscoId: number;
  tipo: TipoOcorrencia;
  descricao: string | null;
  latitude: number;
  longitude: number;
  status: StatusOcorrencia;
  confirmacoes: number;
  criadaEm: string;
  idLocalApp: string;
};

// ---------- Abrigos ----------

/** Item de `GET /api/abrigos?areaId=`. */
export type Abrigo = {
  id: number;
  areaRiscoId: number;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  capacidade: number;
  ocupacao: number;
  vagasLivres: number;
  acessivel: boolean;
  aceitaAnimais: boolean;
};

/** Item de `GET /api/abrigos/proximos?lat=&lon=&acessivel=&limite=5`. */
export type AbrigoProximo = Abrigo & {
  distanciaMetros: number;
};

// ---------- Inscrições (celular anônimo, sem nome, telefone ou CPF) ----------

/** Corpo de `POST /api/inscricoes`: cria ou atualiza pelo `dispositivoId`. */
export type SalvarInscricaoRequest = {
  dispositivoId: string;
  areaRiscoId: number;
  prefereFonteGrande: boolean;
  prefereAltoContraste: boolean;
};

/** Resposta de `POST /api/inscricoes` e `GET /api/inscricoes/{dispositivoId}`. */
export type Inscricao = {
  id: number;
  dispositivoId: string;
  areaRiscoId: number;
  prefereFonteGrande: boolean;
  prefereAltoContraste: boolean;
  criadaEm: string;
  atualizadaEm: string | null;
};
