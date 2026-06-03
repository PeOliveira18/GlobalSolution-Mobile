import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabs } from './BottomTabs';
import { RootStackParamList } from './navigationTypes';
import { AreaDetailScreen } from '../screens/AreaDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useThemeMode } from '../hooks/useThemeMode';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { colors, isDark } = useThemeMode();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }) => ({
            title: 'Configuracoes',
            headerBackVisible: false,
            headerLeft: ({ tintColor }) => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.65 : 1 }]}
              >
                <Ionicons name="chevron-back" size={24} color={tintColor ?? colors.primary} />
                <Text style={[styles.backText, { color: tintColor ?? colors.primary }]}>Home</Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AreaDetail"
          component={AreaDetailScreen}
          options={({ navigation, route }) => ({
            title: 'Detalhe da area',
            headerBackVisible: false,
            headerLeft: ({ tintColor }) => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.65 : 1 }]}
              >
                <Ionicons name="chevron-back" size={24} color={tintColor ?? colors.primary} />
                <Text style={[styles.backText, { color: tintColor ?? colors.primary }]}>
                  {route.params.originTitle ?? 'Voltar'}
                </Text>
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
