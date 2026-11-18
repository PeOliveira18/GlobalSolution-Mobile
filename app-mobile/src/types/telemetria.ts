export type Faixa = 'NORMAL' | 'ATENCAO' | 'ALERTA' | 'EMERGENCIA';

export type TipoSensor = 'NIVEL' | 'CHUVA';

export type Unidade = 'CM' | 'MM_H';

export type StatusSensor = 'ATIVO' | 'MANUTENCAO' | 'INATIVO';

export type Sensor = {
  codigo: string;
  tipo: TipoSensor;
  unidade: Unidade;
  areaRiscoId: number;
  latitude: number;
  longitude: number;
  alturaInstalacaoCm: number | null;
  limiteAtencao: number;
  limiteAlerta: number;
  limiteEmergencia: number;
  status: StatusSensor;
};

export type StatusAtualSensor = {
  sensorCodigo: string;
  areaRiscoId: number;
  nivelCm: number | null;
  faixa: Faixa;
  atualizadoEm: string | null;
};
