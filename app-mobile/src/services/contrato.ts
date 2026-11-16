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

/**
 * Tudo o que o app pede às APIs. A implementação real (HTTP) e a mock seguem
 * esta mesma interface, então trocar `EXPO_PUBLIC_USE_MOCK` não muda nada nas telas.
 *
 * Cada método corresponde a um endpoint da C1.4 (Cidadão) ou da B5/C2.4 (Telemetria).
 */
export interface ApiOlhoDagua {
  // Serviço do Cidadão (C1.4)
  /** GET /api/areas */
  listarAreas(): Promise<Area[]>;
  /** GET /api/areas/{id} */
  obterArea(id: number): Promise<AreaDetalhe>;
  /** GET /api/areas/ranking?dias= */
  rankingAreas(dias?: number): Promise<RankingArea[]>;

  /** GET /api/alertas?areaId=&ativos= (já ordenados por prioridade) */
  listarAlertas(filtro?: { areaId?: number; ativos?: boolean }): Promise<Alerta[]>;
  /** GET /api/alertas/{id} */
  obterAlerta(id: number): Promise<Alerta>;

  /** GET /api/ocorrencias?areaId=&status= */
  listarOcorrencias(filtro?: { areaId?: number; status?: StatusOcorrencia }): Promise<Ocorrencia[]>;
  /** POST /api/ocorrencias (idempotente por idLocalApp) */
  registrarOcorrencia(relato: RegistrarOcorrenciaRequest): Promise<Ocorrencia>;
  /** POST /api/ocorrencias/{id}/confirmar */
  confirmarOcorrencia(id: number): Promise<Ocorrencia>;
  /** PATCH /api/ocorrencias/{id}/resolver */
  resolverOcorrencia(id: number): Promise<void>;

  /** GET /api/abrigos?areaId= */
  listarAbrigos(areaId?: number): Promise<Abrigo[]>;
  /** GET /api/abrigos/{id} */
  obterAbrigo(id: number): Promise<Abrigo>;
  /** GET /api/abrigos/proximos?lat=&lon=&acessivel=&limite= (só com vaga, do mais perto ao mais longe) */
  abrigosProximos(consulta: {
    lat: number;
    lon: number;
    acessivel?: boolean;
    limite?: number;
  }): Promise<AbrigoProximo[]>;
  /** POST /api/abrigos/{id}/entrada (409 se não houver vaga) */
  registrarEntradaAbrigo(id: number, pessoas: number): Promise<Abrigo>;

  /** POST /api/inscricoes (cria ou atualiza pelo dispositivoId) */
  salvarInscricao(inscricao: SalvarInscricaoRequest): Promise<Inscricao>;
  /** GET /api/inscricoes/{dispositivoId} */
  obterInscricao(dispositivoId: string): Promise<Inscricao>;

  // Serviço de Telemetria (B5 ④ e C2.4)
  /** GET /api/sensores?areaRiscoId= */
  listarSensores(areaRiscoId?: number): Promise<Sensor[]>;
  /** GET /api/sensores/{codigo}/status */
  statusSensor(codigo: string): Promise<StatusAtualSensor>;
}
