const OFFSET_SAO_PAULO_MS = -3 * 60 * 60 * 1000;

const doisDigitos = (n: number) => String(n).padStart(2, '0');

export function lerData(iso: string): Date {
  return new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
}

export function paraIsoSaoPaulo(data: Date): string {
  const local = new Date(data.getTime() + OFFSET_SAO_PAULO_MS);
  return (
    `${local.getUTCFullYear()}-${doisDigitos(local.getUTCMonth() + 1)}-${doisDigitos(local.getUTCDate())}` +
    `T${doisDigitos(local.getUTCHours())}:${doisDigitos(local.getUTCMinutes())}:${doisDigitos(local.getUTCSeconds())}-03:00`
  );
}
