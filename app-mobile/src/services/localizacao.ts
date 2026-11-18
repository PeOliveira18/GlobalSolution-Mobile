import * as Location from 'expo-location';

export type Coordenadas = { latitude: number; longitude: number };

const TEMPO_MAXIMO_MS = 8000;

export async function obterLocalizacao(): Promise<Coordenadas | null> {
  const limite = new Promise<null>((resolve) => setTimeout(() => resolve(null), TEMPO_MAXIMO_MS));
  return Promise.race([buscar(), limite]);
}

async function buscar(): Promise<Coordenadas | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: posicao.coords.latitude, longitude: posicao.coords.longitude };
  } catch {
    return null;
  }
}
