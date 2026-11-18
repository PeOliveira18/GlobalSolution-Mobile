import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { CampoTexto } from '@/components/campo-texto';
import { Cartao } from '@/components/cartao';
import { CartaoRelato, type TomSituacao } from '@/components/cartao-relato';
import { Aviso, Carregando, ErroCarregar, EstadoVazio } from '@/components/estados';
import { QuadradoIcone } from '@/components/grupo';
import { OpcaoRadio } from '@/components/opcao-radio';
import { SeletorArea } from '@/components/seletor-area';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { STATUS_OCORRENCIA, TIPOS_OCORRENCIA } from '@/constants/rotulos';
import { Espaco } from '@/constants/theme';
import { useConexao } from '@/contexts/conexao';
import { useMorador, type RelatoLocal } from '@/contexts/morador';
import { useAreas } from '@/hooks/use-areas';
import { useCarregar } from '@/hooks/use-carregar';
import { api, mensagemParaMorador } from '@/services/api';
import { obterLocalizacao, type Coordenadas } from '@/services/localizacao';
import type { Area, Ocorrencia, TipoOcorrencia } from '@/types';
import { distanciaMetros } from '@/utils/geo';

const LIMITE_DESCRICAO = 280;
const TIPOS = Object.keys(TIPOS_OCORRENCIA) as TipoOcorrencia[];

type Retorno = { tipo: 'sucesso' | 'info' | 'erro'; texto: string };

/** REPORTAR (C3.3): "Como eu aviso os vizinhos?" */
export default function ReportarScreen() {
  const { online } = useConexao();
  const { areaId, relatos, registrarRelato, sincronizar, confirmados, marcarConfirmado } = useMorador();

  // ----- formulário -----
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null);
  const [descricao, setDescricao] = useState('');
  const [areaRelato, setAreaRelato] = useState<number>(areaId!);
  const [trocandoArea, setTrocandoArea] = useState(false);
  const [gps, setGps] = useState<Coordenadas | null | 'buscando'>('buscando');
  const [enviando, setEnviando] = useState(false);
  const [retorno, setRetorno] = useState<Retorno | null>(null);

  useEffect(() => {
    obterLocalizacao().then(setGps);
  }, []);

  // Vem do SQLite quando está sem internet (o relato offline precisa do centro da área).
  const { dados: areas } = useAreas();
  const area = areas?.find((a) => a.id === areaRelato);
  const local = escolherLocal(area, gps === 'buscando' ? null : gps);

  // ----- relatos da área (para "Meus relatos" e "Relatos dos vizinhos") -----
  const carregarVizinhos = useCallback(() => api.listarOcorrencias({ areaId: areaId! }), [areaId]);
  const vizinhos = useCarregar(carregarVizinhos);
  const meusIds = new Set(relatos.map((r) => r.idLocal));
  const doServidor = new Map((vizinhos.dados ?? []).map((o) => [o.idLocalApp, o]));
  const deOutros = (vizinhos.dados ?? []).filter((o) => !meusIds.has(o.idLocalApp) && o.status !== 'RESOLVIDA');

  // ----- envio -----
  const podeEnviar = tipo != null && descricao.length <= LIMITE_DESCRICAO && !!local;

  const enviar = async () => {
    if (!podeEnviar || !local) return;
    setEnviando(true);
    setRetorno(null);

    // Guarda no SQLite e tenta enviar; sem internet, fica na fila (PENDENTE).
    const resultado = await registrarRelato({
      areaRiscoId: areaRelato,
      tipo,
      descricao: descricao.trim() || null,
      latitude: local.latitude,
      longitude: local.longitude,
    });

    if (resultado.tipo === 'enviado') {
      setRetorno({ tipo: 'sucesso', texto: 'Relato enviado. Obrigado por avisar os vizinhos!' });
      vizinhos.recarregar();
    } else if (resultado.tipo === 'pendente') {
      setRetorno({
        tipo: 'info',
        texto: online
          ? 'O servidor não respondeu agora. Seu relato ficou guardado e será enviado automaticamente.'
          : 'Sem internet. Será enviado quando a internet voltar.',
      });
    } else {
      setRetorno({ tipo: 'erro', texto: resultado.mensagem });
    }
    setTipo(null);
    setDescricao('');
    setEnviando(false);
  };

  const confirmar = async (ocorrencia: Ocorrencia) => {
    try {
      await api.confirmarOcorrencia(ocorrencia.id);
      marcarConfirmado(ocorrencia.id);
      AccessibilityInfo.announceForAccessibility('Obrigado! Você confirmou o relato.');
      vizinhos.recarregar();
    } catch (erro) {
      setRetorno({ tipo: 'erro', texto: mensagemParaMorador(erro) });
    }
  };

  // Puxar para atualizar: envia os pendentes e depois recarrega os relatos da área.
  const atualizar = async () => {
    await sincronizar();
    vizinhos.recarregar();
  };

  return (
    <Tela aoAtualizar={atualizar} atualizando={vizinhos.atualizando}>
      <Texto variante="subtitulo">O que está acontecendo?</Texto>
      <View role="radiogroup" aria-label="Tipo de alagamento" style={{ gap: Espaco.sm }}>
        {TIPOS.map((t) => (
          <OpcaoRadio
            key={t}
            rotulo={TIPOS_OCORRENCIA[t].rotulo}
            descricao={TIPOS_OCORRENCIA[t].dica}
            dica="Toque duas vezes para escolher este tipo"
            icone={TIPOS_OCORRENCIA[t].icone}
            selecionada={tipo === t}
            aoSelecionar={() => setTipo(t)}
          />
        ))}
      </View>

      <CampoTexto
        rotulo="Conte o que está vendo (opcional)"
        dica="Não escreva nome, telefone ou documentos"
        placeholder="Ex.: a água chegou no joelho na rua da escola"
        valor={descricao}
        aoMudar={setDescricao}
        limite={LIMITE_DESCRICAO}
      />

      <Cartao>
        <View style={styles.onde}>
          <QuadradoIcone icone={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} />
          <Texto negrito style={{ flex: 1 }}>
            Onde?
          </Texto>
        </View>
        <Texto accessibilityLiveRegion="polite">{descreverLocal(area, gps)}</Texto>
        <Botao
          rotulo={trocandoArea ? 'Fechar a lista de áreas' : 'Relatar em outra área'}
          dica="Mostra as áreas para escolher onde está o alagamento"
          variante="secundario"
          aoPressionar={() => setTrocandoArea((v) => !v)}
        />
        {trocandoArea ? (
          <SeletorArea
            selecionada={areaRelato}
            aoSelecionar={(id) => {
              setAreaRelato(id);
              setTrocandoArea(false);
            }}
            rotuloGrupo="Área do alagamento"
          />
        ) : null}
      </Cartao>

      {/* O aviso "será enviado quando a internet voltar" some quando ela volta. */}
      {retorno && !(retorno.tipo === 'info' && online && retorno.texto.startsWith('Sem internet')) ? (
        <Aviso tipo={retorno.tipo} texto={retorno.texto} />
      ) : null}

      <Botao
        grande
        rotulo="Enviar"
        dica={
          tipo == null
            ? 'Escolha primeiro o que está acontecendo'
            : descricao.length > LIMITE_DESCRICAO
              ? `Diminua a descrição para até ${LIMITE_DESCRICAO} caracteres`
              : 'Envia o relato para os vizinhos'
        }
        icone={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
        desabilitado={!podeEnviar}
        carregando={enviando}
        aoPressionar={enviar}
      />

      <Texto variante="subtitulo">Meus relatos</Texto>
      {relatos.length === 0 ? (
        <EstadoVazio
          icone={{ ios: 'text.bubble', android: 'chat_bubble', web: 'chat_bubble' }}
          texto="Você ainda não fez nenhum relato."
        />
      ) : (
        relatos.map((r) => {
          const situacao = situacaoDoMeuRelato(r, doServidor.get(r.idLocal));
          return (
            <CartaoRelato
              key={r.idLocal}
              tipo={r.tipo}
              descricao={r.descricao}
              criadoEm={r.criadoEm}
              situacao={situacao.texto}
              tom={situacao.tom}
            />
          );
        })
      )}

      <Texto variante="subtitulo">Relatos dos vizinhos</Texto>
      {vizinhos.carregando ? (
        <Carregando texto="Carregando os relatos da sua área…" />
      ) : vizinhos.erro ? (
        <ErroCarregar mensagem={vizinhos.erro} aoTentarDeNovo={vizinhos.recarregar} />
      ) : deOutros.length === 0 ? (
        <EstadoVazio
          icone={{ ios: 'person.2', android: 'group', web: 'group' }}
          texto="Nenhum relato de vizinhos na sua área agora."
        />
      ) : (
        deOutros.map((o) => {
          const jaConfirmei = confirmados.includes(o.id);
          return (
            <CartaoRelato
              key={o.id}
              tipo={o.tipo}
              descricao={o.descricao}
              criadoEm={o.criadaEm}
              situacao={`${STATUS_OCORRENCIA[o.status]} · ${o.confirmacoes} confirmação(ões)`}
              tom={o.status === 'CONFIRMADA' ? 'sucesso' : 'neutro'}>
              <Botao
                rotulo={jaConfirmei ? 'Você já confirmou' : 'Confirmar'}
                dica="Confirma que você também está vendo este alagamento"
                variante="secundario"
                icone={{ ios: 'hand.thumbsup.fill', android: 'check', web: 'check' }}
                desabilitado={jaConfirmei}
                aoPressionar={() => confirmar(o)}
              />
            </CartaoRelato>
          );
        })
      )}
    </Tela>
  );
}

