import { randomUUID } from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { PALETA_PADRAO } from '@/constants/theme';
import { lerPreferencias, listarRelatos, salvarPreferencia } from '@/db/repositorio';

import { ProvedorMorador, type DadosIniciaisMorador } from './morador';
import { ProvedorTema, type PreferenciasVisuais } from './tema';

type DadosIniciais = { visual: PreferenciasVisuais; morador: DadosIniciaisMorador };

/**
 * Lê o SQLite uma vez ao abrir o app (preferências, área, dispositivo e relatos)
 * e só então monta o tema e os dados do morador com esses valores.
 */
export function ProvedorDadosLocais({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [dados, setDados] = useState<DadosIniciais | null>(null);

  useEffect(() => {
    (async () => {
      const prefs = await lerPreferencias(db);
      let dispositivoId = prefs.dispositivo_id;
      if (!dispositivoId) {
        // 1ª abertura: cria o identificador anônimo do celular.
        dispositivoId = randomUUID();
        await salvarPreferencia(db, 'dispositivo_id', dispositivoId);
      }
      setDados({
        visual: { fonteGrande: prefs.fonte_grande === '1', altoContraste: prefs.alto_contraste === '1' },
        morador: {
          areaId: prefs.area_id ? Number(prefs.area_id) : null,
          dispositivoId,
          relatos: await listarRelatos(db),
          confirmados: prefs.confirmados ? (JSON.parse(prefs.confirmados) as number[]) : [],
          inscricaoPendente: prefs.inscricao_pendente === '1',
        },
      });
    })();
  }, [db]);

  const gravarVisual = useCallback(
    (p: PreferenciasVisuais) => {
      salvarPreferencia(db, 'fonte_grande', p.fonteGrande ? '1' : '0');
      salvarPreferencia(db, 'alto_contraste', p.altoContraste ? '1' : '0');
    },
    [db],
  );

  if (!dados) {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PALETA_PADRAO.fundo }}
        accessibilityLabel="Abrindo o app">
        <ActivityIndicator color={PALETA_PADRAO.primaria} size="large" />
      </View>
    );
  }

  return (
    <ProvedorTema inicial={dados.visual} aoMudar={gravarVisual}>
      <ProvedorMorador inicial={dados.morador}>{children}</ProvedorMorador>
    </ProvedorTema>
  );
}
