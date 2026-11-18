import { router } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Cartao } from '@/components/cartao';
import { Carregando, ErroCarregar, EstadoVazio } from '@/components/estados';
import { Etiqueta, ICONE_ACESSIVEL, ICONE_ANIMAIS } from '@/components/etiqueta';
import { QuadradoIcone } from '@/components/grupo';
import { Icone } from '@/components/icone';
import { LinhaInterruptor } from '@/components/linha-interruptor';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco, Fonte, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import { useCarregar } from '@/hooks/use-carregar';
import { usePontoDePartida, type PontoDePartida } from '@/hooks/use-ponto-de-partida';
import { api } from '@/services/api';
import type { AbrigoProximo } from '@/types';
import { formatarDistancia } from '@/utils/formatar';

export default function AbrigosScreen() {
  const [soAcessiveis, setSoAcessiveis] = useState(false);
  const ponto = usePontoDePartida();

  return (
    <Tela aoAtualizar={ponto.recarregar} atualizando={ponto.atualizando}>
      <LinhaInterruptor
        rotulo="Só acessíveis"
        descricao="Mostra apenas abrigos preparados para cadeira de rodas."
        dica="Toque duas vezes para filtrar só os abrigos acessíveis"
        ligado={soAcessiveis}
        aoMudar={setSoAcessiveis}
      />

      {ponto.carregando ? (
        <Carregando texto="Buscando sua localização…" />
      ) : ponto.erro || !ponto.dados ? (
        <ErroCarregar mensagem={ponto.erro ?? 'Localização indisponível.'} aoTentarDeNovo={ponto.recarregar} />
      ) : (
        <ListaAbrigos ponto={ponto.dados} soAcessiveis={soAcessiveis} />
      )}
    </Tela>
  );
}

function ListaAbrigos({ ponto, soAcessiveis }: { ponto: PontoDePartida; soAcessiveis: boolean }) {
  const carregar = useCallback(
    () =>
      api.abrigosProximos({
        lat: ponto.latitude,
        lon: ponto.longitude,
        acessivel: soAcessiveis ? true : undefined,
        limite: 5,
      }),
    [ponto, soAcessiveis],
  );
  const { dados: abrigos, erro, carregando, recarregar } = useCarregar(carregar);

  return (
    <View style={{ gap: Espaco.sm }}>
      <Texto variante="legenda" tom="secundario">
        Distância a partir {ponto.origem === 'gps' ? 'da sua localização' : `do centro da área ${ponto.nomeArea}`}.
      </Texto>
      {carregando ? (
        <Carregando texto="Carregando os abrigos…" />
      ) : erro ? (
        <ErroCarregar mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : abrigos?.length ? (
        <View accessibilityLiveRegion="polite" style={{ gap: Espaco.sm }}>
          <Texto variante="subtitulo">{abrigos.length} abrigo(s) com vaga</Texto>
          {abrigos.map((abrigo, i) => (
            <ItemAbrigo key={abrigo.id} abrigo={abrigo} maisPerto={i === 0} />
          ))}
        </View>
      ) : (
        <EstadoVazio
          icone={{ ios: 'house.and.flag', android: 'night_shelter', web: 'night_shelter' }}
          texto={`Nenhum abrigo com vaga encontrado${soAcessiveis ? ' entre os acessíveis' : ''}.`}
        />
      )}
    </View>
  );
}

function ItemAbrigo({ abrigo, maisPerto }: { abrigo: AbrigoProximo; maisPerto: boolean }) {
  const { cores, tamanho, preferencias } = useTema();
  const { fontScale } = useWindowDimensions();
  const distancia = formatarDistancia(abrigo.distanciaMetros);
  const verde = cores.faixas.NORMAL;
  const empilhado = preferencias.fonteGrande || fontScale > 1.15;

  return (
    <Cartao
      style={[styles.cartao, maisPerto && { borderColor: cores.primaria, borderWidth: 2 }]}
      aoPressionar={() =>
        router.push({
          pathname: '/abrigo/[id]',
          params: { id: String(abrigo.id), distancia: String(abrigo.distanciaMetros) },
        })
      }
      rotulo={`${maisPerto ? 'Mais perto. ' : ''}${abrigo.nome}. ${abrigo.vagasLivres} vagas livres. A ${distancia}.${abrigo.acessivel ? ' Acessível.' : ''}${abrigo.aceitaAnimais ? ' Aceita animais.' : ''}`}
      dica="Abre o endereço e o botão Como chegar">
      {maisPerto ? (
        <View style={[styles.maisPerto, { backgroundColor: cores.primaria }]}>
          <Icone nome={{ ios: 'location.fill', android: 'near_me', web: 'near_me' }} cor={cores.sobrePrimaria} tamanho={tamanho(14)} />
          <Texto variante="legenda" negrito style={{ color: cores.sobrePrimaria }}>
            Mais perto
          </Texto>
        </View>
      ) : null}
      <View style={styles.linha}>
        <Texto negrito style={{ flex: 1 }}>
          {abrigo.nome}
        </Texto>
        <Icone nome={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} cor={cores.textoSecundario} tamanho={20} />
      </View>

      <View style={[styles.numeros, empilhado && { flexDirection: 'column', gap: Espaco.sm }]}>
        <Numero
          empilhado={empilhado}
          icone={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }}
          cor={verde.cor}
          fundo={verde.fundo}
          valor={String(abrigo.vagasLivres)}
          legenda="vagas livres"
        />
        <Numero
          empilhado={empilhado}
          icone={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
          cor={cores.primaria}
          fundo={cores.primariaSuave}
          valor={distancia}
          legenda="de distância"
        />
      </View>

      {abrigo.acessivel || abrigo.aceitaAnimais ? (
        <View style={styles.etiquetas}>
          {abrigo.acessivel ? <Etiqueta texto="Acessível" icone={ICONE_ACESSIVEL} /> : null}
          {abrigo.aceitaAnimais ? <Etiqueta texto="Aceita animais" icone={ICONE_ANIMAIS} /> : null}
        </View>
      ) : null}
    </Cartao>
  );
}

function Numero({
  icone,
  cor,
  fundo,
  valor,
  legenda,
  empilhado,
}: {
  icone: SymbolViewProps['name'];
  cor: string;
  fundo: string;
  valor: string;
  legenda: string;
  empilhado: boolean;
}) {
  const { tamanho } = useTema();
  const tamanhoValor = tamanho(Fonte.titulo);

  return (
    <View style={[styles.numero, empilhado && { flex: 0, minWidth: 0 }]}>
      <QuadradoIcone icone={icone} cor={cor} fundo={fundo} />
      <View style={[{ flexShrink: 1 }, empilhado && styles.emLinha]}>
        <Texto
          negrito
          style={{ color: cor, fontSize: tamanhoValor, lineHeight: Math.round(tamanhoValor * 1.2), fontVariant: ['tabular-nums'] }}>
          {valor}
        </Texto>
        <Texto variante="legenda" tom="secundario">
          {legenda}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    gap: Espaco.sm + 4,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  maisPerto: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Espaco.xs,
    paddingHorizontal: Espaco.sm + 2,
    paddingVertical: 2,
    borderRadius: Raio.pilula,
  },
  numeros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaco.md,
  },
  numero: {
    flex: 1,
    minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 2,
  },
  emLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: Espaco.sm,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaco.sm,
  },
});
