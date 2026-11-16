import { useEffect, useState } from 'react';

import { mensagemParaMorador } from '@/services/api';

/**
 * Carrega dados da API ao abrir a tela e permite recarregar (puxar para atualizar).
 * `carregar` deve vir de um `useCallback`: quando o que ele usa muda (ex.: o filtro),
 * os dados são buscados de novo, mantendo os antigos na tela até os novos chegarem.
 */
export function useCarregar<T>(carregar: () => Promise<T>) {
  const [dados, setDados] = useState<T>();
  const [erro, setErro] = useState<string>();
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    // Se a tela fechar ou outra busca começar, a resposta antiga é ignorada.
    let valida = true;
    carregar()
      .then((novos) => {
        if (!valida) return;
        setDados(novos);
        setErro(undefined);
      })
      .catch((e) => valida && setErro(mensagemParaMorador(e)))
      .finally(() => {
        if (!valida) return;
        setCarregando(false);
        setAtualizando(false);
      });
    return () => {
      valida = false;
    };
  }, [carregar, versao]);

  const recarregar = () => {
    setAtualizando(true);
    setVersao((v) => v + 1);
  };

  return { dados, erro, carregando, atualizando, recarregar };
}
