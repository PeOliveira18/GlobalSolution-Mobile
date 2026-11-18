import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChavePreferencia =
  | 'area_id'
  | 'dispositivo_id'
  | 'fonte_grande'
  | 'alto_contraste'
  | 'confirmados'
  | 'inscricao_pendente'
  | 'areas';

const PREFIXO = '@olhodagua:';

const CHAVES: ChavePreferencia[] = [
  'area_id',
  'dispositivo_id',
  'fonte_grande',
  'alto_contraste',
  'confirmados',
  'inscricao_pendente',
  'areas',
];

export async function lerPreferencias(): Promise<Partial<Record<ChavePreferencia, string>>> {
  const pares = await AsyncStorage.multiGet(CHAVES.map((chave) => PREFIXO + chave));
  const preferencias: Partial<Record<ChavePreferencia, string>> = {};
  pares.forEach(([chaveCompleta, valor], indice) => {
    if (valor !== null && chaveCompleta === PREFIXO + CHAVES[indice]) {
      preferencias[CHAVES[indice]] = valor;
    }
  });
  return preferencias;
}

export async function salvarPreferencia(chave: ChavePreferencia, valor: string): Promise<void> {
  await AsyncStorage.setItem(PREFIXO + chave, valor);
}

export async function apagarPreferencia(chave: ChavePreferencia): Promise<void> {
  await AsyncStorage.removeItem(PREFIXO + chave);
}

export async function apagarPreferencias(): Promise<void> {
  await AsyncStorage.multiRemove(CHAVES.map((chave) => PREFIXO + chave));
}
