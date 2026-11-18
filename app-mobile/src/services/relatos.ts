import type { RelatoLocal } from '@/db/repositorio';

import { api, ErroApi, mensagemParaMorador } from './api';

export type ResultadoEnvio =
  | { tipo: 'enviado'; idServidor: number }
  | { tipo: 'pendente' }
  | { tipo: 'erro'; mensagem: string };

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
