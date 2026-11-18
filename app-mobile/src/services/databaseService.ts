import type { SQLiteDatabase } from 'expo-sqlite';

export const NOME_BANCO = 'olhodagua.db';

const VERSAO_ATUAL = 1;

export async function inicializarBanco(db: SQLiteDatabase): Promise<void> {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  await db.withTransactionAsync(async () => {
    if (versao < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS relatos (
          id_local      TEXT PRIMARY KEY NOT NULL,
          area_risco_id INTEGER NOT NULL,
          tipo          TEXT NOT NULL,
          descricao     TEXT,
          lat           REAL NOT NULL,
          lon           REAL NOT NULL,
          criado_em     TEXT NOT NULL,
          status_sync   TEXT NOT NULL DEFAULT 'PENDENTE'
                        CHECK (status_sync IN ('PENDENTE', 'ENVIADO', 'ERRO')),
          id_servidor   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_relatos_status ON relatos (status_sync);

        CREATE TABLE IF NOT EXISTS cache_status (
          area_id       INTEGER PRIMARY KEY NOT NULL,
          json          TEXT NOT NULL,
          atualizado_em TEXT NOT NULL
        );
      `);
    }
    await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
  });
}
