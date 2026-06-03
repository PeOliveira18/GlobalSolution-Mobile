import { openWeatherApi } from './api';
import { OpenWeatherResponse, WeatherCondition, WeatherData } from '../types/weather';

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

function mapWeatherCondition(condition: string): WeatherCondition {
  const normalized = condition.toLowerCase();

  if (normalized.includes('thunder')) return 'Tempestade';
  if (normalized.includes('rain') || normalized.includes('drizzle')) return 'Chuva';
  if (normalized.includes('cloud')) return 'Nublado';
  if (normalized.includes('mist') || normalized.includes('fog')) return 'Neblina';
  if (normalized.includes('clear')) return 'Ensolarado';

  return 'Parcialmente nublado';
}

function estimateRainChance(data: OpenWeatherResponse): number {
  if (data.rain?.['1h'] || data.rain?.['3h']) {
    return 80;
  }

  const main = data.weather[0]?.main.toLowerCase() ?? '';
  if (main.includes('rain')) return 70;
  if (main.includes('cloud')) return 35;

  return 15;
}

export const weatherService = {
  async getCurrentWeatherByCity(city: string): Promise<WeatherData | null> {
    if (!OPENWEATHER_API_KEY) {
      return null;
    }

    const response = await openWeatherApi.get<OpenWeatherResponse>('/weather', {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });

    return {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6),
      rainChance: estimateRainChance(response.data),
      condition: mapWeatherCondition(response.data.weather[0]?.main ?? ''),
      updatedAt: new Date().toISOString(),
    };
  },

  async getCurrentWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData | null> {
    if (!OPENWEATHER_API_KEY) {
      return null;
    }

    const response = await openWeatherApi.get<OpenWeatherResponse>('/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });

    return {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6),
      rainChance: estimateRainChance(response.data),
      condition: mapWeatherCondition(response.data.weather[0]?.main ?? ''),
      updatedAt: new Date().toISOString(),
    };
  },
};
