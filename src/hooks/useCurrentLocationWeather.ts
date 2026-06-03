import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types/weather';
import { RiskResult } from '../types/risk';
import { calculateAgriculturalRisk } from '../utils/riskCalculator';
import { RecommendationInsight } from '../utils/recommendationAssistant';

type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

type CurrentLocationWeatherState = {
  coordinates: LocationCoordinates | null;
  regionName: string;
  regionDetails: string;
  weather: WeatherData | null;
  risk: RiskResult | null;
  recommendations: RecommendationInsight[];
  loading: boolean;
  error: string;
};

function formatRegionName(address?: Location.LocationGeocodedAddress): string {
  if (!address) {
    return 'Regiao atual';
  }

  return address.city ?? address.subregion ?? address.district ?? address.region ?? 'Regiao atual';
}

function formatRegionDetails(address?: Location.LocationGeocodedAddress): string {
  if (!address) {
    return 'Localizacao detectada pelo aparelho';
  }

  const details = [address.region, address.country].filter(Boolean);
  return details.length ? details.join(', ') : 'Localizacao detectada pelo aparelho';
}

function buildLocationRecommendations(
  weather: WeatherData,
  risk: RiskResult,
  regionName: string,
): RecommendationInsight[] {
  const recommendations: RecommendationInsight[] = [];

  if (weather.temperature > 35 && weather.humidity < 30) {
    recommendations.push({
      id: 'location-irrigation',
      title: 'Priorizar irrigacao preventiva',
      message: 'Calor e baixa umidade indicam maior risco de estresse hidrico.',
      level: risk.level,
      priority: risk.level === 'CRITICO' ? 'critica' : 'alta',
      timeframe: 'Nas proximas 6h',
      reason: `Temperatura de ${weather.temperature} C e umidade de ${weather.humidity}% indicam perda rapida de agua no solo.`,
      areaName: regionName,
    });
  }

  if (weather.windSpeed > 40) {
    recommendations.push({
      id: 'location-wind',
      title: 'Evitar operacoes sensiveis ao vento',
      message: 'Vento forte pode comprometer aplicacoes e deslocamentos no campo.',
      level: 'ALTO',
      priority: 'alta',
      timeframe: 'Hoje',
      reason: `Vento de ${weather.windSpeed} km/h aumenta risco operacional e perdas em aplicacoes.`,
      areaName: regionName,
    });
  }

  if (weather.temperature < 5) {
    recommendations.push({
      id: 'location-frost',
      title: 'Monitorar frio intenso',
      message: 'Temperatura baixa exige atencao a culturas sensiveis.',
      level: 'ALTO',
      priority: 'alta',
      timeframe: 'Durante a madrugada',
      reason: `Temperatura de ${weather.temperature} C pode favorecer frio severo ou geada localizada.`,
      areaName: regionName,
    });
  }

  if (weather.rainChance > 70) {
    recommendations.push({
      id: 'location-rain',
      title: 'Replanejar atividades externas',
      message: 'Alta chance de chuva pode afetar solo, colheita e transporte.',
      level: 'MEDIO',
      priority: 'media',
      timeframe: 'Nas proximas 24h',
      reason: `Chance de chuva de ${weather.rainChance}% pede revisao das atividades em campo aberto.`,
      areaName: regionName,
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      id: 'location-stable',
      title: 'Manter acompanhamento',
      message: 'Condicoes estaveis para planejamento das atividades locais.',
      level: 'BAIXO',
      priority: 'baixa',
      timeframe: 'Hoje',
      reason: 'Temperatura, umidade, vento e chuva nao indicam risco severo neste momento.',
      areaName: regionName,
    });
  }

  return recommendations;
}

export function useCurrentLocationWeather(): CurrentLocationWeatherState & {
  loadCurrentLocationWeather: () => Promise<void>;
} {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [regionName, setRegionName] = useState('Minha regiao');
  const [regionDetails, setRegionDetails] = useState('Toque para detectar sua localizacao');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCurrentLocationWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setError('Permissao de localizacao nao concedida.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const nextCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      let nextRegionName = 'Regiao atual';
      let nextRegionDetails = 'Localizacao detectada pelo aparelho';

      try {
        const addresses = await Location.reverseGeocodeAsync(nextCoordinates);
        const address = addresses[0];
        nextRegionName = formatRegionName(address);
        nextRegionDetails = formatRegionDetails(address);
      } catch {
        nextRegionName = 'Regiao atual';
        nextRegionDetails = 'Localizacao detectada pelo aparelho';
      }

      const nextWeather = await weatherService.getCurrentWeatherByCoordinates(
        nextCoordinates.latitude,
        nextCoordinates.longitude,
      );

      if (!nextWeather) {
        setError('Nao foi possivel carregar o clima da sua regiao.');
        setCoordinates(nextCoordinates);
        setRegionName(nextRegionName);
        setRegionDetails(nextRegionDetails);
        setWeather(null);
        return;
      }

      setCoordinates(nextCoordinates);
      setRegionName(nextRegionName === 'Regiao atual' ? nextWeather.city : nextRegionName);
      setRegionDetails(nextRegionDetails);
      setWeather(nextWeather);
    } catch {
      setError('Nao foi possivel carregar o clima da sua regiao.');
    } finally {
      setLoading(false);
    }
  }, []);

  const risk = useMemo(() => (weather ? calculateAgriculturalRisk(weather) : null), [weather]);
  const recommendations = useMemo(
    () => (weather && risk ? buildLocationRecommendations(weather, risk, regionName) : []),
    [regionName, risk, weather],
  );

  return {
    coordinates,
    regionName,
    regionDetails,
    weather,
    risk,
    recommendations,
    loading,
    error,
    loadCurrentLocationWeather,
  };
}
