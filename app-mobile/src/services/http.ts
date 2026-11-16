import type { ProblemDetails } from '@/types';

import { TIMEOUT_MS } from './config';
import { ErroApi } from './erros';

type Metodo = 'GET' | 'POST' | 'PATCH';

type Consulta = Record<string, string | number | boolean | null | undefined>;

/** Monta a URL com a query string, ignorando os parâmetros vazios. */
export function montarUrl(base: string, caminho: string, consulta?: Consulta): string {
  const params = Object.entries(consulta ?? {})
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`);
  return `${base}${caminho}${params.length ? `?${params.join('&')}` : ''}`;
}

/**
 * Chamada HTTP com JSON e timeout.
 * Erros viram `ErroApi`; respostas de erro das APIs trazem o ProblemDetails (B5).
 */
export async function requisitar<T>(metodo: Metodo, url: string, corpo?: unknown): Promise<T> {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TIMEOUT_MS);

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(corpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
  } catch (erro) {
    if (controle.signal.aborted) {
      throw new ErroApi('timeout', 0, `Tempo esgotado ao chamar ${url}`);
    }
    throw new ErroApi('rede', 0, `Falha de rede ao chamar ${url}: ${String(erro)}`);
  } finally {
    clearTimeout(relogio);
  }

  if (!resposta.ok) {
    const problema = await lerJson<ProblemDetails>(resposta);
    throw new ErroApi(
      'http',
      resposta.status,
      problema?.title ?? `Erro ${resposta.status} ao chamar ${url}`,
      problema,
    );
  }

  // 204 (PATCH): sem corpo.
  if (resposta.status === 204) return undefined as T;
  return (await lerJson<T>(resposta)) as T;
}

async function lerJson<T>(resposta: Response): Promise<T | undefined> {
  const texto = await resposta.text();
  if (!texto) return undefined;
  try {
    return JSON.parse(texto) as T;
  } catch {
    return undefined;
  }
}
