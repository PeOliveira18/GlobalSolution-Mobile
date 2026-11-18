import { router, useLocalSearchParams } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { useCallback } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { Cartao } from '@/components/cartao';
import { Carregando, ErroCarregar } from '@/components/estados';
import { Icone } from '@/components/icone';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { passosDoAlerta, TELEFONE_DEFESA_CIVIL } from '@/constants/orientacoes';
import { SEVERIDADES, TIPOS_ALERTA } from '@/constants/rotulos';
import { Espaco, FAIXAS, Fonte, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import { useCarregar } from '@/hooks/use-carregar';
import { api } from '@/services/api';
import type { TipoAlerta } from '@/types';
import { formatarDataHora } from '@/utils/formatar';

/** DETALHE DO ALERTA (C3.3): "O que eu faço?" — mensagem + passo a passo numerado, em linha do tempo. */
export default function AlertaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cores, tamanho, preferencias } = useTema();
  const carregar = useCallback(() => api.obterAlerta(Number(id)), [id]);
  const { dados: alerta, erro, carregando, recarregar } = useCarregar(carregar);

  if (carregando) {
    return (
      <Tela>
        <Carregando texto="Carregando o alerta…" />
      </Tela>
    );
  }
  if (erro || !alerta) {
    return (
      <Tela>
        <ErroCarregar mensagem={erro ?? 'Alerta não encontrado.'} aoTentarDeNovo={recarregar} />
      </Tela>
    );
  }

  const severidade = SEVERIDADES[alerta.severidade];
  const { cor, fundo } = cores.faixas[severidade.faixaVisual];
  const passos = passosDoAlerta(alerta);
  const ladoIcone = tamanho(30) + 22;
  const corMeta = cores.textoSecundario;

  return (
    <Tela>
      {/* Mesmo visual do cartão de nível do Início: fundo e borda da faixa, ícone num círculo. */}
      <Cartao style={[styles.destaque, { backgroundColor: fundo, borderColor: cor }]}>
        <View style={styles.linha} accessible accessibilityLabel={`Gravidade: ${severidade.rotulo}`}>
          <View style={[styles.circulo, { width: ladoIcone, height: ladoIcone, backgroundColor: cor }]}>
            <Icone nome={FAIXAS[severidade.faixaVisual].icone} cor={fundo} tamanho={tamanho(28)} />
          </View>
          <Texto variante="subtitulo" style={{ color: cor, letterSpacing: 0.4, flex: 1 }}>
            {severidade.rotulo.toUpperCase()}
          </Texto>
        </View>
        <Texto>{alerta.mensagem}</Texto>
        <View style={[styles.meta, { borderTopColor: cor }]}>
          <LinhaMeta icone={ICONES_TIPO[alerta.tipo]} cor={corMeta} texto={TIPOS_ALERTA[alerta.tipo]} />
          <LinhaMeta icone={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} cor={corMeta} texto={alerta.areaNome} />
          <LinhaMeta
            icone={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
            cor={corMeta}
            texto={`${formatarDataHora(alerta.criadoEm)}${alerta.ativo ? '' : ' · encerrado'}`}
          />
        </View>
      </Cartao>

      <Texto variante="subtitulo">O que fazer agora</Texto>
      {/* Linha do tempo: os números ligados por um traço mostram a ordem dos passos. */}
      <Cartao style={{ gap: 0 }}>
        <View role="list">
          {passos.map((passo, i) => {
            const ultimo = i === passos.length - 1;
            return (
              <View
                key={passo}
                role="listitem"
                accessible
                accessibilityLabel={`Passo ${i + 1} de ${passos.length}: ${passo}`}
                style={styles.passo}>
                <View style={styles.trilho}>
                  <View
                    style={[
                      styles.numero,
                      { minWidth: ladoNumero(tamanho), minHeight: ladoNumero(tamanho), backgroundColor: cores.primaria },
                    ]}>
                    <Texto negrito style={{ color: cores.sobrePrimaria }}>
                      {i + 1}
                    </Texto>
                  </View>
                  {ultimo ? null : (
                    <View
                      style={[
                        styles.traco,
                        // Traço decorativo: azul translúcido na paleta padrão, amarelo cheio no alto contraste.
                        { backgroundColor: cores.primaria, opacity: preferencias.altoContraste ? 1 : 0.28 },
                      ]}
                    />
                  )}
                </View>
                <Texto style={[styles.textoPasso, { paddingBottom: ultimo ? 0 : Espaco.md + 6 }]}>{passo}</Texto>
              </View>
            );
          })}
        </View>
      </Cartao>

      <Botao
        grande
        rotulo="Ver abrigos com vaga"
        dica="Abre a lista dos abrigos mais próximos"
        icone={{ ios: 'house.and.flag.fill', android: 'night_shelter', web: 'night_shelter' }}
        aoPressionar={() => router.navigate('/abrigos')}
      />
      <Botao
        rotulo={`Ligar para a Defesa Civil (${TELEFONE_DEFESA_CIVIL})`}
        dica="Abre o telefone para ligar para a Defesa Civil"
        variante="secundario"
        icone={{ ios: 'phone.fill', android: 'call', web: 'call' }}
        aoPressionar={() => Linking.openURL(`tel:${TELEFONE_DEFESA_CIVIL}`)}
      />
    </Tela>
  );
}

/** Ícone de cada origem do alerta. */
const ICONES_TIPO: Record<TipoAlerta, SymbolViewProps['name']> = {
  SENSOR: { ios: 'antenna.radiowaves.left.and.right', android: 'sensors', web: 'sensors' },
  COMUNITARIO: { ios: 'person.2.fill', android: 'groups', web: 'groups' },
  PREVISAO: { ios: 'cloud.rain.fill', android: 'rainy', web: 'rainy' },
};

/** Lado do círculo do número: acompanha a letra grande. */
const ladoNumero = (tamanho: (base: number) => number) => tamanho(Fonte.corpo) + 14;

function LinhaMeta({ icone, cor, texto }: { icone: SymbolViewProps['name']; cor: string; texto: string }) {
  const { tamanho } = useTema();
  return (
    <View style={styles.linhaMeta}>
      <Icone nome={icone} cor={cor} tamanho={tamanho(18)} />
      <Texto variante="legenda" tom="secundario" style={{ flex: 1 }}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  destaque: {
    borderWidth: 2,
    padding: Espaco.md + 4,
    gap: Espaco.md,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 4,
  },
  circulo: {
    borderRadius: Raio.pilula,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    gap: Espaco.xs + 2,
    paddingTop: Espaco.sm + 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  linhaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  passo: {
    flexDirection: 'row',
    gap: Espaco.md,
  },
  trilho: {
    alignItems: 'center',
  },
  numero: {
    borderRadius: Raio.pilula,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  traco: {
    flex: 1,
    width: 3,
    minHeight: 12,
    borderRadius: 2,
    marginVertical: Espaco.xs,
  },
  textoPasso: {
    flex: 1,
    paddingTop: 4,
  },
});
