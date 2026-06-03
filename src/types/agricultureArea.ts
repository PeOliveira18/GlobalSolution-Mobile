import { AgriculturalAlert } from './alert';
import { RiskResult } from './risk';
import { WeatherData } from './weather';

export type CultureType =
  | 'Soja'
  | 'Milho'
  | 'Cafe'
  | 'Cana-de-acucar'
  | 'Hortalicas'
  | 'Algodao';

export type AgricultureArea = {
  id: string;
  name: string;
  city: string;
  state: string;
  culture: CultureType;
  sizeInHectares: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  weather: WeatherData;
  risk: RiskResult;
  alerts: AgriculturalAlert[];
  lastUpdate: string;
};

export type FavoriteArea = {
  id: string;
  name: string;
  city: string;
  state: string;
  culture: CultureType;
  savedAt: string;
};

export type RecentHistoryItem = {
  areaId: string;
  name: string;
  city: string;
  viewedAt: string;
};
