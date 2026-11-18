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
  escala: number;
  tamanho: (base: number) => number;
  preferencias: PreferenciasVisuais;
  definirFonteGrande: (ativo: boolean) => void;
  definirAltoContraste: (ativo: boolean) => void;
};

const ContextoTema = createContext<ValorTema | null>(null);

type ProvedorTemaProps = {
  children: ReactNode;
  inicial?: Partial<PreferenciasVisuais>;
  aoMudar?: (preferencias: PreferenciasVisuais) => void;
};

export function ProvedorTema({ children, inicial, aoMudar }: ProvedorTemaProps) {
  const [preferencias, setPreferencias] = useState<PreferenciasVisuais>({
    fonteGrande: inicial?.fonteGrande ?? false,
    altoContraste: inicial?.altoContraste ?? false,
  });

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
