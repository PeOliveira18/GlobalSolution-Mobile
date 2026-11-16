/**
 * Estado da conexão, atualizado pelo ProvedorConexao (netinfo).
 * Fica fora do React para o mock poder consultar: assim, no modo mock,
 * "sem internet" se comporta igual ao servidor fora do ar.
 */
let conectado = true;

export function definirConectado(valor: boolean) {
  conectado = valor;
}

export function estaConectado(): boolean {
  return conectado;
}
