import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/cartao';
import { Carregando, ErroCarregar } from '@/components/estados';
import { Etiqueta, ICONE_ACESSIVEL, ICONE_ANIMAIS } from '@/components/etiqueta';
import { Icone } from '@/components/icone';
import { LinhaInterruptor } from '@/components/linha-interruptor';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import { useCarregar } from '@/hooks/use-carregar';
import { usePontoDePartida, type PontoDePartida } from '@/hooks/use-ponto-de-partida';
import { api } from '@/services/api';
import type { AbrigoProximo } from '@/types';
import { formatarDistancia } from '@/utils/formatar';

/** ABRIGOS (C3.3): "Para onde eu vou?" — abrigos com vaga, do mais perto ao mais longe. */
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
          {abrigos.map((abrigo) => (
            <ItemAbrigo key={abrigo.id} abrigo={abrigo} />
          ))}
        </View>
      ) : (
        <Cartao>
          <Texto>Nenhum abrigo com vaga encontrado{soAcessiveis ? ' entre os acessíveis' : ''}.</Texto>
        </Cartao>
      )}
    </View>
  );
}

function ItemAbrigo({ abrigo }: { abrigo: AbrigoProximo }) {
  const { cores, tamanho } = useTema();
  const distancia = formatarDistancia(abrigo.distanciaMetros);

  return (
    <Cartao
      aoPressionar={() =>
        router.push({
          pathname: '/abrigo/[id]',
          params: { id: String(abrigo.id), distancia: String(abrigo.distanciaMetros) },
        })
      }
      rotulo={`${abrigo.nome}. ${abrigo.vagasLivres} vagas livres. A ${distancia}.${abrigo.acessivel ? ' Acessível.' : ''}${abrigo.aceitaAnimais ? ' Aceita animais.' : ''}`}
      dica="Abre o endereço e o botão Como chegar">
      <Texto negrito>{abrigo.nome}</Texto>
      <View style={styles.linha}>
        <Icone nome={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }} cor={cores.texto} tamanho={tamanho(22)} />
        <Texto style={{ flex: 1 }}>
          <Texto negrito>{abrigo.vagasLivres}</Texto> vagas livres
        </Texto>
        <Icone nome={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }} cor={cores.texto} tamanho={tamanho(22)} />
        <Texto negrito>{distancia}</Texto>
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

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaco.sm,
  },
});
