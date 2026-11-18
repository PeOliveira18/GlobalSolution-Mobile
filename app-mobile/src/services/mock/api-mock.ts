import type {
  Abrigo,
  Alerta,
  Area,
  Inscricao,
  Ocorrencia,
  ProblemDetails,
  Sensor,
  StatusAtualSensor,
} from '@/types';
import { paraIsoSaoPaulo } from '@/utils/datas';
import { distanciaMetros } from '@/utils/geo';

import type { ApiOlhoDagua } from '../contrato';
import { estaConectado } from '../conexao';
import { ErroApi } from '../erros';
import abrigosJson from './abrigos.json';
import alertasJson from './alertas.json';
import areasJson from './areas.json';
import ocorrenciasJson from './ocorrencias.json';
import sensoresJson from './sensores.json';
import statusJson from './status-sensores.json';

const LATENCIA_MS = 300;
const JANELA_COMUNITARIA_MS = 60 * 60 * 1000;
const MINIMO_RELATOS_COMUNITARIO = 3;

const copiar = <T>(valor: unknown): T =>
  valor === undefined ? (undefined as T) : (JSON.parse(JSON.stringify(valor)) as T);

const banco = {
  areas: copiar<Area[]>(areasJson),
  abrigos: copiar<Abrigo[]>(abrigosJson),
  alertas: copiar<Alerta[]>(alertasJson),
  ocorrencias: copiar<Ocorrencia[]>(ocorrenciasJson),
  sensores: copiar<Sensor[]>(sensoresJson),
  status: copiar<StatusAtualSensor[]>(statusJson),
  inscricoes: [] as Inscricao[],
};

trazerDatasParaAgora();

function trazerDatasParaAgora() {
  const campos: { lista: Record<string, unknown>[]; chaves: string[] }[] = [
    { lista: banco.alertas, chaves: ['criadoEm', 'encerradoEm'] },
    { lista: banco.ocorrencias, chaves: ['criadaEm'] },
    { lista: banco.status, chaves: ['atualizadoEm'] },
  ];

  let maisRecente = 0;
  for (const { lista, chaves } of campos)
    for (const item of lista)
      for (const chave of chaves)
        if (typeof item[chave] === 'string') maisRecente = Math.max(maisRecente, Date.parse(item[chave]));

  const deslocamento = Date.now() - 5 * 60 * 1000 - maisRecente;
  for (const { lista, chaves } of campos)
    for (const item of lista)
      for (const chave of chaves)
        if (typeof item[chave] === 'string')
          item[chave] = paraIsoSaoPaulo(new Date(Date.parse(item[chave]) + deslocamento));
}

const esperar = <T>(valor: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(copiar<T>(valor)), LATENCIA_MS));

const falhar = (status: number, title: string, detail?: string, errors?: ProblemDetails['errors']) =>
  Promise.reject(new ErroApi('http', status, title, { title, status, detail, errors }));

const naoEncontrado = (recurso: string, id: number | string) =>
  falhar(404, 'Recurso não encontrado', `${recurso} ${id} não foi encontrado(a).`);

const proximoId = (lista: { id: number }[]) => Math.max(0, ...lista.map((i) => i.id)) + 1;

const agoraIso = () => paraIsoSaoPaulo(new Date());

function sanitizar(texto: string): string {
  return texto
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?(\d{2})\b/g, '***.***.***-$1')
    .replace(/(?:\+?55[\s-]?)?\(?\b(\d{2})\)?[\s-]?9?\d{4}[\s-]?(\d{4})\b/g, '($1) *****-$2');
}

function areaDoPonto(lat: number, lon: number): Area | undefined {
  return banco.areas
    .map((area) => ({ area, distancia: distanciaMetros(area.latitude, area.longitude, lat, lon) }))
    .filter(({ area, distancia }) => distancia <= area.raioMetros)
    .sort((a, b) => a.distancia - b.distancia)[0]?.area;
}

