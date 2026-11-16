import type { RelatoLocal } from '@/db/repositorio';

import { api, ErroApi, mensagemParaMorador } from './api';

export type ResultadoEnvio =
  | { tipo: 'enviado'; idServidor: number }
  | { tipo: 'pendente' }
  | { tipo: 'erro'; mensagem: string };

/**
 * Envia um relato ao Serviço do Cidadão (POST /api/ocorrencias).
 * - Sem internet, servidor fora do ar ou com erro 5xx → fica PENDENTE para enviar depois (fila da M4).
 * - O `idLocalApp` garante que reenviar o mesmo relato não cria duplicata no servidor.
 */
export async function enviarRelato(relato: RelatoLocal): Promise<ResultadoEnvio> {
  try {
    const criado = await api.registrarOcorrencia({
      areaRiscoId: relato.areaRiscoId,
      tipo: relato.tipo,
      descricao: relato.descricao,
      latitude: relato.latitude,
      longitude: relato.longitude,
      idLocalApp: relato.idLocal,
    });
    return { tipo: 'enviado', idServidor: criado.id };
  } catch (erro) {
    if (erro instanceof ErroApi && erro.temporario) return { tipo: 'pendente' };
    return { tipo: 'erro', mensagem: mensagemParaMorador(erro) };
  }
}
