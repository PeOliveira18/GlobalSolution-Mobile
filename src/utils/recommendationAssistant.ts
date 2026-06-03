import { AgricultureArea } from '../types/agricultureArea';
import { RiskLevel } from '../types/risk';
import { getRiskWeight } from './riskCalculator';

export type RecommendationPriority = 'baixa' | 'media' | 'alta' | 'critica';

export type RecommendationInsight = {
  id: string;
  title: string;
  message: string;
  level: RiskLevel;
  priority: RecommendationPriority;
  timeframe: string;
  reason: string;
  areaName?: string;
};

function mapPriority(level: RiskLevel): RecommendationPriority {
  if (level === 'CRITICO') return 'critica';
  if (level === 'ALTO') return 'alta';
  if (level === 'MEDIO') return 'media';
  return 'baixa';
}

function createInsight(
  area: AgricultureArea,
  id: string,
  title: string,
  message: string,
  level: RiskLevel,
  timeframe: string,
  reason: string,
): RecommendationInsight {
  return {
    id: `${area.id}-${id}`,
    title,
    message,
    level,
    priority: mapPriority(level),
    timeframe,
    reason,
    areaName: area.name,
  };
}

function getCultureReason(area: AgricultureArea, climateReason: string): string {
  const cultureReasons = {
    Soja: 'Soja tem queda de desempenho quando calor e deficit hidrico persistem.',
    Milho: 'Milho e sensivel a estresse hidrico em fases de desenvolvimento e enchimento de graos.',
    Cafe: 'Cafe exige atencao especial a frio intenso, geada e estresse hidrico.',
    'Cana-de-acucar': 'Cana-de-acucar tolera calor, mas operacoes e solo molhado afetam produtividade.',
    Hortalicas: 'Hortalicas perdem agua rapidamente e exigem resposta rapida a calor ou seca.',
    Algodao: 'Algodao exige cuidado com vento forte por causa de deriva e perdas em aplicacoes.',
  }[area.culture];

  return `${climateReason} ${cultureReasons}`;
}

export function buildAreaRecommendations(area: AgricultureArea): RecommendationInsight[] {
  const { weather } = area;
  const recommendations: RecommendationInsight[] = [];

  if (weather.temperature > 40) {
    recommendations.push(
      createInsight(
        area,
        'heat-critical',
        'Acionar protocolo de calor extremo',
        'Reduza operacoes no periodo mais quente e proteja talhoes sensiveis.',
        'CRITICO',
        'Nas proximas 2h',
        getCultureReason(area, `Temperatura de ${weather.temperature} C indica calor extremo.`),
      ),
    );
  }

  if (weather.temperature > 35 && weather.humidity < 30) {
    recommendations.push(
      createInsight(
        area,
        'irrigation',
        'Priorizar irrigacao preventiva',
        'Aumente a disponibilidade de agua antes de novas atividades no campo.',
        'ALTO',
        'Nas proximas 6h',
        getCultureReason(
          area,
          `Calor de ${weather.temperature} C combinado com umidade de ${weather.humidity}% aumenta estresse hidrico.`,
        ),
      ),
    );
  }

  if (weather.humidity < 20) {
    recommendations.push(
      createInsight(
        area,
        'dry-critical',
        'Reforcar manejo contra seca',
        'Revisar irrigacao, cobertura do solo e disponibilidade de agua.',
        'CRITICO',
        'Imediatamente',
        getCultureReason(area, `Umidade critica de ${weather.humidity}% eleva o risco de perda de vigor.`),
      ),
    );
  }

  if (weather.windSpeed > 40) {
    recommendations.push(
      createInsight(
        area,
        'wind',
        'Evitar pulverizacao',
        'Adie aplicacoes e operacoes sensiveis ate o vento reduzir.',
        'ALTO',
        'Hoje',
        getCultureReason(area, `Vento de ${weather.windSpeed} km/h aumenta deriva e perda operacional.`),
      ),
    );
  }

  if (weather.temperature < 5) {
    recommendations.push(
      createInsight(
        area,
        'frost',
        'Monitorar risco de geada',
        'Reforce protecao preventiva e acompanhe a lavoura durante a madrugada.',
        'ALTO',
        'Durante a madrugada',
        getCultureReason(area, `Temperatura de ${weather.temperature} C pode indicar frio severo.`),
      ),
    );
  }

  if (weather.rainChance > 70) {
    recommendations.push(
      createInsight(
        area,
        'rain',
        'Replanejar operacoes em solo',
        'Evite atividades que dependem de solo seco ou aplicacoes em campo aberto.',
        'MEDIO',
        'Nas proximas 24h',
        getCultureReason(area, `Chance de chuva de ${weather.rainChance}% pode afetar trafegabilidade.`),
      ),
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      createInsight(
        area,
        'stable',
        'Manter monitoramento preventivo',
        'Continue acompanhando clima e alertas antes de novas decisoes operacionais.',
        'BAIXO',
        'Hoje',
        getCultureReason(area, 'Condicoes climaticas estao estaveis no momento.'),
      ),
    );
  }

  return recommendations.sort((a, b) => getRiskWeight(b.level) - getRiskWeight(a.level));
}

export function buildDailyRecommendations(areas: AgricultureArea[]): RecommendationInsight[] {
  const priorityRecommendations = areas
    .flatMap(buildAreaRecommendations)
    .filter((recommendation) => recommendation.level !== 'BAIXO')
    .sort((a, b) => getRiskWeight(b.level) - getRiskWeight(a.level));

  if (priorityRecommendations.length) {
    return priorityRecommendations;
  }

  const firstArea = areas[0];

  if (!firstArea) {
    return [];
  }

  return [
    {
      id: 'daily-stable',
      title: 'Operacao em condicao estavel',
      message: 'Nao ha alertas severos. Continue acompanhando clima, umidade e vento.',
      level: 'BAIXO',
      priority: 'baixa',
      timeframe: 'Hoje',
      reason: 'Todas as areas monitoradas estao sem sinais climaticos severos neste momento.',
      areaName: 'Todas as areas',
    },
  ];
}

export function getDailyRecommendation(areas: AgricultureArea[]): string {
  const highestRiskArea = [...areas].sort(
    (a, b) => getRiskWeight(b.risk.level) - getRiskWeight(a.risk.level),
  )[0];

  if (!highestRiskArea) {
    return 'Sem areas monitoradas para gerar recomendacao.';
  }

  if (highestRiskArea.risk.level === 'CRITICO') {
    return `Priorize ${highestRiskArea.name}: ha risco critico e necessidade de acao preventiva imediata.`;
  }

  if (highestRiskArea.risk.level === 'ALTO') {
    return `Acompanhe ${highestRiskArea.name} nas proximas horas e revise operacoes sensiveis.`;
  }

  if (highestRiskArea.risk.level === 'MEDIO') {
    return `Mantenha ${highestRiskArea.name} em observacao antes de novas atividades no campo.`;
  }

  return 'As areas estao em condicao estavel. Mantenha monitoramento preventivo e revisao diaria dos alertas.';
}
