import type { SQLiteDatabase } from 'expo-sqlite';

import type { TipoOcorrencia } from '@/types';

export type ChavePreferencia =
  | 'area_id'
  | 'dispositivo_id'
  | 'fonte_grande'
  | 'alto_contraste'
  | 'confirmados'
  | 'inscricao_pendente'
  | 'areas';

export async function lerPreferencias(db: SQLiteDatabase): Promise<Partial<Record<ChavePreferencia, string>>> {
  const linhas = await db.getAllAsync<{ chave: ChavePreferencia; valor: string }>(
    'SELECT chave, valor FROM preferencias',
  );
  return Object.fromEntries(linhas.map((l) => [l.chave, l.valor]));
}

export async function salvarPreferencia(db: SQLiteDatabase, chave: ChavePreferencia, valor: string) {
  await db.runAsync(
    'INSERT INTO preferencias (chave, valor) VALUES (?, ?) ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor',
    chave,
    valor,
  );
}

export async function apagarPreferencia(db: SQLiteDatabase, chave: ChavePreferencia) {
  await db.runAsync('DELETE FROM preferencias WHERE chave = ?', chave);
}

export type StatusSync = 'PENDENTE' | 'ENVIADO' | 'ERRO';

export type RelatoLocal = {
  idLocal: string;
  areaRiscoId: number;
  tipo: TipoOcorrencia;
  descricao: string | null;
  latitude: number;
  longitude: number;
  criadoEm: string;
  statusSync: StatusSync;
  idServidor: number | null;
};

type LinhaRelato = {
  id_local: string;
  area_risco_id: number;
  tipo: TipoOcorrencia;
  descricao: string | null;
  lat: number;
  lon: number;
  criado_em: string;
  status_sync: StatusSync;
  id_servidor: number | null;
};

const paraRelato = (l: LinhaRelato): RelatoLocal => ({
  idLocal: l.id_local,
  areaRiscoId: l.area_risco_id,
  tipo: l.tipo,
  descricao: l.descricao,
  latitude: l.lat,
  longitude: l.lon,
  criadoEm: l.criado_em,
  statusSync: l.status_sync,
  idServidor: l.id_servidor,
});

export async function listarRelatos(db: SQLiteDatabase): Promise<RelatoLocal[]> {
  const linhas = await db.getAllAsync<LinhaRelato>('SELECT * FROM relatos ORDER BY criado_em DESC');
  return linhas.map(paraRelato);
}

export async function listarPendentes(db: SQLiteDatabase): Promise<RelatoLocal[]> {
  const linhas = await db.getAllAsync<LinhaRelato>(
    "SELECT * FROM relatos WHERE status_sync = 'PENDENTE' ORDER BY criado_em ASC",
  );
  return linhas.map(paraRelato);
}

export async function inserirRelato(db: SQLiteDatabase, r: RelatoLocal) {
  await db.runAsync(
    `INSERT INTO relatos (id_local, area_risco_id, tipo, descricao, lat, lon, criado_em, status_sync, id_servidor)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    r.idLocal,
    r.areaRiscoId,
    r.tipo,
    r.descricao,
    r.latitude,
    r.longitude,
    r.criadoEm,
    r.statusSync,
    r.idServidor,
  );
}

export async function atualizarStatusRelato(
  db: SQLiteDatabase,
  idLocal: string,
  status: StatusSync,
  idServidor: number | null = null,
) {
  await db.runAsync(
    'UPDATE relatos SET status_sync = ?, id_servidor = COALESCE(?, id_servidor) WHERE id_local = ?',
    status,
    idServidor,
    idLocal,
  );
}

export async function salvarCache<T>(db: SQLiteDatabase, areaId: number, dados: T, quando: string) {
  await db.runAsync(
    `INSERT INTO cache_status (area_id, json, atualizado_em) VALUES (?, ?, ?)
     ON CONFLICT (area_id) DO UPDATE SET json = excluded.json, atualizado_em = excluded.atualizado_em`,
    areaId,
    JSON.stringify(dados),
    quando,
  );
}

export async function lerCache<T>(
  db: SQLiteDatabase,
  areaId: number,
): Promise<{ dados: T; atualizadoEm: string } | null> {
  const linha = await db.getFirstAsync<{ json: string; atualizado_em: string }>(
    'SELECT json, atualizado_em FROM cache_status WHERE area_id = ?',
    areaId,
  );
  return linha ? { dados: JSON.parse(linha.json) as T, atualizadoEm: linha.atualizado_em } : null;
}

export async function apagarTudo(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM relatos; DELETE FROM cache_status; DELETE FROM preferencias;');
  });
}
