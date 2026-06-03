import { AgriculturalAlert } from '../types/alert';
import { RiskLevel, RiskResult } from '../types/risk';
import { WeatherData } from '../types/weather';

const riskWeight: Record<RiskLevel, number> = {
  BAIXO: 1,
  MEDIO: 2,
  ALTO: 3,
  CRITICO: 4,
};

export function getRiskWeight(level: RiskLevel): number {
  return riskWeight[level];
}

export function calculateAgriculturalRisk(weather: WeatherData): RiskResult {
  const reasons: string[] = [];
  let score = 0;

  if (weather.temperature > 40) {
    score += 4;
    reasons.push('calor extremo acima de 40 C');
  } else if (weather.temperature > 35 && weather.humidity < 30) {
    score += 3;
    reasons.push('calor alto combinado com baixa umidade');
  } else if (weather.temperature < 5) {
    score += 3;
    reasons.push('temperatura com risco de geada');
  }

  if (weather.humidity < 20) {
    score += 4;
    reasons.push('umidade critica abaixo de 20%');
  } else if (weather.humidity < 30) {
    score += 2;
    reasons.push('baixa umidade no ar');
  }

  if (weather.windSpeed > 40) {
    score += 3;
    reasons.push('vento forte para pulverizacao');
  }

  if (weather.rainChance > 70) {
    score += 2;
    reasons.push('alta chance de chuva');
  }

  if (score >= 7) {
    return {
      level: 'CRITICO',
      score,
      label: 'Risco critico',
      recommendation: 'Priorize esta area e acompanhe a lavoura nas proximas horas.',
      reasons,
    };
  }

  if (score >= 5) {
    return {
      level: 'ALTO',
      score,
      label: 'Risco alto',
      recommendation: 'Reforce irrigacao, revise operacoes e monitore alertas ativos.',
      reasons,
    };
  }

  if (score >= 3) {
    return {
      level: 'MEDIO',
      score,
      label: 'Risco medio',
      recommendation: 'Acompanhe a evolucao do clima antes de novas atividades no campo.',
      reasons,
    };
  }

  return {
    level: 'BAIXO',
    score,
    label: 'Risco baixo',
    recommendation: 'Condicoes estaveis para manejo agricola planejado.',
    reasons: reasons.length ? reasons : ['sem sinais climaticos severos'],
  };
}

export function generateAlerts(areaId: string, weather: WeatherData): AgriculturalAlert[] {
  const now = new Date().toISOString();
  const alerts: AgriculturalAlert[] = [];

  if (weather.temperature > 40) {
    alerts.push({
      id: `${areaId}-heat`,
      areaId,
      title: 'Calor extremo',
      message: 'Temperatura acima de 40 C pode estressar a cultura.',
      level: 'CRITICO',
      type: 'calor',
      createdAt: now,
    });
  }

  if (weather.temperature < 5) {
    alerts.push({
      id: `${areaId}-frost`,
      areaId,
      title: 'Risco de geada',
      message: 'Temperatura baixa exige protecao preventiva da lavoura.',
      level: 'ALTO',
      type: 'geada',
      createdAt: now,
    });
  }

  if (weather.humidity < 20) {
    alerts.push({
      id: `${areaId}-dry-critical`,
      areaId,
      title: 'Seca critica',
      message: 'Umidade muito baixa. Avalie irrigacao e cobertura do solo.',
      level: 'CRITICO',
      type: 'seca',
      createdAt: now,
    });
  } else if (weather.humidity < 30) {
    alerts.push({
      id: `${areaId}-dry`,
      areaId,
      title: 'Baixa umidade',
      message: 'Priorize irrigacao e evite aplicacoes sensiveis.',
      level: 'ALTO',
      type: 'umidade',
      createdAt: now,
    });
  }

  if (weather.windSpeed > 40) {
    alerts.push({
      id: `${areaId}-wind`,
      areaId,
      title: 'Vento forte',
      message: 'Evite pulverizacao para reduzir deriva e perda de insumos.',
      level: 'ALTO',
      type: 'vento',
      createdAt: now,
    });
  }

  if (weather.rainChance > 70) {
    alerts.push({
      id: `${areaId}-rain`,
      areaId,
      title: 'Chuva intensa',
      message: 'Planeje operacoes considerando risco de solo encharcado.',
      level: 'MEDIO',
      type: 'chuva',
      createdAt: now,
    });
  }

  return alerts;
}
