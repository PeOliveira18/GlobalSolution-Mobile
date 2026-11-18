import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { Icone } from '@/components/icone';
import { LinhaInterruptor } from '@/components/linha-interruptor';
import { SeletorArea } from '@/components/seletor-area';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { TituloPasso } from '@/components/titulo-passo';
import { Espaco, Fonte, Raio } from '@/constants/theme';
import { useMorador } from '@/contexts/morador';
import { useTema } from '@/contexts/tema';

export default function OnboardingScreen() {
  const { cores, tamanho, preferencias, definirFonteGrande, definirAltoContraste } = useTema();
  const { areaId, inscrever } = useMorador();
  const [escolhida, setEscolhida] = useState<number | null>(areaId);
  const [salvando, setSalvando] = useState(false);

  const comecar = async () => {
    if (escolhida == null) return;
    setSalvando(true);
    await inscrever(escolhida, preferencias);
    setSalvando(false);
    router.replace('/');
  };

  const verde = cores.faixas.NORMAL;
  const tamanhoMarca = tamanho(Fonte.marca);

  return (
    <Tela margemSegura>
      <View style={styles.topo}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={[styles.icone, preferencias.altoContraste && { borderWidth: 2, borderColor: cores.borda }]}
          accessible={false}
        />
        <View style={{ alignItems: 'center' }}>
          <Texto variante="legenda" negrito style={{ color: cores.primaria, letterSpacing: 0.4 }}>
            Boas-vindas
          </Texto>
          <Texto
            variante="titulo"
            style={{ fontSize: tamanhoMarca, lineHeight: Math.round(tamanhoMarca * 1.25), textAlign: 'center' }}>
            Olho d&apos;Água
          </Texto>
        </View>
        <Texto style={{ textAlign: 'center' }}>
          Avisamos quando o córrego perto da sua casa começar a subir, mostramos o que fazer e para onde ir.
        </Texto>
        <View
          style={[
            styles.privacidade,
            { backgroundColor: verde.fundo, borderColor: preferencias.altoContraste ? verde.cor : verde.fundo },
          ]}>
          <Icone nome={{ ios: 'lock.shield.fill', android: 'shield_lock', web: 'shield_lock' }} cor={verde.cor} tamanho={tamanho(22)} />
          <Texto variante="legenda" negrito style={{ flexShrink: 1 }}>
            Não pedimos nome, telefone nem CPF.
          </Texto>
        </View>
      </View>

      <TituloPasso numero={1} texto="Onde você mora?" />
      <SeletorArea selecionada={escolhida} aoSelecionar={setEscolhida} rotuloGrupo="Escolha a sua área" />

      <TituloPasso numero={2} texto="Como prefere ler?" />
      <LinhaInterruptor
        rotulo="Letra grande"
        descricao="Aumenta todos os textos do app."
        dica="Toque duas vezes para ligar ou desligar a letra grande"
        ligado={preferencias.fonteGrande}
        aoMudar={definirFonteGrande}
      />
      <LinhaInterruptor
        rotulo="Alto contraste"
        descricao="Fundo preto e texto branco, mais fácil de ler."
        dica="Toque duas vezes para ligar ou desligar o alto contraste"
        ligado={preferencias.altoContraste}
        aoMudar={definirAltoContraste}
      />

      <Botao
        grande
        rotulo="Começar"
        dica={escolhida == null ? 'Escolha a sua área primeiro' : 'Salva suas escolhas e abre o app'}
        icone={{ ios: 'arrow.right.circle.fill', android: 'check', web: 'check' }}
        desabilitado={escolhida == null}
        carregando={salvando}
        aoPressionar={comecar}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: {
    alignItems: 'center',
    gap: Espaco.sm + 4,
    paddingTop: Espaco.sm,
    paddingBottom: Espaco.sm,
  },
  icone: {
    width: 84,
    height: 84,
    borderRadius: 20,
  },
  privacidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm + 2,
    borderRadius: Raio.lg,
    borderWidth: 1.5,
  },
});
