export type RiskLevel = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export type RiskResult = {
  level: RiskLevel;
  score: number;
  label: string;
  recommendation: string;
  reasons: string[];
};
