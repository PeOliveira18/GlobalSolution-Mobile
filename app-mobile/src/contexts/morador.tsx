import { randomUUID } from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo } from 'react-native';

import {
  apagarPreferencia,
  apagarTudo,
  atualizarStatusRelato,
  inserirRelato,
  listarPendentes,
  listarRelatos,
  salvarPreferencia,
  type RelatoLocal,
} from '@/db/repositorio';
import { api } from '@/services/api';
import { estaConectado } from '@/services/conexao';
import { enviarRelato, type ResultadoEnvio } from '@/services/relatos';
import type { TipoOcorrencia } from '@/types';
import { paraIsoSaoPaulo } from '@/utils/datas';

import { useConexao } from './conexao';
import { useTema, type PreferenciasVisuais } from './tema';

export type { RelatoLocal, StatusSync } from '@/db/repositorio';

/** O que o morador preenche na tela Reportar. */
export type NovoRelato = {
  areaRiscoId: number;
  tipo: TipoOcorrencia;
  descricao: string | null;
  latitude: number;
  longitude: number;
};

/** Dados lidos do SQLite ao abrir o app. */
export type DadosIniciaisMorador = {
  areaId: number | null;
  dispositivoId: string;
  relatos: RelatoLocal[];
  confirmados: number[];
  inscricaoPendente: boolean;
};

type ValorMorador = {
  /** Área de risco escolhida no onboarding; `null` antes da primeira abertura. */
  areaId: number | null;
  /** GUID anônimo do celular (sem nome, telefone ou CPF). */
  dispositivoId: string;
  /** Escolhe a área e inscreve o celular nela. Devolve `false` se o servidor não respondeu. */
  inscrever: (areaId: number, preferencias?: PreferenciasVisuais) => Promise<boolean>;
  relatos: RelatoLocal[];
  /** Guarda o relato no celular e tenta enviar. Sem internet, ele fica na fila (PENDENTE). */
  registrarRelato: (novo: NovoRelato) => Promise<ResultadoEnvio>;
  /** Envia os relatos pendentes. Devolve quantos foram enviados. */
  sincronizar: () => Promise<number>;
  /** Relatos de outros moradores que este celular já confirmou (para não confirmar duas vezes). */
  confirmados: number[];
  marcarConfirmado: (idServidor: number) => void;
  limparDados: () => Promise<void>;
};

const ContextoMorador = createContext<ValorMorador | null>(null);

/**
 * Dados do morador neste celular, guardados no SQLite (C3.4):
 * área e identificador na tabela `preferencias`, relatos na tabela `relatos`.
 *
 * Sincronização: os relatos PENDENTE são enviados ao abrir o app, quando a internet
 * volta (netinfo) e quando o morador puxa a tela para atualizar.
 */
