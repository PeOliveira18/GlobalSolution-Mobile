import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { Botao } from '@/components/botao';
import { CartaoAlerta } from '@/components/cartao-alerta';
import { CartaoNivel } from '@/components/cartao-nivel';
import { Carregando, ErroCarregar, EstadoVazio } from '@/components/estados';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco } from '@/constants/theme';
import { useConexao } from '@/contexts/conexao';
import { useMorador } from '@/contexts/morador';
import { lerCache, salvarCache } from '@/db/repositorio';
import { useCarregar } from '@/hooks/use-carregar';
import { api, ErroApi, mensagemParaMorador } from '@/services/api';
import type { Alerta, AreaDetalhe, StatusAtualSensor } from '@/types';
import { paraIsoSaoPaulo } from '@/utils/datas';

type Nivel = { area: AreaDetalhe; status: StatusAtualSensor | null };

/** O que fica guardado na tabela `cache_status` para mostrar sem internet. */
type CacheInicio = { nivel?: Nivel; alertas?: Alerta[] };

/** Cada parte da tela: os dados ou a mensagem de erro. */
type Parte<T> = { dados?: T; erro?: string };

type DadosInicio = { nivel: Parte<Nivel>; alertas: Parte<Alerta[]>; dadosDe: string | null };

/**
 * INÍCIO (C3.3): "Vai alagar na minha rua?"
 * Nível do córrego da área (Telemetria), alertas ativos (Cidadão) e o atalho para reportar.
 * Sem internet, mostra o que foi guardado no SQLite na última vez que deu certo.
 */
export default function InicioScreen() {
  const db = useSQLiteContext();
  const { areaId, sincronizar } = useMorador();
  const { online } = useConexao();

  // `online` está nas dependências: quando a internet cai ou volta, a tela busca de novo.
  const carregar = useCallback(async (): Promise<DadosInicio> => {
    // Nível e alertas vêm de serviços diferentes: se um cair, o outro continua aparecendo.
    const [nivel, alertas] = await Promise.allSettled([
      buscarNivel(areaId!),
      api.listarAlertas({ areaId: areaId!, ativos: true }),
    ]);

    if (nivel.status === 'fulfilled' && alertas.status === 'fulfilled') {
      const agora = paraIsoSaoPaulo(new Date());
      await salvarCache<CacheInicio>(db, areaId!, { nivel: nivel.value, alertas: alertas.value }, agora);
      return { nivel: { dados: nivel.value }, alertas: { dados: alertas.value }, dadosDe: null };
    }

    // Alguma parte falhou por falta de conexão ou erro do servidor: completa com o que está guardado no celular.
    const falhaPassageira = [nivel, alertas].some(
      (r) => r.status === 'rejected' && r.reason instanceof ErroApi && r.reason.temporario,
    );
    const cache = falhaPassageira ? await lerCache<CacheInicio>(db, areaId!) : null;

    const parte = <T,>(r: PromiseSettledResult<T>, guardado?: T): Parte<T> =>
      r.status === 'fulfilled'
        ? { dados: r.value }
        : guardado
          ? { dados: guardado }
          : { erro: mensagemParaMorador(r.reason) };

    return {
      nivel: parte(nivel, cache?.dados.nivel),
      alertas: parte(alertas, cache?.dados.alertas),
      dadosDe: cache?.atualizadoEm ?? null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, areaId, online]);

  const tela = useCarregar(carregar);
  const nivel = tela.dados?.nivel;
  const alertas = tela.dados?.alertas;

  useAnunciarAlertasNovos(alertas?.dados);

  // Puxar para atualizar: envia relatos pendentes e busca tudo de novo.
  const atualizar = () => {
    sincronizar();
    tela.recarregar();
  };

  // Ao voltar para esta aba (ex.: depois de reportar), busca os dados de novo.
  const primeiraVez = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (primeiraVez.current) {
        primeiraVez.current = false;
        return;
      }
      tela.recarregar();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <Tela aoAtualizar={atualizar} atualizando={tela.atualizando} dadosDe={tela.dados?.dadosDe}>
      {tela.carregando ? (
        <Carregando texto="Carregando o nível do córrego…" />
      ) : tela.erro || !nivel ? (
        <ErroCarregar mensagem={tela.erro ?? 'Não foi possível carregar.'} aoTentarDeNovo={tela.recarregar} />
      ) : nivel.erro || !nivel.dados ? (
        <ErroCarregar mensagem={nivel.erro ?? 'Nível indisponível.'} aoTentarDeNovo={tela.recarregar} />
      ) : nivel.dados.status ? (
        <CartaoNivel nomeArea={nivel.dados.area.nome} status={nivel.dados.status} />
      ) : (
        <EstadoVazio
          icone={{ ios: 'antenna.radiowaves.left.and.right.slash', android: 'sensors_off', web: 'sensors_off' }}
          texto={`A área ${nivel.dados.area.nome} ainda não tem sensor de nível.`}
        />
      )}

      <Botao
        grande
        rotulo="Reportar alagamento"
        dica="Abre a tela para avisar os vizinhos sobre um alagamento"
        icone={{ ios: 'exclamationmark.bubble.fill', android: 'campaign', web: 'campaign' }}
        aoPressionar={() => router.navigate('/reportar')}
      />

      <View style={{ gap: Espaco.sm }}>
        <Texto variante="subtitulo">
          Alertas ativos{alertas?.dados ? ` (${alertas.dados.length})` : ''}
        </Texto>
        {tela.carregando ? (
          <Carregando texto="Carregando os alertas…" />
        ) : alertas?.erro ? (
          <ErroCarregar mensagem={alertas.erro} aoTentarDeNovo={tela.recarregar} />
        ) : alertas?.dados?.length ? (
          alertas.dados.map((alerta) => <CartaoAlerta key={alerta.id} alerta={alerta} />)
        ) : (
          <EstadoVazio
            positivo
            icone={{ ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' }}
            texto="Nenhum alerta na sua área agora."
          />
        )}
      </View>
    </Tela>
  );
}

/** Área + status do sensor de nível dela (contrato ④ da Telemetria). */
async function buscarNivel(areaId: number): Promise<Nivel> {
  const [area, sensores] = await Promise.all([api.obterArea(areaId), api.listarSensores(areaId)]);
  const sensorNivel = sensores.find((s) => s.tipo === 'NIVEL');
  const status = sensorNivel ? await api.statusSensor(sensorNivel.codigo) : null;
  return { area, status };
}

/**
 * C3.5: quando chega um alerta novo (ao atualizar), o leitor de tela fala a mensagem,
 * mesmo que o morador não esteja olhando para a lista.
 */
function useAnunciarAlertasNovos(alertas: { id: number; mensagem: string }[] | undefined) {
  const conhecidos = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (!alertas) return;
    if (conhecidos.current) {
      const novos = alertas.filter((a) => !conhecidos.current!.has(a.id));
      for (const alerta of novos) AccessibilityInfo.announceForAccessibility(`Novo alerta: ${alerta.mensagem}`);
    }
    conhecidos.current = new Set(alertas.map((a) => a.id));
  }, [alertas]);
}
