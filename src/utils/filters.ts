import { AgricultureArea } from '../types/agricultureArea';
import { RiskLevel } from '../types/risk';
import { getRiskWeight } from './riskCalculator';

export type RiskFilter = 'TODOS' | RiskLevel;

export function filterAreas(
  areas: AgricultureArea[],
  search: string,
  riskFilter: RiskFilter,
): AgricultureArea[] {
  const normalizedSearch = search.trim().toLowerCase();

  return areas
    .filter((area) => {
      const matchesSearch =
        !normalizedSearch ||
        area.city.toLowerCase().includes(normalizedSearch) ||
        area.culture.toLowerCase().includes(normalizedSearch) ||
        area.name.toLowerCase().includes(normalizedSearch);

      const matchesRisk = riskFilter === 'TODOS' || area.risk.level === riskFilter;

      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => getRiskWeight(b.risk.level) - getRiskWeight(a.risk.level));
}
