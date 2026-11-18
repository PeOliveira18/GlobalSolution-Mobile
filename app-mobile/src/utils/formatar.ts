import { lerData } from './datas';

export function formatarMetros(centimetros: number): string {
  return `${(centimetros / 100).toFixed(2).replace('.', ',')} m`;
}

export function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`;
}

export function formatarDataHora(iso: string): string {
  const data = lerData(iso);
  const dia = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
  return `${dia} às ${formatarHora(iso)}`;
}

export function formatarQuando(iso: string): string {
  const data = lerData(iso);
  const hoje = new Date();
  const ehHoje =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();
  return ehHoje ? formatarHora(iso) : formatarDataHora(iso);
}

export function formatarHora(iso: string): string {
  const data = lerData(iso);
  return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}
