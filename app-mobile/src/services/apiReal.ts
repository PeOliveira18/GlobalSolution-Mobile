import { URL_API_CIDADAO, URL_API_TELEMETRIA } from '@/services/config';
import type { ApiOlhoDagua } from '@/services/contrato';
import { montarUrl, requisitar } from '@/services/http';

const cidadao = (caminho: string, consulta?: Parameters<typeof montarUrl>[2]) =>
  montarUrl(URL_API_CIDADAO, caminho, consulta);

const telemetria = (caminho: string, consulta?: Parameters<typeof montarUrl>[2]) =>
  montarUrl(URL_API_TELEMETRIA, caminho, consulta);

export const apiReal: ApiOlhoDagua = {
  listarAreas: () => requisitar('GET', cidadao('/areas')),
  obterArea: (id) => requisitar('GET', cidadao(`/areas/${id}`)),
  rankingAreas: (dias = 7) => requisitar('GET', cidadao('/areas/ranking', { dias })),

  listarAlertas: (filtro = {}) =>
    requisitar('GET', cidadao('/alertas', { areaId: filtro.areaId, ativos: filtro.ativos ?? true })),
  obterAlerta: (id) => requisitar('GET', cidadao(`/alertas/${id}`)),

  listarOcorrencias: (filtro = {}) =>
    requisitar('GET', cidadao('/ocorrencias', { areaId: filtro.areaId, status: filtro.status })),
  registrarOcorrencia: (relato) => requisitar('POST', cidadao('/ocorrencias'), relato),
  confirmarOcorrencia: (id) => requisitar('POST', cidadao(`/ocorrencias/${id}/confirmar`)),
  resolverOcorrencia: (id) => requisitar('PATCH', cidadao(`/ocorrencias/${id}/resolver`)),

  listarAbrigos: (areaId) => requisitar('GET', cidadao('/abrigos', { areaId })),
  obterAbrigo: (id) => requisitar('GET', cidadao(`/abrigos/${id}`)),
  abrigosProximos: ({ lat, lon, acessivel, limite = 5 }) =>
    requisitar('GET', cidadao('/abrigos/proximos', { lat, lon, acessivel, limite })),
  registrarEntradaAbrigo: (id, pessoas) =>
    requisitar('POST', cidadao(`/abrigos/${id}/entrada`), { pessoas }),

  salvarInscricao: (inscricao) => requisitar('POST', cidadao('/inscricoes'), inscricao),
  obterInscricao: (dispositivoId) =>
    requisitar('GET', cidadao(`/inscricoes/${encodeURIComponent(dispositivoId)}`)),

  listarSensores: (areaRiscoId) => requisitar('GET', telemetria('/sensores', { areaRiscoId })),
  statusSensor: (codigo) =>
    requisitar('GET', telemetria(`/sensores/${encodeURIComponent(codigo)}/status`)),
};
