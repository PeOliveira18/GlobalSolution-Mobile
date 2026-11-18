import { View } from 'react-native';

import { Espaco } from '@/themes/theme';
import { useAreas } from '@/hooks/useAreas';

import { Carregando, ErroCarregar } from '@/components/Estados';
import { Grupo } from '@/components/Grupo';
import { OpcaoRadio } from '@/components/OpcaoRadio';

type SeletorAreaProps = {
  selecionada: number | null;
  aoSelecionar: (areaId: number) => void;
  rotuloGrupo: string;
  agrupado?: boolean;
};

export function SeletorArea({ selecionada, aoSelecionar, rotuloGrupo, agrupado }: SeletorAreaProps) {
  const { dados: areas, erro, carregando, recarregar } = useAreas();

  if (carregando) return <Carregando texto="Carregando as áreas…" />;
  if (erro || !areas) return <ErroCarregar mensagem={erro ?? 'Não foi possível carregar as áreas.'} aoTentarDeNovo={recarregar} />;

  const opcoes = areas.map((area) => (
    <OpcaoRadio
      key={area.id}
      rotulo={area.nome}
      descricao={area.bairro}
      dica="Toque duas vezes para escolher esta área"
      selecionada={selecionada === area.id}
      aoSelecionar={() => aoSelecionar(area.id)}
      agrupada={agrupado}
    />
  ));

  return (
    <View role="radiogroup" aria-label={rotuloGrupo} style={{ gap: Espaco.sm }}>
      {agrupado ? <Grupo>{opcoes}</Grupo> : opcoes}
    </View>
  );
}
