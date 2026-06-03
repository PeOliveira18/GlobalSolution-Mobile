export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatRelativeUpdate(value: string): string {
  const date = new Date(value).getTime();
  const diffInMinutes = Math.max(1, Math.round((Date.now() - date) / 60000));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atras`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  return `${diffInHours} h atras`;
}
