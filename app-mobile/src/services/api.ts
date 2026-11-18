import { apiReal } from './api-real';
import { USAR_MOCK } from './config';
import type { ApiOlhoDagua } from './contrato';
import { apiMock } from './mock/api-mock';

export const api: ApiOlhoDagua = USAR_MOCK ? apiMock : apiReal;

export const FONTE_DE_DADOS = USAR_MOCK ? 'mock' : 'api';

export type { ApiOlhoDagua } from './contrato';
export { ErroApi, mensagemParaMorador } from './erros';
