export type AppColorScheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
  primarySoft: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  critical: string;
  tabBar: string;
};

export const lightColors: AppColorScheme = {
  background: '#F6F8F4',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF4EC',
  card: '#FFFFFF',
  text: '#17211A',
  muted: '#667467',
  border: '#DDE6DA',
  primary: '#1D7A46',
  primarySoft: '#DDF1E4',
  secondary: '#285E73',
  success: '#2E7D32',
  warning: '#B7791F',
  danger: '#C2410C',
  critical: '#B91C1C',
  tabBar: '#FFFFFF',
};

export const darkColors: AppColorScheme = {
  background: '#0E1110',
  surface: '#171B19',
  surfaceAlt: '#222823',
  card: '#1B201D',
  text: '#F4F7F2',
  muted: '#B2BDAF',
  border: '#343C36',
  primary: '#17824D',
  primarySoft: '#193424',
  secondary: '#5FB3C8',
  success: '#3AAE63',
  warning: '#E7B84A',
  danger: '#E66A2C',
  critical: '#E5484D',
  tabBar: '#151A17',
};

export const riskColors = {
  BAIXO: '#2E7D32',
  MEDIO: '#B7791F',
  ALTO: '#C2410C',
  CRITICO: '#B91C1C',
};
