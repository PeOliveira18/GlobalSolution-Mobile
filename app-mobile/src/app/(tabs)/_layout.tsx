import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { PlatformPressable } from 'expo-router/react-navigation';
import type { SymbolViewProps } from 'expo-symbols';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/icone';
import { ALVO_TOQUE_MINIMO, Espaco } from '@/constants/theme';
import { useMorador } from '@/contexts/morador';
import { useTema } from '@/contexts/tema';

type Aba = {
  rota: 'index' | 'reportar' | 'abrigos' | 'perfil';
  titulo: string;
  dica: string;
  icone: SymbolViewProps['name'];
};

/** As 4 abas da C3.3, sempre com ícone + texto. */
const ABAS: Aba[] = [
  {
    rota: 'index',
    titulo: 'Início',
    dica: 'Mostra o nível do córrego e os alertas da sua área',
    icone: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  {
    rota: 'reportar',
    titulo: 'Reportar',
    dica: 'Avise os vizinhos sobre um alagamento',
    icone: { ios: 'exclamationmark.bubble.fill', android: 'campaign', web: 'campaign' },
  },
  {
    rota: 'abrigos',
    titulo: 'Abrigos',
    dica: 'Mostra os abrigos mais próximos com vaga',
    icone: { ios: 'house.and.flag.fill', android: 'night_shelter', web: 'night_shelter' },
  },
  {
    rota: 'perfil',
    titulo: 'Perfil',
    dica: 'Troque de área e ajuste o tamanho da letra e o contraste',
    icone: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const { cores, tamanho } = useTema();
  const { areaId } = useMorador();

  // Na 1ª abertura (sem área escolhida), o morador vai primeiro para o onboarding.
  if (areaId == null) return <Redirect href="/onboarding" />;

  // A barra cresce junto com a letra (fonte grande e fontScale do sistema), sem cortar o texto.
  const tamanhoRotulo = tamanho(14);
  const alturaBarra = Math.max(ALVO_TOQUE_MINIMO + Espaco.md, 40 + tamanhoRotulo * fontScale * 1.4);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerTitleStyle: { color: cores.texto, fontWeight: '700' },
        sceneStyle: { backgroundColor: cores.fundo },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        // A aba ativa também ganha fundo, para não depender só da cor do texto.
        tabBarActiveBackgroundColor: cores.primariaSuave,
        tabBarLabelStyle: { fontSize: tamanhoRotulo, fontWeight: '600' },
        tabBarItemStyle: { minHeight: ALVO_TOQUE_MINIMO + Espaco.sm },
        tabBarStyle: {
          height: alturaBarra + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: cores.fundo,
          borderTopColor: cores.borda,
        },
      }}>
      {ABAS.map((aba) => (
        <Tabs.Screen
          key={aba.rota}
          name={aba.rota}
          options={{
            title: aba.titulo,
            tabBarAccessibilityLabel: aba.titulo,
            tabBarIcon: ({ color }) => <Icone nome={aba.icone} cor={color} />,
            // O botão padrão já tem role "tab" e o estado "selecionado"; aqui só somamos a dica.
            tabBarButton: (props) => <PlatformPressable {...props} accessibilityHint={aba.dica} />,
          }}
        />
      ))}
    </Tabs>
  );
}
