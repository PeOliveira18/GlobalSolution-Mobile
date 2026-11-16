/**
 * Configuração lida das variáveis de ambiente (B3 do PLANO.md).
 *
 * O Expo só troca `process.env.EXPO_PUBLIC_*` pelo valor quando a variável é lida
 * diretamente assim (sem desestruturar), na hora de gerar o bundle.
 * Depois de mudar o `.env`, reinicie o `npx expo start`.
 */

/** Modo mock é o padrão: só desliga com `EXPO_PUBLIC_USE_MOCK=false`. */
export const USAR_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

/** No celular físico, troque `localhost` pelo IP do computador na rede. */
export const URL_API_CIDADAO = process.env.EXPO_PUBLIC_API_CIDADAO ?? 'http://localhost:5080/api';

export const URL_API_TELEMETRIA = process.env.EXPO_PUBLIC_API_TELEMETRIA ?? 'http://localhost:8081/api';

/** Tempo máximo de espera de cada chamada às APIs. */
export const TIMEOUT_MS = 10000;
