import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Botao } from '@/components/botao';
import { Cartao } from '@/components/cartao';
import { Aviso } from '@/components/estados';
import { LinhaInterruptor } from '@/components/linha-interruptor';
import { SeletorArea } from '@/components/seletor-area';
import { Tela } from '@/components/tela';
import { Texto } from '@/components/texto';
import { Espaco } from '@/constants/theme';
import { useMorador } from '@/contexts/morador';
import { useTema } from '@/contexts/tema';
import { confirmar } from '@/utils/confirmar';

/** PERFIL (C3.3): trocar de área, letra grande, alto contraste, sobre o projeto e limpar dados. */
export default function PerfilScreen() {
  const { preferencias, definirFonteGrande, definirAltoContraste } = useTema();
  const { areaId, inscrever, limparDados } = useMorador();
  const [aviso, setAviso] = useState<string | null>(null);

  const trocarArea = async (novaArea: number) => {
    if (novaArea === areaId) return;
    const ok = await inscrever(novaArea);
    setAviso(ok ? 'Área trocada. Os alertas agora são desta área.' : 'Área trocada no celular. Sem conexão com o servidor agora.');
  };

  // As preferências também vão para a inscrição no servidor (C1.3: PrefereFonteGrande/AltoContraste).
  const mudarFonte = (ativo: boolean) => {
    definirFonteGrande(ativo);
    if (areaId != null) inscrever(areaId, { ...preferencias, fonteGrande: ativo });
  };
  const mudarContraste = (ativo: boolean) => {
    definirAltoContraste(ativo);
    if (areaId != null) inscrever(areaId, { ...preferencias, altoContraste: ativo });
  };

  const limpar = async () => {
    const certeza = await confirmar(
      'Limpar dados do celular?',
      'Sua área, suas preferências e seus relatos guardados neste celular serão apagados.',
      'Limpar',
    );
    if (!certeza) return;
    await limparDados();
    router.replace('/onboarding');
  };

  return (
    <Tela>
      <Texto variante="subtitulo">Sua área</Texto>
      <SeletorArea selecionada={areaId} aoSelecionar={trocarArea} rotuloGrupo="Trocar de área" />
      {aviso ? <Aviso tipo="sucesso" texto={aviso} /> : null}

      <Texto variante="subtitulo">Leitura</Texto>
      <LinhaInterruptor
        rotulo="Letra grande"
        descricao="Aumenta todos os textos do app."
        dica="Toque duas vezes para ligar ou desligar a letra grande"
        ligado={preferencias.fonteGrande}
        aoMudar={mudarFonte}
      />
      <LinhaInterruptor
        rotulo="Alto contraste"
        descricao="Fundo preto e texto branco, mais fácil de ler."
        dica="Toque duas vezes para ligar ou desligar o alto contraste"
        ligado={preferencias.altoContraste}
        aoMudar={mudarContraste}
      />

      <Texto variante="subtitulo">Sobre o projeto</Texto>
      <Cartao>
        <Texto>
          O Olho d&apos;Água avisa os moradores de áreas de risco quando o córrego começa a subir, mostra o que
          fazer e para onde ir. Sensores medem o nível da água e os próprios vizinhos também avisam pelo app.
        </Texto>
        <View style={{ gap: Espaco.xs }}>
          <Texto negrito>Objetivos de Desenvolvimento Sustentável (ONU)</Texto>
          <Texto>• ODS 11: cidades mais seguras, com menos perdas em desastres (meta 11.5).</Texto>
          <Texto>• ODS 13: mais preparo para enfrentar chuvas e enchentes (meta 13.1).</Texto>
          <Texto>• ODS 10: menos desigualdade, porque quem mora na várzea é quem mais sofre.</Texto>
        </View>
        <Texto variante="legenda" tom="secundario">
          Projeto acadêmico da Global Solution FIAP 2026.2. Áreas, abrigos e alertas são simulados.
        </Texto>
      </Cartao>

      <Texto variante="subtitulo">Dados do celular</Texto>
      <Botao
        rotulo="Limpar dados locais"
        dica="Apaga a área, as preferências e os relatos guardados neste celular"
        variante="perigo"
        icone={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
        aoPressionar={limpar}
      />
    </Tela>
  );
}