export function ProvedorMorador({ children, inicial }: { children: ReactNode; inicial: DadosIniciaisMorador }) {
  const db = useSQLiteContext();
  const { online } = useConexao();
  const { preferencias: preferenciasAtuais, definirAltoContraste, definirFonteGrande } = useTema();

  const [areaId, setAreaId] = useState(inicial.areaId);
  const [dispositivoId, setDispositivoId] = useState(inicial.dispositivoId);
  const [relatos, setRelatos] = useState(inicial.relatos);
  const [confirmados, setConfirmados] = useState(inicial.confirmados);
  const inscricaoPendente = useRef(inicial.inscricaoPendente);
  const sincronizando = useRef(false);

  const recarregarRelatos = useCallback(async () => setRelatos(await listarRelatos(db)), [db]);

  const inscrever = useCallback(
    async (novaArea: number, preferencias: PreferenciasVisuais = preferenciasAtuais) => {
      setAreaId(novaArea);
      await salvarPreferencia(db, 'area_id', String(novaArea));
      try {
        await api.salvarInscricao({
          dispositivoId,
          areaRiscoId: novaArea,
          prefereFonteGrande: preferencias.fonteGrande,
          prefereAltoContraste: preferencias.altoContraste,
        });
        inscricaoPendente.current = false;
        await apagarPreferencia(db, 'inscricao_pendente');
        return true;
      } catch {
        // Fica marcada para refazer na próxima sincronização.
        inscricaoPendente.current = true;
        await salvarPreferencia(db, 'inscricao_pendente', '1');
        return false;
      }
    },
    [db, dispositivoId, preferenciasAtuais],
  );

  const registrarRelato = useCallback(
    async (novo: NovoRelato): Promise<ResultadoEnvio> => {
      const relato: RelatoLocal = {
        ...novo,
        idLocal: randomUUID(),
        criadoEm: paraIsoSaoPaulo(new Date()),
        statusSync: 'PENDENTE',
        idServidor: null,
      };
      // 1º guarda no celular (não se perde nem se o app fechar); 2º tenta enviar.
      await inserirRelato(db, relato);
      await recarregarRelatos();

      const resultado = await enviarRelato(relato);
      if (resultado.tipo === 'enviado') {
        await atualizarStatusRelato(db, relato.idLocal, 'ENVIADO', resultado.idServidor);
      } else if (resultado.tipo === 'erro') {
        await atualizarStatusRelato(db, relato.idLocal, 'ERRO');
      }
      await recarregarRelatos();
      return resultado;
    },
    [db, recarregarRelatos],
  );

  const sincronizar = useCallback(async () => {
    if (sincronizando.current || !estaConectado()) return 0;
    sincronizando.current = true;
    let enviados = 0;
    try {
      for (const relato of await listarPendentes(db)) {
        const resultado = await enviarRelato(relato);
        if (resultado.tipo === 'pendente') break; // a internet caiu de novo: tenta depois
        if (resultado.tipo === 'enviado') {
          await atualizarStatusRelato(db, relato.idLocal, 'ENVIADO', resultado.idServidor);
          enviados++;
        } else {
          await atualizarStatusRelato(db, relato.idLocal, 'ERRO');
        }
      }
      if (inscricaoPendente.current && areaId != null) await inscrever(areaId);
      await recarregarRelatos();
      if (enviados > 0) {
        AccessibilityInfo.announceForAccessibility(
          enviados === 1 ? '1 relato pendente foi enviado.' : `${enviados} relatos pendentes foram enviados.`,
        );
      }
      return enviados;
    } finally {
      sincronizando.current = false;
    }
  }, [db, areaId, inscrever, recarregarRelatos]);

  // Ao abrir o app e sempre que a internet voltar.
  useEffect(() => {
    if (online) sincronizar();
  }, [online, sincronizar]);

  const valor = useMemo<ValorMorador>(
    () => ({
      areaId,
      dispositivoId,
      inscrever,
      relatos,
      registrarRelato,
      sincronizar,
      confirmados,
      marcarConfirmado: (id) => {
        const lista = confirmados.includes(id) ? confirmados : [...confirmados, id];
        setConfirmados(lista);
        salvarPreferencia(db, 'confirmados', JSON.stringify(lista));
      },
      limparDados: async () => {
        await apagarTudo(db);
        const novoDispositivo = randomUUID();
        await salvarPreferencia(db, 'dispositivo_id', novoDispositivo);
        setDispositivoId(novoDispositivo);
        setAreaId(null);
        setRelatos([]);
        setConfirmados([]);
        inscricaoPendente.current = false;
        definirFonteGrande(false);
        definirAltoContraste(false);
      },
    }),
    [
      db,
      areaId,
      dispositivoId,
      inscrever,
      relatos,
      registrarRelato,
      sincronizar,
      confirmados,
      definirFonteGrande,
      definirAltoContraste,
    ],
  );

  return <ContextoMorador.Provider value={valor}>{children}</ContextoMorador.Provider>;
}

export function useMorador(): ValorMorador {
  const valor = useContext(ContextoMorador);
  if (!valor) throw new Error('useMorador precisa estar dentro de <ProvedorMorador>.');
  return valor;
}