/**
 * Usa o GPS quando ele está dentro da área escolhida;
 * senão (sem permissão, sem sinal ou longe dali), usa o centro da área (fallback da C3.3).
 */
function escolherLocal(area: Area | undefined, gps: Coordenadas | null): Coordenadas | null {
  if (!area) return null;
  if (gps && distanciaMetros(gps.latitude, gps.longitude, area.latitude, area.longitude) <= area.raioMetros) {
    return gps;
  }
  return { latitude: area.latitude, longitude: area.longitude };
}

function descreverLocal(area: Area | undefined, gps: Coordenadas | null | 'buscando'): string {
  if (!area) return 'Carregando a área…';
  if (gps === 'buscando') return `Buscando sua localização… (área: ${area.nome})`;
  if (gps && escolherLocal(area, gps) === gps) return `Sua localização atual, em ${area.nome}.`;
  return `Centro da área ${area.nome} (sua localização não está disponível ou fica fora desta área).`;
}

function situacaoDoMeuRelato(relato: RelatoLocal, noServidor?: Ocorrencia): { texto: string; tom: TomSituacao } {
  if (relato.statusSync === 'PENDENTE') return { texto: 'Pendente: será enviado quando a internet voltar', tom: 'pendente' };
  if (relato.statusSync === 'ERRO') return { texto: 'Não foi enviado', tom: 'erro' };
  if (noServidor?.status === 'CONFIRMADA') return { texto: 'Enviado · Confirmado pelos vizinhos', tom: 'sucesso' };
  if (noServidor?.status === 'RESOLVIDA') return { texto: 'Enviado · Resolvido', tom: 'sucesso' };
  return { texto: 'Enviado', tom: 'sucesso' };
}

const styles = StyleSheet.create({
  onde: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 2,
  },
});
