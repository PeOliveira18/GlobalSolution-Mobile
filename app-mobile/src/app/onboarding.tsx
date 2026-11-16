import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Botao } from '@/components/botao';
import { LinhaInterruptor } from '@/components/linha-interruptor';
import { SeletorArea } from '@/components/seletor-area';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco } from '@/constants/theme';
import { useMorador } from '@/contexts/morador';
import { useTema } from '@/contexts/tema';

/**
 * 1ª abertura (C3.3): o morador escolhe a área e as preferências de acessibilidade,
 * e o celular é inscrito de forma anônima (POST /api/inscricoes).
 */
export default function OnboardingScreen() {
  const { preferencias, definirFonteGrande, definirAltoContraste } = useTema();
  const { areaId, inscrever } = useMorador();
  const [escolhida, setEscolhida] = useState<number | null>(areaId);
  const [salvando, setSalvando] = useState(false);

  const comecar = async () => {
    if (escolhida == null) return;
    setSalvando(true);
    // Mesmo sem servidor a escolha vale no celular; a inscrição é refeita na próxima mudança.
    await inscrever(escolhida, preferencias);
    setSalvando(false);
    router.replace('/');
  };

  return (
    <Tela>
      <View style={{ gap: Espaco.sm }}>
        <Texto variante="titulo">Olho d&apos;Água</Texto>
        <Texto>
          Avisamos quando o córrego perto da sua casa começar a subir, mostramos o que fazer e para onde ir.
        </Texto>
        <Texto variante="legenda" tom="secundario">
          Não pedimos nome, telefone nem CPF.
        </Texto>
      </View>

      <Texto variante="subtitulo">1. Onde você mora?</Texto>
      <SeletorArea selecionada={escolhida} aoSelecionar={setEscolhida} rotuloGrupo="Escolha a sua área" />

      <Texto variante="subtitulo">2. Como prefere ler?</Texto>
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
