import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { Cartao } from '@/components/cartao';
import { Carregando, ErroCarregar } from '@/components/estados';
import { ICONE_ACESSIVEL, ICONE_ANIMAIS } from '@/components/etiqueta';
import { Grupo, LinhaInfo } from '@/components/grupo';
import { Icone } from '@/components/icone';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco, Fonte, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import { useCarregar } from '@/hooks/use-carregar';
import { api } from '@/services/api';
import type { Abrigo } from '@/types';
import { formatarDistancia } from '@/utils/formatar';

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

  return <DetalheAbrigo abrigo={abrigo} distancia={distancia ? Number(distancia) : null} />;
}

function DetalheAbrigo({ abrigo, distancia }: { abrigo: Abrigo; distancia: number | null }) {
  const { cores, tamanho, preferencias } = useTema();
  const comVaga = abrigo.vagasLivres > 0;
  const verde = cores.faixas.NORMAL;
  const corVagas = comVaga ? verde.cor : cores.perigo;
  const tamanhoNumero = tamanho(Fonte.destaque);
  const fracao = abrigo.capacidade > 0 ? Math.min(1, Math.max(0, abrigo.ocupacao / abrigo.capacidade)) : 1;
  const sim = { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' } as const;
  const nao = { ios: 'xmark.circle', android: 'cancel', web: 'cancel' } as const;

  const valor = (ok: boolean) => (
    <View style={styles.valor}>
      <Icone nome={ok ? sim : nao} cor={ok ? verde.cor : cores.textoSecundario} tamanho={tamanho(20)} />
      <Texto negrito style={{ color: ok ? verde.cor : cores.textoSecundario }}>
        {ok ? 'Sim' : 'Não'}
      </Texto>
    </View>
  );

  return (
    <Tela>
      <View style={{ gap: Espaco.sm }}>
        <Texto variante="titulo">{abrigo.nome}</Texto>
        <View style={styles.linha}>
          <Icone nome={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} cor={cores.textoSecundario} tamanho={tamanho(20)} />
          <Texto tom="secundario" style={{ flex: 1 }}>
            {abrigo.endereco}
          </Texto>
        </View>
        {distancia != null ? (
          <View style={[styles.distancia, { backgroundColor: cores.primariaSuave, borderColor: preferencias.altoContraste ? cores.primaria : cores.primariaSuave }]}>
            <Icone nome={{ ios: 'location.fill', android: 'near_me', web: 'near_me' }} cor={cores.primaria} tamanho={tamanho(18)} />
            <Texto negrito style={{ color: cores.primaria }}>
              Distância: {formatarDistancia(distancia)}
            </Texto>
          </View>
        ) : null}
      </View>

      <Cartao style={styles.vagas}>
        <View
          accessible
          accessibilityLabel={`${comVaga ? `${abrigo.vagasLivres} vagas livres` : 'Sem vagas no momento'}. ${abrigo.ocupacao} de ${abrigo.capacidade} lugares ocupados.`}
          style={{ gap: Espaco.sm + 4 }}>
          {comVaga ? (
            <View style={styles.numeroVagas}>
              <Texto
                negrito
                style={{ color: corVagas, fontSize: tamanhoNumero, lineHeight: Math.round(tamanhoNumero * 1.15), fontVariant: ['tabular-nums'] }}>
                {abrigo.vagasLivres}
              </Texto>
              <Texto variante="subtitulo" accessibilityRole="none" style={{ color: corVagas }}>
                vagas livres
              </Texto>
            </View>
          ) : (
            <View style={styles.linha}>
              <Icone nome={{ ios: 'xmark.octagon.fill', android: 'block', web: 'block' }} cor={corVagas} tamanho={tamanho(28)} />
              <Texto variante="subtitulo" accessibilityRole="none" style={{ color: corVagas, flex: 1 }}>
                Sem vagas no momento
              </Texto>
            </View>
          )}
          <View
            style={[
              styles.trilho,
              {
                backgroundColor: preferencias.altoContraste ? cores.fundo : cores.bordaSuave,
                borderColor: preferencias.altoContraste ? cores.borda : cores.bordaSuave,
              },
            ]}>
            <View style={[styles.preenchido, { width: `${fracao * 100}%`, backgroundColor: cores.primaria }]} />
          </View>
          <View style={styles.linha}>
            <Icone nome={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }} cor={cores.textoSecundario} tamanho={tamanho(18)} />
            <Texto tom="secundario" style={{ flex: 1 }}>
              {abrigo.ocupacao} de {abrigo.capacidade} lugares ocupados
            </Texto>
          </View>
        </View>
      </Cartao>

      <Grupo>
        <LinhaInfo
          icone={ICONE_ACESSIVEL}
          rotulo="Acessível para cadeira de rodas"
          rotuloAcessivel={`Acessível para cadeira de rodas: ${abrigo.acessivel ? 'sim' : 'não'}`}
          valor={valor(abrigo.acessivel)}
        />
        <LinhaInfo
          icone={ICONE_ANIMAIS}
          rotulo="Aceita animais"
          rotuloAcessivel={`Aceita animais: ${abrigo.aceitaAnimais ? 'sim' : 'não'}`}
          valor={valor(abrigo.aceitaAnimais)}
        />
      </Grupo>

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

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  distancia: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Espaco.xs + 2,
    paddingHorizontal: Espaco.sm + 4,
    paddingVertical: Espaco.xs,
    borderRadius: Raio.pilula,
    borderWidth: 1.5,
  },
  vagas: {
    padding: Espaco.md + 4,
  },
  numeroVagas: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: Espaco.sm,
  },
  trilho: {
    height: 14,
    borderRadius: Raio.pilula,
    borderWidth: 1,
    overflow: 'hidden',
  },
  preenchido: {
    height: '100%',
    borderRadius: Raio.pilula,
  },
  valor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
  },
});
