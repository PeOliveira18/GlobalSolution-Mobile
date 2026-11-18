let conectado = true;

export function definirConectado(valor: boolean) {
  conectado = valor;
}

export function estaConectado(): boolean {
  return conectado;
}
