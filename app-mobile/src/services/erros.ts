import type { ProblemDetails } from '@/types';

/**
 * - `rede`: sem internet ou servidor fora do ar
 * - `timeout`: o servidor demorou demais para responder
 * - `http`: o servidor respondeu com erro (400, 404, 409, 500...)
 */
export type TipoErroApi = 'rede' | 'timeout' | 'http';

/** Erro único das duas APIs (real e mock), para as telas tratarem tudo do mesmo jeito. */
export class ErroApi extends Error {
  constructor(
    readonly tipo: TipoErroApi,
    /** Status HTTP; 0 quando nem chegou resposta. */
    readonly status: number,
    mensagem: string,
    readonly problema?: ProblemDetails,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }

  /** Sem resposta do servidor (sem internet, servidor desligado ou demorou demais). */
  get semConexao(): boolean {
    return this.tipo === 'rede' || this.tipo === 'timeout';
  }

  /**
   * Problema passageiro: vale guardar e tentar de novo depois (fila offline, cache).
   * Inclui os erros 5xx, que são falha do servidor e não do que o morador enviou.
   */
  get temporario(): boolean {
    return this.semConexao || this.status >= 500;
  }
}

/** Texto simples para mostrar ao morador, sem jargão técnico. */
export function mensagemParaMorador(erro: unknown): string {
  if (!(erro instanceof ErroApi)) return 'Algo deu errado. Tente de novo.';
  if (erro.tipo === 'rede') return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
  if (erro.tipo === 'timeout') return 'O servidor demorou para responder. Tente de novo em instantes.';
  if (erro.status >= 500) return 'O servidor está com problema agora. Tente de novo em instantes.';

  // 400 com erros por campo: mostra a primeira mensagem de validação.
  const primeiroErroDeCampo = Object.values(erro.problema?.errors ?? {})[0]?.[0];
  if (primeiroErroDeCampo) return primeiroErroDeCampo;
  if (erro.status === 404) return erro.problema?.detail ?? 'Não encontramos essa informação.';
  return erro.problema?.detail ?? erro.problema?.title ?? 'Não foi possível concluir. Tente de novo.';
}