function avaliarAlertaComunitario(area: Area) {
  const ativo = banco.alertas.find(
    (a) => a.tipo === 'COMUNITARIO' && a.ativo && a.areaRiscoId === area.id,
  );
  const quantidade = ativo
    ? (ativo.quantidadeRelatos ?? 0) + 1
    : banco.ocorrencias.filter(
        (o) =>
          o.areaRiscoId === area.id &&
          o.status !== 'RESOLVIDA' &&
          Date.now() - Date.parse(o.criadaEm) <= JANELA_COMUNITARIA_MS,
      ).length;

  if (!ativo && quantidade < MINIMO_RELATOS_COMUNITARIO) return;

  const mensagem =
    `${quantidade} moradores relataram alagamento em ${area.nome} na última hora. ` +
    'Evite a região e proteja seus pertences.';
  const prioridade = 300 + Math.min(quantidade, 5) * 5;

  if (ativo) {
    Object.assign(ativo, { quantidadeRelatos: quantidade, mensagem, prioridade });
    return;
  }

  banco.alertas.push({
    id: proximoId(banco.alertas),
    tipo: 'COMUNITARIO',
    areaRiscoId: area.id,
    areaNome: area.nome,
    severidade: 'ALTA',
    mensagem,
    prioridade,
    ativo: true,
    criadoEm: agoraIso(),
    encerradoEm: null,
    sensorCodigo: null,
    nivelCm: null,
    faixa: null,
    quantidadeRelatos: quantidade,
    probabilidadeChuvaForte: null,
    janelaHoras: null,
  });
}

