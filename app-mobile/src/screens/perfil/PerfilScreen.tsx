import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Aviso } from '@/components/Estados';
import { Grupo, LinhaAcao, TituloGrupo } from '@/components/Grupo';
import { LinhaInterruptor } from '@/components/LinhaInterruptor';
import { SeletorArea } from '@/components/SeletorArea';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { Espaco, Fonte, Raio } from '@/themes/theme';
import { useMorador } from '@/contexts/MoradorContext';
import { useTema } from '@/contexts/TemaContext';
import { confirmar } from '@/utils/confirmar';

export default function PerfilScreen() {
  const { cores, tamanho, preferencias, definirFonteGrande, definirAltoContraste } = useTema();
  const { areaId, inscrever, limparDados } = useMorador();
  const [aviso, setAviso] = useState<string | null>(null);

  const trocarArea = async (novaArea: number) => {
    if (novaArea === areaId) return;
    const ok = await inscrever(novaArea);
    setAviso(ok ? 'Área trocada. Os alertas agora são desta área.' : 'Área trocada no celular. Sem conexão com o servidor agora.');
  };

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
      <View style={styles.secao}>
        <TituloGrupo texto="Sua área" />
        <SeletorArea agrupado selecionada={areaId} aoSelecionar={trocarArea} rotuloGrupo="Trocar de área" />
      </View>
      {aviso ? <Aviso tipo="sucesso" texto={aviso} /> : null}

      <Grupo titulo="Leitura">
        <LinhaInterruptor
          agrupada
          rotulo="Letra grande"
          descricao="Aumenta todos os textos do app."
          dica="Toque duas vezes para ligar ou desligar a letra grande"
          ligado={preferencias.fonteGrande}
          aoMudar={mudarFonte}
        />
        <LinhaInterruptor
          agrupada
          rotulo="Alto contraste"
          descricao="Fundo preto e texto branco, mais fácil de ler."
          dica="Toque duas vezes para ligar ou desligar o alto contraste"
          ligado={preferencias.altoContraste}
          aoMudar={mudarContraste}
        />
      </Grupo>

      <Grupo titulo="Sobre o projeto">
        <View style={styles.linha}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={[styles.iconeApp, preferencias.altoContraste && { borderWidth: 2, borderColor: cores.borda }]}
            accessible={false}
          />
          <Texto variante="subtitulo" accessibilityRole="none" style={{ flex: 1 }}>
            Olho d&apos;Água
          </Texto>
        </View>
        <View style={styles.linha}>
          <Texto style={{ flex: 1 }}>
            O Olho d&apos;Água avisa os moradores de áreas de risco quando o córrego começa a subir, mostra o que
            fazer e para onde ir. Sensores medem o nível da água e os próprios vizinhos também avisam pelo app.
          </Texto>
        </View>
      </Grupo>

      <Grupo
        titulo="Objetivos de Desenvolvimento Sustentável (ONU)"
        rodape="Projeto acadêmico da Global Solution FIAP 2026.2. Áreas, abrigos e alertas são simulados.">
        {ODS.map((ods) => (
          <View key={ods.numero} accessible accessibilityLabel={`ODS ${ods.numero}: ${ods.texto}`} style={styles.linha}>
            <View
              style={[
                styles.selo,
                {
                  minWidth: tamanho(Fonte.corpo) + 26,
                  backgroundColor: cores.primariaSuave,
                  borderColor: preferencias.altoContraste ? cores.primaria : cores.primariaSuave,
                },
              ]}>
              <Texto variante="legenda" negrito style={{ color: cores.primaria, lineHeight: Math.round(tamanho(Fonte.legenda) * 1.1) }}>
                ODS
              </Texto>
              <Texto negrito style={{ color: cores.primaria, lineHeight: Math.round(tamanho(Fonte.corpo) * 1.15) }}>
                {ods.numero}
              </Texto>
            </View>
            <Texto style={{ flex: 1 }}>{ods.texto.charAt(0).toUpperCase() + ods.texto.slice(1)}</Texto>
          </View>
        ))}
      </Grupo>

      <Grupo titulo="Dados do celular">
        <LinhaAcao
          perigo
          rotulo="Limpar dados locais"
          dica="Apaga a área, as preferências e os relatos guardados neste celular"
          icone={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
          aoPressionar={limpar}
        />
      </Grupo>
    </Tela>
  );
}

const ODS = [
  { numero: 11, texto: 'cidades mais seguras, com menos perdas em desastres (meta 11.5).' },
  { numero: 13, texto: 'mais preparo para enfrentar chuvas e enchentes (meta 13.1).' },
  { numero: 10, texto: 'menos desigualdade, porque quem mora na várzea é quem mais sofre.' },
];

const styles = StyleSheet.create({
  secao: {
    gap: Espaco.sm,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 4,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm + 4,
  },
  iconeApp: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  selo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Espaco.xs,
    paddingVertical: Espaco.xs,
    borderRadius: Raio.sm,
    borderWidth: 1.5,
  },
});
