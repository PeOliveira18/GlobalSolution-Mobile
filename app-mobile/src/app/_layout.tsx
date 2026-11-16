import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { BotaoVoltar } from '@/components/botao-voltar';
import { ProvedorConexao } from '@/contexts/conexao';
import { ProvedorDadosLocais } from '@/contexts/dados-locais';
import { useTema } from '@/contexts/tema';
import { inicializarBanco, NOME_BANCO } from '@/db/esquema';

/**
 * Layout raiz (C3.3): banco SQLite → conexão (netinfo) → dados locais (tema + morador).
 * O `onInit` cria as tabelas antes de qualquer tela ler o banco.
 */
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
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.texto, fontWeight: '700' },
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: cores.fundo },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Sem botão de voltar: a escolha da área é obrigatória na 1ª abertura. */}
        <Stack.Screen
          name="onboarding"
          options={{
            title: 'Boas-vindas',
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
