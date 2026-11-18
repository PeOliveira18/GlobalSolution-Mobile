import { randomUUID } from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { PALETA_PADRAO } from '@/themes/theme';
import { listarRelatos } from '@/services/relatoStorage';
import { lerPreferencias, salvarPreferencia } from '@/services/storageService';

import { ProvedorMorador, type DadosIniciaisMorador } from '@/contexts/MoradorContext';
import { ProvedorTema, type PreferenciasVisuais } from '@/contexts/TemaContext';

type DadosIniciais = { visual: PreferenciasVisuais; morador: DadosIniciaisMorador };

export function ProvedorDadosLocais({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [dados, setDados] = useState<DadosIniciais | null>(null);

  useEffect(() => {
    (async () => {
      const prefs = await lerPreferencias();
      let dispositivoId = prefs.dispositivo_id;
      if (!dispositivoId) {
        dispositivoId = randomUUID();
        await salvarPreferencia('dispositivo_id', dispositivoId);
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
      salvarPreferencia('fonte_grande', p.fonteGrande ? '1' : '0');
      salvarPreferencia('alto_contraste', p.altoContraste ? '1' : '0');
    },
    [],
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
