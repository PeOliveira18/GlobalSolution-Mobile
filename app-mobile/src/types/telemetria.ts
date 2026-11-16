/**
 * Tipos do Serviço de Telemetria (Java), espelhando o PLANO.md:
 * contrato ④ da B5 e a listagem `GET /api/sensores?areaRiscoId=` da C2.4.
 *
 * Datas chegam como texto ISO 8601 com fuso (ex.: "2026-11-15T18:42:00-03:00").
 */

/** Faixa do nível do córrego (B4). */
export type Faixa = 'NORMAL' | 'ATENCAO' | 'ALERTA' | 'EMERGENCIA';

export type TipoSensor = 'NIVEL' | 'CHUVA';

export type Unidade = 'CM' | 'MM_H';

export type StatusSensor = 'ATIVO' | 'MANUTENCAO' | 'INATIVO';

/** Item de `GET /api/sensores?areaRiscoId=`. */
export type Sensor = {
  codigo: string;
  tipo: TipoSensor;
  unidade: Unidade;
  areaRiscoId: number;
  latitude: number;
  longitude: number;
  /** Só existe nos sensores de NIVEL. */
  alturaInstalacaoCm: number | null;
  limiteAtencao: number;
  limiteAlerta: number;
  limiteEmergencia: number;
  status: StatusSensor;
};

/**
 * Contrato ④: `GET /api/sensores/{codigo}/status`.
 * Antes da primeira leitura, `nivelCm` e `atualizadoEm` vêm nulos e a faixa é NORMAL.
 */
export type StatusAtualSensor = {
  sensorCodigo: string;
  areaRiscoId: number;
  nivelCm: number | null;
  faixa: Faixa;
  atualizadoEm: string | null;
};
