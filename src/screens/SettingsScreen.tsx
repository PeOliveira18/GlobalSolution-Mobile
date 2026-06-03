import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';

type SettingsButtonProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function SettingsButton({ title, description, icon, onPress }: SettingsButtonProps) {
  const { colors } = useThemeMode();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.settingDescription, { color: colors.muted }]}>{description}</Text>
      </View>
    </Pressable>
  );
}

export function SettingsScreen() {
  const { colors, isDark, toggleDarkMode } = useThemeMode();
  const { clearFavorites, clearHistory } = useAgriculture();

  const confirmClearFavorites = () => {
    Alert.alert('Limpar favoritos', 'Deseja remover todas as areas favoritas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const confirmClearHistory = () => {
    Alert.alert('Limpar historico', 'Deseja remover o historico recente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <Screen edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Aparencia">
          <View style={[styles.themeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Dark mode</Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Alterna entre tema claro e escuro.
              </Text>
            </View>
            <Switch value={isDark} onValueChange={toggleDarkMode} />
          </View>
        </Section>

        <Section title="Dados locais">
          <View style={styles.buttonList}>
            <SettingsButton
              title="Limpar favoritos"
              description="Remove todas as areas salvas."
              icon="star-outline"
              onPress={confirmClearFavorites}
            />
            <SettingsButton
              title="Limpar historico"
              description="Remove consultas recentes do aparelho."
              icon="time-outline"
              onPress={confirmClearHistory}
            />
          </View>
        </Section>

        <Section title="Sobre o app">
          <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>AgroOrbit</Text>
            <Text style={[styles.aboutText, { color: colors.muted }]}>
              Plataforma de monitoramento agricola conectada a dados climaticos,
              sensoriamento remoto e sustentabilidade.
            </Text>
            <Text style={[styles.aboutMeta, { color: colors.primary }]}>
              ODS 2 | ODS 9 | ODS 13 | ODS 8
            </Text>
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 32,
    gap: 22,
  },
  themeRow: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonList: {
    gap: 10,
  },
  settingButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  aboutCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 21,
  },
  aboutMeta: {
    fontSize: 13,
    fontWeight: '900',
  },
});
