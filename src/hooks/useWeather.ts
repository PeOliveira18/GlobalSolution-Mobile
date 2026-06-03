import { useCallback, useEffect, useState } from 'react';
import { AgricultureArea } from '../types/agricultureArea';
import { calculateAgriculturalRisk, generateAlerts } from '../utils/riskCalculator';

export function useWeather(initialAreas: AgricultureArea[]) {
  const [areas, setAreas] = useState<AgricultureArea[]>(initialAreas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reloadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const updatedAreas = initialAreas.map((area) => {
        const weather = {
          ...area.weather,
          updatedAt: new Date().toISOString(),
        };
        const risk = calculateAgriculturalRisk(weather);

        return {
          ...area,
          weather,
          risk,
          alerts: generateAlerts(area.id, weather),
          lastUpdate: weather.updatedAt,
        };
      });

      setAreas(updatedAreas);
    } catch {
      setError('Nao foi possivel atualizar os dados climaticos.');
      setAreas(initialAreas);
    } finally {
      setLoading(false);
    }
  }, [initialAreas]);

  useEffect(() => {
    reloadWeather();
  }, [reloadWeather]);

  return {
    areas,
    loading,
    error,
    reload: reloadWeather,
  };
}
