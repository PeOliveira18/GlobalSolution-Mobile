import { StyleSheet, View } from 'react-native';

import { Espaco, Raio } from '@/themes/theme';
import { useConexao } from '@/contexts/ConexaoContext';
import { useTema } from '@/contexts/TemaContext';
import { formatarQuando } from '@/utils/formatar';

import { Icone } from '@/components/Icone';
import { Texto } from '@/components/Texto';

export function BannerSemInternet({ dadosDe }: { dadosDe?: string | null }) {
  const { online } = useConexao();
  const { cores } = useTema();
  if (online && !dadosDe) return null;

  const motivo = online ? 'Servidor indisponível' : 'Sem internet';
  const texto = dadosDe
    ? `${motivo}: mostrando dados de ${formatarQuando(dadosDe)}.`
    : 'Sem internet. Seus relatos ficam guardados e serão enviados quando a conexão voltar.';

  return (
    <View
      accessible
      role="alert"
      accessibilityLiveRegion="assertive"
      style={[styles.banner, { borderColor: cores.faixas.ATENCAO.cor, backgroundColor: cores.faixas.ATENCAO.fundo }]}>
      <Icone nome={{ ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' }} cor={cores.texto} />
      <Texto negrito style={{ flex: 1 }}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    borderWidth: 2,
    borderRadius: Raio.lg,
    padding: Espaco.md,
  },
});
