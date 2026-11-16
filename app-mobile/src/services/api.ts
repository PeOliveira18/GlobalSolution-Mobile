import { apiReal } from './api-real';
import { USAR_MOCK } from './config';
import type { ApiOlhoDagua } from './contrato';
import { apiMock } from './mock/api-mock';

/**
 * Ponto único de acesso aos dados. As telas sempre importam daqui:
 *
 *   import { api } from '@/services/api';
 *   const alertas = await api.listarAlertas({ areaId: 1 });
 *
 * Com `EXPO_PUBLIC_USE_MOCK=true` (padrão) responde com os JSONs de `services/mock/`;
 * com `false`, chama o Serviço do Cidadão e o de Telemetria de verdade.
 */
export const api: ApiOlhoDagua = USAR_MOCK ? apiMock : apiReal;

export const FONTE_DE_DADOS = USAR_MOCK ? 'mock' : 'api';

export type { ApiOlhoDagua } from './contrato';
export { ErroApi, mensagemParaMorador } from './erros';
