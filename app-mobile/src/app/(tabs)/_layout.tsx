import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { PlatformPressable } from 'expo-router/react-navigation';
import type { SymbolViewProps } from 'expo-symbols';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/icone';
import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/constants/theme';
import { useMorador } from '@/contexts/morador';
import { useTema } from '@/contexts/tema';

type Aba = {
  rota: 'index' | 'reportar' | 'abrigos' | 'perfil';
  titulo: string;
  dica: string;
  icone: SymbolViewProps['name'];
  /** Versão cheia do ícone, usada na aba ativa (no iOS). */
  iconeAtivo: SymbolViewProps['name'];
};

/** As 4 abas da C3.3, sempre com ícone + texto. */
const ABAS: Aba[] = [
  {
    rota: 'index',
    titulo: 'Início',
    dica: 'Mostra o nível do córrego e os alertas da sua área',
    icone: { ios: 'house', android: 'home', web: 'home' },
    iconeAtivo: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  {
    rota: 'reportar',
    titulo: 'Reportar',
    dica: 'Avise os vizinhos sobre um alagamento',
    icone: { ios: 'exclamationmark.bubble', android: 'campaign', web: 'campaign' },
    iconeAtivo: { ios: 'exclamationmark.bubble.fill', android: 'campaign', web: 'campaign' },
  },
  {
    rota: 'abrigos',
    titulo: 'Abrigos',
    dica: 'Mostra os abrigos mais próximos com vaga',
    icone: { ios: 'house.and.flag', android: 'night_shelter', web: 'night_shelter' },
    iconeAtivo: { ios: 'house.and.flag.fill', android: 'night_shelter', web: 'night_shelter' },
  },
  {
    rota: 'perfil',
    titulo: 'Perfil',
    dica: 'Troque de área e ajuste o tamanho da letra e o contraste',
    icone: { ios: 'person.crop.circle', android: 'person', web: 'person' },
    iconeAtivo: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const { cores, tamanho } = useTema();
  const { areaId } = useMorador();

  // Na 1ª abertura (sem área escolhida), o morador vai primeiro para o onboarding.
  if (areaId == null) return <Redirect href="/onboarding" />;

  // Altura justa para a pílula do ícone (32) + o rótulo + o respiro do item (5 em cima e 5 embaixo).
  // Cresce junto com a letra (fonte grande e fontScale do sistema), sem cortar o texto.
  const tamanhoRotulo = tamanho(14);
  const alturaRotulo = Math.ceil(tamanhoRotulo * fontScale * 1.3);
  const alturaBarra = Math.max(ALVO_TOQUE_MINIMO + Espaco.sm, 32 + alturaRotulo + 10 + Espaco.xs);
  // Aproxima os rótulos da borda de baixo, como a barra de abas do iOS, sem chegar no indicador de início.
  const margemInferior = Math.max(Espaco.xs, Math.round(insets.bottom * 0.65));

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerShadowVisible: false,
        headerTitleStyle: { color: cores.texto, fontWeight: '700' },
        sceneStyle: { backgroundColor: cores.fundo },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: { fontSize: tamanhoRotulo, fontWeight: '600' },
        tabBarItemStyle: { minHeight: ALVO_TOQUE_MINIMO + Espaco.sm },
        tabBarIconStyle: { width: 60, height: 32 },
        tabBarStyle: {
          height: alturaBarra + margemInferior,
          paddingBottom: margemInferior,
          paddingTop: Espaco.xs,
          backgroundColor: cores.superficie,
          borderTopColor: cores.bordaSuave,
        },
      }}>
      {ABAS.map((aba) => (
        <Tabs.Screen
          key={aba.rota}
          name={aba.rota}
          options={{
            title: aba.titulo,
            tabBarAccessibilityLabel: aba.titulo,
            // A aba ativa ganha uma pílula atrás do ícone e o ícone cheio, para não depender só da cor.
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.pilula,
                  focused && { backgroundColor: cores.primariaSuave, borderColor: cores.secundarioBorda },
                ]}>
                <Icone nome={focused ? aba.iconeAtivo : aba.icone} cor={color} tamanho={22} />
              </View>
            ),
            // O botão padrão já tem role "tab" e o estado "selecionado"; aqui só somamos a dica.
            tabBarButton: (props) => <PlatformPressable {...props} accessibilityHint={aba.dica} />,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pilula: {
    width: 60,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Raio.pilula,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
});
