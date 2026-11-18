import type { SymbolViewProps } from 'expo-symbols';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Icone } from './icone';
import { Texto } from './texto';

type GrupoProps = {
  /** Título da seção, acima do cartão (lido como cabeçalho). */
  titulo?: string;
  /** Observação curta abaixo do cartão. */
  rodape?: string;
  children: ReactNode;
};

/**
 * Seção agrupada no estilo dos Ajustes do iPhone: título pequeno, um único cartão
 * com as linhas separadas por um fio fino e, se houver, uma observação embaixo.
 */
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
        {/* Recorta o fundo das linhas tocadas nos cantos arredondados (a sombra fica no cartão de fora). */}
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

/**
 * Título pequeno de uma seção agrupada. A caixa alta é só visual (textTransform):
 * o leitor de tela lê o texto normal, sem soletrar.
 */
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

/** Ícone num quadrado de cantos arredondados, como nos Ajustes do iPhone. */
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
          // No alto contraste o fundo some no preto: a borda colorida desenha o quadrado.
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
  /** Conteúdo à direita (ex.: "Sim"). */
  valor?: ReactNode;
  /** Como o leitor de tela lê a linha inteira. */
  rotuloAcessivel?: string;
};

/** Linha de informação dentro de um `Grupo`: ícone, texto e, opcionalmente, um valor à direita. */
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
  /** Ação que apaga dados: texto e ícone na cor de perigo. */
  perigo?: boolean;
};

/** Linha tocável dentro de um `Grupo` (ex.: "Limpar dados locais"). Alvo de toque ≥ 48. */
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
    // Recuado como no iOS: o fio começa depois do ícone.
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
