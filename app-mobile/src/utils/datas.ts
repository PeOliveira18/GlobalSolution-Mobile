/** Fuso de São Paulo (sem horário de verão desde 2019). */
const OFFSET_SAO_PAULO_MS = -3 * 60 * 60 * 1000;

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * Lê uma data ISO 8601 das APIs.
 * O .NET manda até 7 casas de fração de segundo ("20:24:46.0728319+00:00"), e o padrão
 * do JavaScript só garante 3: cortamos o resto para funcionar no Hermes (celular) e no web.
 */
export function lerData(iso: string): Date {
  return new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
}

/** Data no formato ISO 8601 com o fuso de São Paulo, igual ao das APIs: "2026-11-15T18:42:00-03:00". */
export function paraIsoSaoPaulo(data: Date): string {
  const local = new Date(data.getTime() + OFFSET_SAO_PAULO_MS);
  return (
    `${local.getUTCFullYear()}-${doisDigitos(local.getUTCMonth() + 1)}-${doisDigitos(local.getUTCDate())}` +
    `T${doisDigitos(local.getUTCHours())}:${doisDigitos(local.getUTCMinutes())}:${doisDigitos(local.getUTCSeconds())}-03:00`
  );
}