const apiMockBase: ApiOlhoDagua = {
  listarAreas: () => esperar(banco.areas),

  obterArea: (id) => {
    const area = banco.areas.find((a) => a.id === id);
    if (!area) return naoEncontrado('Área de risco', id);
    return esperar({
      ...area,
      alertasAtivos: banco.alertas.filter((a) => a.areaRiscoId === id && a.ativo).length,
      ocorrenciasAbertas: banco.ocorrencias.filter((o) => o.areaRiscoId === id && o.status !== 'RESOLVIDA')
        .length,
    });
  },

  rankingAreas: (dias = 7) => {
    const desde = Date.now() - dias * 24 * 60 * 60 * 1000;
    return esperar(
      banco.areas
        .map((area) => ({
          areaRiscoId: area.id,
          nome: area.nome,
          bairro: area.bairro,
          nivelRiscoHistorico: area.nivelRiscoHistorico,
          totalOcorrencias: banco.ocorrencias.filter(
            (o) => o.areaRiscoId === area.id && Date.parse(o.criadaEm) >= desde,
          ).length,
        }))
        .sort((a, b) => b.totalOcorrencias - a.totalOcorrencias),
    );
  },

  listarAlertas: ({ areaId, ativos = true } = {}) =>
    esperar(
      banco.alertas
        .filter((a) => (areaId === undefined || a.areaRiscoId === areaId) && (!ativos || a.ativo))
        .sort((a, b) => b.prioridade - a.prioridade),
    ),

  obterAlerta: (id) => {
    const alerta = banco.alertas.find((a) => a.id === id);
    return alerta ? esperar(alerta) : naoEncontrado('Alerta', id);
  },

  listarOcorrencias: ({ areaId, status } = {}) =>
    esperar(
      banco.ocorrencias
        .filter((o) => (areaId === undefined || o.areaRiscoId === areaId) && (!status || o.status === status))
        .sort((a, b) => Date.parse(b.criadaEm) - Date.parse(a.criadaEm)),
    ),

  registrarOcorrencia: (relato) => {
    const existente = banco.ocorrencias.find((o) => o.idLocalApp === relato.idLocalApp);
    if (existente) return esperar(existente);

    if (relato.descricao && relato.descricao.length > 280) {
      return falhar(400, 'Dados inválidos', undefined, {
        descricao: ['A descrição pode ter no máximo 280 caracteres.'],
      });
    }

    const area =
      relato.areaRiscoId != null
        ? banco.areas.find((a) => a.id === relato.areaRiscoId)
        : areaDoPonto(relato.latitude, relato.longitude);
    if (!area) {
      return falhar(
        400,
        'Regra de negócio violada',
        relato.areaRiscoId != null
          ? `A área de risco ${relato.areaRiscoId} não existe.`
          : 'A localização informada está fora das áreas monitoradas.',
      );
    }

    const nova: Ocorrencia = {
      id: proximoId(banco.ocorrencias),
      areaRiscoId: area.id,
      tipo: relato.tipo,
      descricao: relato.descricao ? sanitizar(relato.descricao) : null,
      latitude: Math.round(relato.latitude * 1000) / 1000,
      longitude: Math.round(relato.longitude * 1000) / 1000,
      status: 'ABERTA',
      confirmacoes: 0,
      criadaEm: agoraIso(),
      idLocalApp: relato.idLocalApp,
    };
    banco.ocorrencias.push(nova);
    avaliarAlertaComunitario(area);
    return esperar(nova);
  },

  confirmarOcorrencia: (id) => {
    const ocorrencia = banco.ocorrencias.find((o) => o.id === id);
    if (!ocorrencia) return naoEncontrado('Ocorrência', id);
    if (ocorrencia.status === 'RESOLVIDA') {
      return falhar(409, 'Conflito', 'Não é possível confirmar uma ocorrência já resolvida.');
    }
    ocorrencia.confirmacoes += 1;
    if (ocorrencia.confirmacoes >= 2) ocorrencia.status = 'CONFIRMADA';
    return esperar(ocorrencia);
  },

  resolverOcorrencia: (id) => {
    const ocorrencia = banco.ocorrencias.find((o) => o.id === id);
    if (!ocorrencia) return naoEncontrado('Ocorrência', id);
    if (ocorrencia.status === 'RESOLVIDA') {
      return falhar(409, 'Conflito', 'A ocorrência já está resolvida.');
    }
    ocorrencia.status = 'RESOLVIDA';
    return esperar(undefined);
  },

  listarAbrigos: (areaId) =>
    esperar(banco.abrigos.filter((a) => areaId === undefined || a.areaRiscoId === areaId)),

  obterAbrigo: (id) => {
    const abrigo = banco.abrigos.find((a) => a.id === id);
    return abrigo ? esperar(abrigo) : naoEncontrado('Abrigo', id);
  },

  abrigosProximos: ({ lat, lon, acessivel, limite = 5 }) => {
    if (limite < 1 || limite > 50) {
      return falhar(400, 'Regra de negócio violada', 'O limite deve ser de 1 a 50 abrigos.');
    }
    return esperar(
      banco.abrigos
        .filter((a) => a.vagasLivres > 0 && (acessivel === undefined || a.acessivel === acessivel))
        .map((a) => ({
          ...a,
          distanciaMetros: Math.round(distanciaMetros(a.latitude, a.longitude, lat, lon)),
        }))
        .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
        .slice(0, limite),
    );
  },

  registrarEntradaAbrigo: (id, pessoas) => {
    const abrigo = banco.abrigos.find((a) => a.id === id);
    if (!abrigo) return naoEncontrado('Abrigo', id);
    if (pessoas > abrigo.vagasLivres) {
      return falhar(409, 'Conflito', `O abrigo só tem ${abrigo.vagasLivres} vaga(s) livre(s).`);
    }
    abrigo.ocupacao += pessoas;
    abrigo.vagasLivres -= pessoas;
    return esperar(abrigo);
  },

  salvarInscricao: (dados) => {
    if (!banco.areas.some((a) => a.id === dados.areaRiscoId)) {
      return falhar(400, 'Regra de negócio violada', `A área de risco ${dados.areaRiscoId} não existe.`);
    }
    const existente = banco.inscricoes.find((i) => i.dispositivoId === dados.dispositivoId);
    if (existente) {
      Object.assign(existente, dados, { atualizadaEm: agoraIso() });
      return esperar(existente);
    }
    const nova: Inscricao = {
      id: proximoId(banco.inscricoes),
      ...dados,
      criadaEm: agoraIso(),
      atualizadaEm: null,
    };
    banco.inscricoes.push(nova);
    return esperar(nova);
  },

  obterInscricao: (dispositivoId) => {
    const inscricao = banco.inscricoes.find((i) => i.dispositivoId === dispositivoId);
    return inscricao ? esperar(inscricao) : naoEncontrado('Inscrição do dispositivo', dispositivoId);
  },

  listarSensores: (areaRiscoId) =>
    esperar(banco.sensores.filter((s) => areaRiscoId === undefined || s.areaRiscoId === areaRiscoId)),

  statusSensor: (codigo) => {
    const status = banco.status.find((s) => s.sensorCodigo === codigo.toUpperCase());
    return status ? esperar(status) : naoEncontrado('Sensor', codigo);
  },
};

export const apiMock = Object.fromEntries(
  Object.entries(apiMockBase).map(([nome, metodo]) => [
    nome,
    (...args: unknown[]) =>
      estaConectado()
        ? (metodo as (...a: unknown[]) => Promise<unknown>)(...args)
        : Promise.reject(new ErroApi('rede', 0, 'Sem conexão (simulado no modo mock)')),
  ]),
) as unknown as ApiOlhoDagua;
