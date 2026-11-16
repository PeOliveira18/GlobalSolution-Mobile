import { lerData } from './datas';

/** 235 → "2,35 m" (mesmo formato das mensagens do Serviço do Cidadão). */
export function formatarMetros(centimetros: number): string {
  return `${(centimetros / 100).toFixed(2).replace('.', ',')} m`;
}

/** 450 → "450 m" · 1234 → "1,2 km". */
export function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`;
}

/** Data e hora curtas: "15/11 às 18:42". */
export function formatarDataHora(iso: string): string {
  const data = lerData(iso);
  const dia = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
  return `${dia} às ${formatarHora(iso)}`;
}

/**
 * Quando algo aconteceu, do jeito mais curto sem enganar:
 * hoje → "18:42" · outro dia → "15/11 às 18:42".
 */
export function formatarQuando(iso: string): string {
  const data = lerData(iso);
  const hoje = new Date();
  const ehHoje =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();
  return ehHoje ? formatarHora(iso) : formatarDataHora(iso);
}

/** "2026-11-15T18:42:00-03:00" → "18:42" no horário do celular. */
export function formatarHora(iso: string): string {
  const data = lerData(iso);
  return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}
