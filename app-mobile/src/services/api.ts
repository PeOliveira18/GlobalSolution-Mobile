import { apiReal } from '@/services/apiReal';
import { USAR_MOCK } from '@/services/config';
import type { ApiOlhoDagua } from '@/services/contrato';
import { apiMock } from '@/services/mock/apiMock';

export const api: ApiOlhoDagua = USAR_MOCK ? apiMock : apiReal;

export const FONTE_DE_DADOS = USAR_MOCK ? 'mock' : 'api';

export type { ApiOlhoDagua } from '@/services/contrato';
export { ErroApi, mensagemParaMorador } from '@/services/erros';
