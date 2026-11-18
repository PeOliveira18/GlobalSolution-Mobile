import type { ProblemDetails } from '@/types';

export type TipoErroApi = 'rede' | 'timeout' | 'http';

export class ErroApi extends Error {
  constructor(
    readonly tipo: TipoErroApi,
    readonly status: number,
    mensagem: string,
    readonly problema?: ProblemDetails,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }

  get semConexao(): boolean {
    return this.tipo === 'rede' || this.tipo === 'timeout';
  }

  get temporario(): boolean {
    return this.semConexao || this.status >= 500;
  }
}

export function mensagemParaMorador(erro: unknown): string {
  if (!(erro instanceof ErroApi)) return 'Algo deu errado. Tente de novo.';
  if (erro.tipo === 'rede') return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
  if (erro.tipo === 'timeout') return 'O servidor demorou para responder. Tente de novo em instantes.';
  if (erro.status >= 500) return 'O servidor está com problema agora. Tente de novo em instantes.';

  const primeiroErroDeCampo = Object.values(erro.problema?.errors ?? {})[0]?.[0];
  if (primeiroErroDeCampo) return primeiroErroDeCampo;
  if (erro.status === 404) return erro.problema?.detail ?? 'Não encontramos essa informação.';
  return erro.problema?.detail ?? erro.problema?.title ?? 'Não foi possível concluir. Tente de novo.';
}
