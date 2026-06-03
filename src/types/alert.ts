import { RiskLevel } from './risk';

export type AgriculturalAlert = {
  id: string;
  areaId: string;
  title: string;
  message: string;
  level: RiskLevel;
  type: 'seca' | 'geada' | 'vento' | 'chuva' | 'calor' | 'umidade';
  createdAt: string;
};
