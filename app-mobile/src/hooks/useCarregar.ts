import { useCallback, useEffect, useState } from 'react';

import { mensagemParaMorador } from '@/services/api';

export function useCarregar<T>(carregar: () => Promise<T>, chave?: unknown) {
  const [dados, setDados] = useState<T>();
  const [erro, setErro] = useState<string>();
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
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
  }, [carregar, versao, chave]);

  const recarregar = useCallback(() => {
    setAtualizando(true);
    setVersao((v) => v + 1);
  }, []);

  return { dados, erro, carregando, atualizando, recarregar };
}
