import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  ESCALA_FONTE_GRANDE,
  PALETA_ALTO_CONTRASTE,
  PALETA_PADRAO,
  type Paleta,
} from '@/constants/theme';

export type PreferenciasVisuais = {
  fonteGrande: boolean;
  altoContraste: boolean;
};

type ValorTema = {
  cores: Paleta;
  /** 1 ou 1,3 (fonte grande). O fontScale do sistema é aplicado por cima pelo React Native. */
  escala: number;
  /** Converte um tamanho base (ex.: Fonte.corpo) para o tamanho com a preferência aplicada. */
  tamanho: (base: number) => number;
  preferencias: PreferenciasVisuais;
  definirFonteGrande: (ativo: boolean) => void;
  definirAltoContraste: (ativo: boolean) => void;
};

const ContextoTema = createContext<ValorTema | null>(null);

type ProvedorTemaProps = {
  children: ReactNode;
  /** Valores lidos da tabela `preferencias` do SQLite ao abrir o app. */
  inicial?: Partial<PreferenciasVisuais>;
  /** Chamado a cada mudança, para gravar no SQLite. Deve ser estável (useCallback). */
  aoMudar?: (preferencias: PreferenciasVisuais) => void;
};

/** Guarda as preferências de acessibilidade e entrega a paleta e a escala para todas as telas. */
export function ProvedorTema({ children, inicial, aoMudar }: ProvedorTemaProps) {
  const [preferencias, setPreferencias] = useState<PreferenciasVisuais>({
    fonteGrande: inicial?.fonteGrande ?? false,
    altoContraste: inicial?.altoContraste ?? false,
  });

  // Grava cada mudança (o valor inicial já veio do banco, então é pulado).
  const primeiraVez = useRef(true);
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    aoMudar?.(preferencias);
  }, [preferencias, aoMudar]);

  const definirFonteGrande = useCallback(
    (ativo: boolean) => setPreferencias((p) => ({ ...p, fonteGrande: ativo })),
    [],
  );
  const definirAltoContraste = useCallback(
    (ativo: boolean) => setPreferencias((p) => ({ ...p, altoContraste: ativo })),
    [],
  );

  const valor = useMemo<ValorTema>(() => {
    const escala = preferencias.fonteGrande ? ESCALA_FONTE_GRANDE : 1;
    return {
      cores: preferencias.altoContraste ? PALETA_ALTO_CONTRASTE : PALETA_PADRAO,
      escala,
      tamanho: (base) => Math.round(base * escala),
      preferencias,
      definirFonteGrande,
      definirAltoContraste,
    };
  }, [preferencias, definirFonteGrande, definirAltoContraste]);

  return <ContextoTema.Provider value={valor}>{children}</ContextoTema.Provider>;
}

export function useTema(): ValorTema {
  const valor = useContext(ContextoTema);
  if (!valor) throw new Error('useTema precisa estar dentro de <ProvedorTema>.');
  return valor;
}
