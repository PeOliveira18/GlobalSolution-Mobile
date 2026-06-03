export type OpenMeteoClimateData = {
  observedAt: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  rain: number;
  updatedAt: string;
};

type OpenMeteoResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    precipitation?: number;
    rain?: number;
  };
};

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_CURRENT = 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,rain';

function formatObservedAt(value?: string): string {
  if (!value) {
    return 'Agora';
  }

  const [date, time = ''] = value.split('T');
  const [year, month, day] = date.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}${time ? ` ${time.slice(0, 5)}` : ''}`;
}

export const openMeteoService = {
  async getClimateByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<OpenMeteoClimateData | null> {
    try {
      const query = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: OPEN_METEO_CURRENT,
        timezone: 'America/Sao_Paulo',
      });

      const response = await fetch(`${OPEN_METEO_URL}?${query.toString()}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = (await response.json()) as OpenMeteoResponse;
      const current = data.current;

      if (!current) {
        return null;
      }

      return {
        observedAt: formatObservedAt(current.time),
        temperature: Math.round(current.temperature_2m ?? 0),
        humidity: Math.round(current.relative_humidity_2m ?? 0),
        windSpeed: Math.round(current.wind_speed_10m ?? 0),
        precipitation: Number((current.precipitation ?? 0).toFixed(1)),
        rain: Number((current.rain ?? 0).toFixed(1)),
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },
};
