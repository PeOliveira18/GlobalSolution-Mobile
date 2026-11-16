import { View } from 'react-native';

import { Espaco } from '@/constants/theme';
import { useAreas } from '@/hooks/use-areas';

import { Carregando, ErroCarregar } from './estados';
import { OpcaoRadio } from './opcao-radio';

type SeletorAreaProps = {
  selecionada: number | null;
  aoSelecionar: (areaId: number) => void;
  /** Como o leitor de tela descreve o grupo, ex.: "Escolha a sua área". */
  rotuloGrupo: string;
};

/** Lista das áreas de risco (GET /api/areas) como opções de escolha única. */
export function SeletorArea({ selecionada, aoSelecionar, rotuloGrupo }: SeletorAreaProps) {
  const { dados: areas, erro, carregando, recarregar } = useAreas();

  if (carregando) return <Carregando texto="Carregando as áreas…" />;
  if (erro || !areas) return <ErroCarregar mensagem={erro ?? 'Não foi possível carregar as áreas.'} aoTentarDeNovo={recarregar} />;

  return (
    <View role="radiogroup" aria-label={rotuloGrupo} style={{ gap: Espaco.sm }}>
      {areas.map((area) => (
        <OpcaoRadio
          key={area.id}
          rotulo={area.nome}
          descricao={area.bairro}
          dica="Toque duas vezes para escolher esta área"
          selecionada={selecionada === area.id}
          aoSelecionar={() => aoSelecionar(area.id)}
        />
      ))}
    </View>
  );
}
