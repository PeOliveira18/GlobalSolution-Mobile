import type { SymbolViewProps } from 'expo-symbols';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/themes/theme';
import { useTema } from '@/contexts/TemaContext';

import { Icone } from '@/components/Icone';
import { Texto } from '@/components/Texto';

type GrupoProps = {
  titulo?: string;
  rodape?: string;
  children: ReactNode;
};

export function Grupo({ titulo, rodape, children }: GrupoProps) {
  const { cores } = useTema();
  const linhas = Children.toArray(children).filter(Boolean);

  return (
    <View style={styles.secao}>
      {titulo ? <TituloGrupo texto={titulo} /> : null}
      <View
        style={[
          styles.cartao,
          { borderColor: cores.bordaSuave, backgroundColor: cores.superficie, boxShadow: cores.sombra ?? undefined },
        ]}>
        <View style={styles.recorte}>
          {linhas.map((linha, i) => (
            <Fragment key={i}>
              {i > 0 ? <View style={[styles.divisor, { backgroundColor: cores.bordaSuave }]} /> : null}
              {linha}
            </Fragment>
          ))}
        </View>
      </View>
      {rodape ? (
        <Texto variante="legenda" tom="secundario" style={styles.rodape}>
          {rodape}
        </Texto>
      ) : null}
    </View>
  );
}

export function TituloGrupo({ texto }: { texto: string }) {
  const { cores } = useTema();
  return (
    <Texto variante="legenda" accessibilityRole="header" style={[styles.titulo, { color: cores.textoSecundario }]}>
      {texto}
    </Texto>
  );
}

type QuadradoIconeProps = {
  icone: SymbolViewProps['name'];
  cor?: string;
  fundo?: string;
};

export function QuadradoIcone({ icone, cor, fundo }: QuadradoIconeProps) {
  const { cores, tamanho, preferencias } = useTema();
  const corIcone = cor ?? cores.primaria;
  const fundoIcone = fundo ?? cores.primariaSuave;
  const lado = tamanho(22) + 14;

  return (
    <View
      style={[
        styles.quadrado,
        {
          width: lado,
          height: lado,
          backgroundColor: fundoIcone,
          borderColor: preferencias.altoContraste ? corIcone : fundoIcone,
        },
      ]}>
      <Icone nome={icone} cor={corIcone} tamanho={tamanho(20)} />
    </View>
  );
}

type LinhaInfoProps = {
  icone: SymbolViewProps['name'];
  corIcone?: string;
  fundoIcone?: string;
  rotulo: string;
  valor?: ReactNode;
  rotuloAcessivel?: string;
};

export function LinhaInfo({ icone, corIcone, fundoIcone, rotulo, valor, rotuloAcessivel }: LinhaInfoProps) {
  return (
    <View accessible accessibilityLabel={rotuloAcessivel ?? rotulo} style={styles.linha}>
      <QuadradoIcone icone={icone} cor={corIcone} fundo={fundoIcone} />
      <Texto style={{ flex: 1 }}>{rotulo}</Texto>
      {valor}
    </View>
  );
}

type LinhaAcaoProps = {
  icone: SymbolViewProps['name'];
  rotulo: string;
  dica: string;
  aoPressionar: () => void;
  perigo?: boolean;
};

export function LinhaAcao({ icone, rotulo, dica, aoPressionar, perigo }: LinhaAcaoProps) {
  const { cores } = useTema();
  const cor = perigo ? cores.perigo : cores.primaria;

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      style={({ pressed }) => [styles.linha, pressed && { backgroundColor: cores.primariaSuave }]}>
      <QuadradoIcone icone={icone} cor={cor} fundo={perigo ? cores.faixas.EMERGENCIA.fundo : undefined} />
      <Texto negrito style={{ flex: 1, color: cor }}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  secao: {
    gap: Espaco.sm,
  },
  titulo: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Espaco.md,
    marginTop: Espaco.xs,
  },
  cartao: {
    borderWidth: 1,
    borderRadius: Raio.lg,
  },
  recorte: {
    borderRadius: Raio.lg - 1,
    overflow: 'hidden',
  },
  divisor: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Espaco.md,
  },
  rodape: {
    paddingHorizontal: Espaco.md,
  },
  quadrado: {
    borderRadius: Raio.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linha: {
    minHeight: ALVO_TOQUE_MINIMO + Espaco.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 4,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm + 2,
  },
});
