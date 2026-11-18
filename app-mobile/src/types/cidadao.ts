import type { Faixa } from '@/types/telemetria';

export type Severidade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type TipoAlerta = 'SENSOR' | 'COMUNITARIO' | 'PREVISAO';

export type TipoOcorrencia = 'RUA_ALAGADA' | 'CORREGO_TRANSBORDANDO' | 'IMOVEL_ATINGIDO' | 'BUEIRO_ENTUPIDO';

export type StatusOcorrencia = 'ABERTA' | 'CONFIRMADA' | 'RESOLVIDA';

export type Area = {
  id: number;
  nome: string;
  bairro: string;
  latitude: number;
  longitude: number;
  raioMetros: number;
  nivelRiscoHistorico: number;
};

export type AreaDetalhe = Area & {
  alertasAtivos: number;
  ocorrenciasAbertas: number;
};

export type RankingArea = {
  areaRiscoId: number;
  nome: string;
  bairro: string;
  nivelRiscoHistorico: number;
  totalOcorrencias: number;
};

export type Alerta = {
  id: number;
  tipo: TipoAlerta;
  areaRiscoId: number;
  areaNome: string;
  severidade: Severidade;
  mensagem: string;
  prioridade: number;
  ativo: boolean;
  criadoEm: string;
  encerradoEm: string | null;
  sensorCodigo?: string | null;
  nivelCm?: number | null;
  faixa?: Faixa | null;
  quantidadeRelatos?: number | null;
  probabilidadeChuvaForte?: number | null;
  janelaHoras?: number | null;
};

export type RegistrarOcorrenciaRequest = {
  areaRiscoId?: number | null;
  tipo: TipoOcorrencia;
  descricao?: string | null;
  latitude: number;
  longitude: number;
  idLocalApp: string;
};

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

export type AbrigoProximo = Abrigo & {
  distanciaMetros: number;
};

export type SalvarInscricaoRequest = {
  dispositivoId: string;
  areaRiscoId: number;
  prefereFonteGrande: boolean;
  prefereAltoContraste: boolean;
};

export type Inscricao = {
  id: number;
  dispositivoId: string;
  areaRiscoId: number;
  prefereFonteGrande: boolean;
  prefereAltoContraste: boolean;
  criadaEm: string;
  atualizadaEm: string | null;
};
