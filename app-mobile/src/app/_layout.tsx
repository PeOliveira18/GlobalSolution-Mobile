import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { BotaoVoltar } from '@/components/BotaoVoltar';
import { ProvedorConexao } from '@/contexts/ConexaoContext';
import { ProvedorDadosLocais } from '@/contexts/DadosLocaisContext';
import { useTema } from '@/contexts/TemaContext';
import { inicializarBanco, NOME_BANCO } from '@/services/databaseService';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={NOME_BANCO} onInit={inicializarBanco}>
      <ProvedorConexao>
        <ProvedorDadosLocais>
          <NavegacaoRaiz />
        </ProvedorDadosLocais>
      </ProvedorConexao>
    </SQLiteProvider>
  );
}

function NavegacaoRaiz() {
  const { cores, preferencias } = useTema();

  return (
    <>
      <StatusBar style={preferencias.altoContraste ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.fundo },
          headerShadowVisible: false,
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.texto, fontWeight: '700' },
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: cores.fundo },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{
            title: 'Boas-vindas',
            headerShown: false,
            headerBackVisible: false,
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="alerta/[id]" options={{ title: 'Alerta', headerLeft: () => <BotaoVoltar /> }} />
        <Stack.Screen name="abrigo/[id]" options={{ title: 'Abrigo', headerLeft: () => <BotaoVoltar /> }} />
      </Stack>
    </>
  );
}
