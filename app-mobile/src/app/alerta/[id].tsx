import { router, useLocalSearchParams } from 'expo-router';
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
import { Espaco, FAIXAS } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import { useCarregar } from '@/hooks/use-carregar';
import { api } from '@/services/api';
import { formatarDataHora } from '@/utils/formatar';

/** DETALHE DO ALERTA (C3.3): "O que eu faço?" — mensagem + passo a passo numerado. */
export default function AlertaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cores, tamanho } = useTema();
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
  const cor = cores.faixas[severidade.faixaVisual].cor;
  const passos = passosDoAlerta(alerta);

  return (
    <Tela>
      <Cartao style={{ borderWidth: 2, borderColor: cor }}>
        <View style={styles.linha} accessible accessibilityLabel={`Gravidade: ${severidade.rotulo}`}>
          <Icone nome={FAIXAS[severidade.faixaVisual].icone} cor={cor} tamanho={tamanho(32)} />
          <Texto variante="subtitulo" style={{ color: cor }}>
            {severidade.rotulo.toUpperCase()}
          </Texto>
        </View>
        <Texto>{alerta.mensagem}</Texto>
        <Texto variante="legenda" tom="secundario">
          {TIPOS_ALERTA[alerta.tipo]} · {alerta.areaNome} · {formatarDataHora(alerta.criadoEm)}
          {alerta.ativo ? '' : ' · encerrado'}
        </Texto>
      </Cartao>

      <Texto variante="subtitulo">O que fazer agora</Texto>
      <View role="list" style={{ gap: Espaco.sm }}>
        {passos.map((passo, i) => (
          <View
            key={passo}
            role="listitem"
            accessible
            accessibilityLabel={`Passo ${i + 1} de ${passos.length}: ${passo}`}
            style={styles.passo}>
            <View style={[styles.numero, { backgroundColor: cores.primaria }]}>
              <Texto negrito style={{ color: cores.sobrePrimaria }}>
                {i + 1}
              </Texto>
            </View>
            <Texto style={{ flex: 1 }}>{passo}</Texto>
          </View>
        ))}
      </View>

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

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  passo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Espaco.md,
  },
  numero: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
