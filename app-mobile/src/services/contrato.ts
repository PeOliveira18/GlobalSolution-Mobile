import type {
  Abrigo,
  AbrigoProximo,
  Alerta,
  Area,
  AreaDetalhe,
  Inscricao,
  Ocorrencia,
  RankingArea,
  RegistrarOcorrenciaRequest,
  SalvarInscricaoRequest,
  Sensor,
  StatusAtualSensor,
  StatusOcorrencia,
} from '@/types';

export interface ApiOlhoDagua {
  listarAreas(): Promise<Area[]>;
  obterArea(id: number): Promise<AreaDetalhe>;
  rankingAreas(dias?: number): Promise<RankingArea[]>;

  listarAlertas(filtro?: { areaId?: number; ativos?: boolean }): Promise<Alerta[]>;
  obterAlerta(id: number): Promise<Alerta>;

  listarOcorrencias(filtro?: { areaId?: number; status?: StatusOcorrencia }): Promise<Ocorrencia[]>;
  registrarOcorrencia(relato: RegistrarOcorrenciaRequest): Promise<Ocorrencia>;
  confirmarOcorrencia(id: number): Promise<Ocorrencia>;
  resolverOcorrencia(id: number): Promise<void>;

  listarAbrigos(areaId?: number): Promise<Abrigo[]>;
  obterAbrigo(id: number): Promise<Abrigo>;
  abrigosProximos(consulta: {
    lat: number;
    lon: number;
    acessivel?: boolean;
    limite?: number;
  }): Promise<AbrigoProximo[]>;
  registrarEntradaAbrigo(id: number, pessoas: number): Promise<Abrigo>;

  salvarInscricao(inscricao: SalvarInscricaoRequest): Promise<Inscricao>;
  obterInscricao(dispositivoId: string): Promise<Inscricao>;

  listarSensores(areaRiscoId?: number): Promise<Sensor[]>;
  statusSensor(codigo: string): Promise<StatusAtualSensor>;
}
