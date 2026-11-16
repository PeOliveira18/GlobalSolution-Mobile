import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Platform, View } from 'react-native';

import { Botao } from '@/components/botao';
import { Cartao } from '@/components/cartao';
import { Carregando, ErroCarregar } from '@/components/estados';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco } from '@/constants/theme';
import { useCarregar } from '@/hooks/use-carregar';
import { api } from '@/services/api';
import type { Abrigo } from '@/types';
import { formatarDistancia } from '@/utils/formatar';

/** DETALHE DO ABRIGO (C3.3): endereço, vagas e o botão "Como chegar". */
export default function AbrigoScreen() {
  const { id, distancia } = useLocalSearchParams<{ id: string; distancia?: string }>();
  const carregar = useCallback(() => api.obterAbrigo(Number(id)), [id]);
  const { dados: abrigo, erro, carregando, recarregar } = useCarregar(carregar);

  if (carregando) {
    return (
      <Tela>
        <Carregando texto="Carregando o abrigo…" />
      </Tela>
    );
  }
  if (erro || !abrigo) {
    return (
      <Tela>
        <ErroCarregar mensagem={erro ?? 'Abrigo não encontrado.'} aoTentarDeNovo={recarregar} />
      </Tela>
    );
  }

  return (
    <Tela>
      <View style={{ gap: Espaco.xs }}>
        <Texto variante="titulo">{abrigo.nome}</Texto>
        <Texto tom="secundario">{abrigo.endereco}</Texto>
        {distancia ? <Texto>Distância: {formatarDistancia(Number(distancia))}</Texto> : null}
      </View>

      <Cartao>
        <Texto variante="subtitulo">
          {abrigo.vagasLivres > 0 ? `${abrigo.vagasLivres} vagas livres` : 'Sem vagas no momento'}
        </Texto>
        <Texto tom="secundario">
          {abrigo.ocupacao} de {abrigo.capacidade} lugares ocupados
        </Texto>
      </Cartao>

      <Cartao>
        <Texto>
          <Texto negrito>Acessível para cadeira de rodas: </Texto>
          {abrigo.acessivel ? 'sim' : 'não'}
        </Texto>
        <Texto>
          <Texto negrito>Aceita animais: </Texto>
          {abrigo.aceitaAnimais ? 'sim' : 'não'}
        </Texto>
      </Cartao>

      <Botao
        grande
        rotulo="Como chegar"
        dica="Abre o aplicativo de mapas com o caminho até o abrigo"
        icone={{ ios: 'map.fill', android: 'directions', web: 'directions' }}
        aoPressionar={() => abrirMapa(abrigo)}
      />
      <Texto variante="legenda" tom="secundario">
        Abrigo e endereço simulados, para demonstração.
      </Texto>
    </Tela>
  );
}

/** Abre o app de mapas do celular (Apple Mapas, Google Maps) ou o Google Maps no navegador. */
async function abrirMapa(abrigo: Abrigo) {
  const destino = `${abrigo.latitude},${abrigo.longitude}`;
  const web = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
  const nativo = Platform.select({
    ios: `http://maps.apple.com/?daddr=${destino}`,
    android: `geo:${destino}?q=${destino}(${encodeURIComponent(abrigo.nome)})`,
    default: web,
  });
  try {
    await Linking.openURL(nativo);
  } catch {
    await Linking.openURL(web);
  }
}
