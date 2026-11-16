import { View } from 'react-native';

import { Espaco, FAIXAS } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { StatusAtualSensor } from '@/types';
import { formatarMetros, formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { SeloFaixa } from './selo-faixa';
import { Texto } from './texto';

type CartaoNivelProps = {
  nomeArea: string;
  status: StatusAtualSensor;
};

/** Cartão grande do Início: nível do córrego da área com cor + ícone + texto e o horário. */
export function CartaoNivel({ nomeArea, status }: CartaoNivelProps) {
  const { cores } = useTema();
  const nivel = status.nivelCm != null ? formatarMetros(status.nivelCm) : undefined;

  return (
    <Cartao style={{ borderWidth: 2, borderColor: cores.faixas[status.faixa].cor }}>
      <Texto variante="legenda" tom="secundario">
        Nível do córrego · {nomeArea}
      </Texto>
      <SeloFaixa faixa={status.faixa} complemento={nivel} />
      <View style={{ gap: Espaco.xs }}>
        <Texto>{FAIXAS[status.faixa].explicacao}</Texto>
        <Texto variante="legenda" tom="secundario">
          {status.atualizadoEm
            ? `Última medição: ${formatarQuando(status.atualizadoEm)}`
            : 'O sensor ainda não enviou nenhuma medição.'}
        </Texto>
      </View>
    </Cartao>
  );
}
