export type WeatherCondition =
  | 'Ensolarado'
  | 'Parcialmente nublado'
  | 'Nublado'
  | 'Chuva'
  | 'Tempestade'
  | 'Neblina';

export type WeatherData = {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  condition: WeatherCondition;
  updatedAt: string;
};

export type OpenWeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
};
