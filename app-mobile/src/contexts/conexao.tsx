import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { definirConectado } from '@/services/conexao';

const ContextoConexao = createContext<{ online: boolean }>({ online: true });

export function ProvedorConexao({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true);

  useEffect(
    () =>
      NetInfo.addEventListener((estado) => {
        const conectado = estado.isConnected !== false && estado.isInternetReachable !== false;
        definirConectado(conectado);
        setOnline(conectado);
      }),
    [],
  );

  return <ContextoConexao.Provider value={{ online }}>{children}</ContextoConexao.Provider>;
}

export function useConexao() {
  return useContext(ContextoConexao);
}
